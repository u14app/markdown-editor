import { EditorView } from "@codemirror/view";
import { callAI, type AIConfig } from "./api";
import {
  startAIRequest,
  completeAIRequest,
  errorAIRequest,
  showAIHighlight,
  hideAIHighlight,
} from "./state";
import * as icons from "../../icons";
import type { AIPluginI18n } from "./index";

interface Preset {
  key: keyof AIPluginI18n;
  label: string;
  icon: string;
  description: string;
}

const tooltipPresets: Preset[] = [
  {
    key: "improveWriting",
    label: "Improve writing",
    icon: icons.wand,
    description:
      "Improve the writing quality of the following text. Enhance clarity, flow, and readability while preserving the original meaning and tone.",
  },
  {
    key: "emojify",
    label: "Emojify",
    icon: icons.smile,
    description:
      "Add relevant and appropriate emojis to the following text to make it more expressive and engaging, without changing the meaning.",
  },
  {
    key: "makeLonger",
    label: "Make longer",
    icon: icons.listPlus,
    description:
      "Expand and elaborate on the following text. Add more detail, examples, or context while maintaining the original message and style.",
  },
  {
    key: "makeShorter",
    label: "Make shorter",
    icon: icons.listMinus,
    description:
      "Condense the following text to be more concise. Remove redundancy and unnecessary words while preserving the core meaning.",
  },
  {
    key: "fixSpellingGrammar",
    label: "Fix spelling & grammar",
    icon: icons.spellCheck,
    description:
      "Fix all spelling mistakes, grammatical errors, and punctuation issues in the following text. Do not change the meaning or style.",
  },
  {
    key: "simplifyLanguage",
    label: "Simplify language",
    icon: icons.penLine,
    description:
      "Rewrite the following text using simpler, more accessible language. Reduce complexity while keeping the meaning intact.",
  },
];

const slashPresets: Preset[] = [
  {
    key: "continueWriting",
    label: "Continue writing",
    icon: icons.penTool,
    description:
      "Continue writing naturally from where the context text left off. Match the existing tone, style, and topic.",
  },
  {
    key: "summary",
    label: "Summary",
    icon: icons.fileText,
    description:
      "Provide a concise summary of the context text. Capture the key points and main ideas.",
  },
  {
    key: "comment",
    label: "Comment",
    icon: icons.messageSquare,
    description:
      "Based on the context provided, add helpful comments or annotations to explain key points, decisions, or important details.",
  },
  {
    key: "explain",
    label: "Explain",
    icon: icons.helpCircle,
    description:
      "Explain the context text in a clear and understandable way. Break down any complex concepts.",
  },
];

const MAX_CONTEXT_LENGTH = 2000;

export class AIDialog {
  dom: HTMLElement;
  input!: HTMLInputElement;
  commandsContainer!: HTMLElement;
  view: EditorView;
  config: AIConfig;
  i18n?: Partial<AIPluginI18n>;
  clickHandler: (e: MouseEvent) => void;
  savedSelection: { from: number; to: number } | null = null;
  hasSelection = false;

  constructor(view: EditorView, config: AIConfig & { i18n?: Partial<AIPluginI18n> }) {
    this.view = view;
    this.config = config;
    this.i18n = config.i18n;
    this.clickHandler = (e: MouseEvent) => {
      if (!this.dom.contains(e.target as Node)) this.hide();
    };
    this.dom = this.createDOM();
    view.dom.appendChild(this.dom);
  }

