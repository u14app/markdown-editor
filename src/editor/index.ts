import { type Text, type Extension } from "@codemirror/state";
import {
  EditorView,
  keymap,
  placeholder,
  type KeyBinding,
} from "@codemirror/view";
import { type LanguageDescription } from "@codemirror/language";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";

export interface EditorConfig {
  root: Element | DocumentFragment | null;
  defaultValue?: string | Text;
  languages?: LanguageDescription[];
  themes?: Extension[];
  extensions?: Extension[];
  keymaps?: KeyBinding[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export class MarkdownEditor {
  readonly EditorView = EditorView;
  readonly root: Element | DocumentFragment | null;
  readonly defaultValue?: string | Text;
  extensions: Extension[];
  view?: EditorView;
  languages: LanguageDescription[];
  themes: Extension[];
  keymaps: KeyBinding[];
  placeholder: string;
  onChange?: (value: string) => void;
  status: "init" | "create" | "destroy";
  constructor(config: EditorConfig) {
    this.root = config.root;
    this.defaultValue = config.defaultValue;
    this.languages = config.languages ?? [];
    this.themes = config.themes ?? [];
    this.extensions = config.extensions ?? [];
    this.keymaps = config.keymaps ?? [];
    this.placeholder = config.placeholder || "Please enter text...";
    if (config.onChange) this.onChange = config.onChange;
    this.status = "init";
  }
  async create() {
    if (this.languages.length === 0) {
      const { languages: langList } = await import("@codemirror/language-data");
      this.languages = langList;
    }
    if (this.themes.length === 0) {
      const { theme } = await import("./theme");
      this.themes = [theme];
    }

    if (this.status !== "init") return;

    const editorView = new EditorView({
      doc: this.defaultValue,
      parent: this.root || document.createElement("div"),
      extensions: [
        markdown({
          codeLanguages: this.languages,
        }),
        history(),
        placeholder(this.placeholder),
        ...this.themes,
        ...this.extensions,
        EditorView.lineWrapping,
        keymap.of([
          // A large set of basic bindings
          ...defaultKeymap,
          // Redo/undo keys
          ...historyKeymap,
          indentWithTab,
          ...this.keymaps,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            if (this.onChange) this.onChange(this.value);
          }
        }),
      ],
    });

    this.view = editorView;
    this.status = "create";
  }
  get value(): string {
    if (this.view) {
      return this.view.state.doc.toString();
    } else {
      throw new Error("Please use `create()` to create an instance.");
    }
  }
  update(value: string) {
    if (this.view) {
      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: value },
      });
      return this;
    } else {
      throw new Error("Please use `create()` to create an instance.");
    }
  }
  use(plugin: Extension | Extension[]) {
    if (Array.isArray(plugin)) {
      this.extensions = [...this.extensions, ...plugin];
    } else {
      this.extensions.push(plugin);
    }
    return this;
  }
  destroy(): void {
    this.status = "destroy";
    this.view?.destroy();
  }
}
