import { EditorView } from "@codemirror/view";
import { isBrowser } from "../../utils/environment";

export class AILoadingToast {
  dom: HTMLElement | null = null;
  view: EditorView;
  abortHandler: (() => void) | null = null;

  constructor(view: EditorView) {
    this.view = view;
    if (isBrowser()) {
      this.dom = this.createDOM();
      this.view.dom.appendChild(this.dom);
    }
  }

  createDOM(): HTMLElement {
    const container = document.createElement("div");
    container.className = "cm-ai-loading-toast";
    container.style.display = "none";

    const content = document.createElement("div");
    content.className = "cm-ai-loading-content";

    const text = document.createElement("span");
    text.className = "cm-ai-loading-text";
    text.textContent = "Thinking...";
    content.appendChild(text);

    container.appendChild(content);

    const stopBtn = document.createElement("button");
    stopBtn.className = "cm-ai-loading-stop";
    stopBtn.textContent = "Stop";
    stopBtn.addEventListener("click", () => {
      if (this.abortHandler) {
        this.abortHandler();
      }
    });
    container.appendChild(stopBtn);

    return container;
  }

  show(abortHandler: () => void, position?: { top: number; left: number }) {
    if (!this.dom) return;
    this.abortHandler = abortHandler;

    if (position) {
      const editorRect = this.view.dom.getBoundingClientRect();
      const scrollTop = this.view.dom.scrollTop;
      const relativeTop = position.top - editorRect.top + scrollTop;

      this.dom.style.top = `${relativeTop}px`;
      this.dom.style.left = "50%";
      this.dom.style.transform = "translateX(-50%)";
    }

    this.dom.style.display = "flex";
  }

  hide() {
    if (!this.dom) return;
    this.dom.style.display = "none";
    this.abortHandler = null;
  }

  destroy() {
    this.dom?.remove();
  }
}