  createDOM(): HTMLElement {
    const container = document.createElement("div");
    container.className = "cm-ai-dialog";
    container.style.display = "none";

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "cm-ai-dialog-input-wrapper";

    this.input = document.createElement("input");
    this.input.placeholder = this.i18n?.askAIPlaceholder || "Ask AI anything...";
    this.input.className = "cm-ai-dialog-input";
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.submit();
      }
      if (e.key === "Escape") {
        this.hide();
      }
    });
    inputWrapper.appendChild(this.input);

    const sendBtn = document.createElement("button");
    sendBtn.className = "cm-ai-dialog-send-btn";
    sendBtn.innerHTML = icons.send;
    sendBtn.addEventListener("click", () => this.submit());
    inputWrapper.appendChild(sendBtn);

    container.appendChild(inputWrapper);

    this.commandsContainer = document.createElement("div");
    this.commandsContainer.className = "cm-ai-dialog-commands";
    container.appendChild(this.commandsContainer);

    container.addEventListener("mousedown", (e) => e.preventDefault());
    document.addEventListener("click", this.clickHandler);

    return container;
  }

  private submit() {
    const value = this.input.value.trim();
    if (!value) return;
    if (this.hasSelection) {
      this.handleCommand(value);
    } else {
      this.handleSlashCommand(value);
    }
  }

  private renderPresets(presets: Preset[], handler: (desc: string) => void) {
    this.commandsContainer.innerHTML = "";
    presets.forEach((preset) => {
      const btn = document.createElement("button");
      btn.className = "cm-ai-dialog-btn";
      const label = this.i18n?.[preset.key] || preset.label;
      btn.innerHTML = `<span class="cm-ai-dialog-btn-icon">${preset.icon}</span>${label}`;
      btn.addEventListener("click", () => handler(preset.description));
      this.commandsContainer.appendChild(btn);
    });
  }

  show(
    position: { top: number; left: number },
    selection?: { from: number; to: number },
  ) {
    this.hasSelection = !!selection;

    if (selection) {
      this.savedSelection = selection;
      this.view.dispatch({
        effects: showAIHighlight.of({ from: selection.from, to: selection.to }),
      });
      this.renderPresets(tooltipPresets, (desc) => this.handleCommand(desc));
    } else {
      this.savedSelection = null;
      this.renderPresets(slashPresets, (desc) => this.handleSlashCommand(desc));
    }

    // Convert viewport coords to editor-relative
    const editorRect = this.view.dom.getBoundingClientRect();
    const scrollTop = this.view.dom.scrollTop;
    const relativeTop = position.top - editorRect.top + scrollTop;

    // Temporarily show to measure height
    this.dom.style.visibility = "hidden";
    this.dom.style.display = "block";
    this.dom.style.left = "0px";
    const dialogHeight = this.dom.offsetHeight;
    this.dom.style.visibility = "";

    // Overflow detection: prefer below, flip to above if needed
    const lineBottom = position.top + 28;
    const editorBottom = editorRect.top + this.view.dom.clientHeight;
    const viewportBottom = window.innerHeight;

    if (lineBottom + dialogHeight > Math.min(editorBottom, viewportBottom)) {
      // Flip to above
      const relativeTopAbove = relativeTop - dialogHeight - 4;
      this.dom.style.top = `${Math.max(relativeTopAbove, 0)}px`;
    } else {
      this.dom.style.top = `${relativeTop + 28}px`;
    }

    this.input.value = "";
    this.input.focus();
  }

  hide() {
    this.dom.style.display = "none";
    this.savedSelection = null;
    this.view.dispatch({
      effects: hideAIHighlight.of(null),
    });
  }

  async handleCommand(instruction: string) {
    const selection = this.savedSelection || this.view.state.selection.main;
    if (selection.from === selection.to) return;

    const text = this.view.state.sliceDoc(selection.from, selection.to);
    this.dom.style.display = "none";

    let insertPos = selection.from;
    this.view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: "" },
      effects: [startAIRequest.of(null), hideAIHighlight.of(null)],
    });
    this.savedSelection = null;

    try {
      const prompt = `The following are the writing needs of users:
<instruction>
${instruction}
</instruction>

This is the original text, if it exists:
<originText>
${text}
</originText>
`;
      await callAI(prompt, this.config, (chunk) => {
        this.view.dispatch({
          changes: { from: insertPos, insert: chunk },
        });
        insertPos += chunk.length;
      });

      this.view.dispatch({ effects: completeAIRequest.of(null) });
    } catch (error) {
      this.view.dispatch({
        effects: errorAIRequest.of(
          error instanceof Error ? error.message : "AI request failed",
        ),
      });
    }
  }

  async handleSlashCommand(instruction: string) {
    const head = this.view.state.selection.main.head;
    const line = this.view.state.doc.lineAt(head);
    const textBefore = this.view.state.sliceDoc(0, line.from);
    const context =
      textBefore.length > MAX_CONTEXT_LENGTH
        ? textBefore.slice(textBefore.length - MAX_CONTEXT_LENGTH)
        : textBefore;

    this.dom.style.display = "none";

    let insertPos = head;
    this.view.dispatch({ effects: startAIRequest.of(null) });

    try {
      const prompt = `The following are the writing needs of users:
<instruction>
${instruction}
</instruction>

This is the context before the current cursor position:
<context>
${context}
</context>
`;
      await callAI(prompt, this.config, (chunk) => {
        this.view.dispatch({
          changes: { from: insertPos, insert: chunk },
        });
        insertPos += chunk.length;
      });

      this.view.dispatch({ effects: completeAIRequest.of(null) });
    } catch (error) {
      this.view.dispatch({
        effects: errorAIRequest.of(
          error instanceof Error ? error.message : "AI request failed",
        ),
      });
    }
  }

  destroy() {
    document.removeEventListener("click", this.clickHandler);
    this.dom.remove();
  }
}
