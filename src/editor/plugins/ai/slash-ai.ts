import { EditorView, ViewPlugin, type PluginValue } from "@codemirror/view";
import { type AIConfig } from "./api";
import { AIDialog } from "./dialog";
import { stopSlashCommandEffect } from "../slash";

export interface AISlashConfig extends AIConfig {
  dialog?: AIDialog;
  i18n?: Partial<import('./index').AIPluginI18n>;
}

export function aiSlashPlugin(config: AISlashConfig) {
  class AISlash implements PluginValue {
    view: EditorView;
    dialog: AIDialog;
    aiCommands: HTMLElement[] = [];

    constructor(view: EditorView) {
      this.view = view;
      this.dialog = config.dialog || new AIDialog(view, config);
    }

    update() {
      setTimeout(() => {
        const slashMenu = this.view.dom.querySelector(".cm-slash-command-list");
        if (slashMenu && this.aiCommands.length === 0) {
          this.injectAICommands(slashMenu as HTMLElement);
        } else if (!slashMenu && this.aiCommands.length > 0) {
          this.aiCommands = [];
        }
      }, 0);
    }

    injectAICommands(menu: HTMLElement) {
      const firstChild = menu.firstChild;

      const label = document.createElement("div");
      label.textContent = "AI";
      label.classList.add("cm-slash-label-item");
      menu.insertBefore(label, firstChild);
      this.aiCommands.push(label);

      const item = document.createElement("div");
      item.textContent = config.i18n?.askAI || "Ask AI";
      item.title = "Open AI dialog";
      item.classList.add("cm-slash-command-item");
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const head = this.view.state.selection.main.head;
        const coords = this.view.coordsAtPos(head);
        if (coords) {
          this.dialog.show({ top: coords.top, left: coords.left });
          // Remove "/" and hide menu
          setTimeout(() => {
            const line = this.view.state.doc.lineAt(head);
            if (line.text === "/") {
              this.view.dispatch({
                changes: { from: line.from, to: line.to, insert: "" },
                effects: [stopSlashCommandEffect.of(null)],
              });
            }
          }, 0);
        }
      });
      menu.insertBefore(item, label.nextSibling);
      this.aiCommands.push(item);
    }

    destroy() {
      if (!config.dialog) {
        this.dialog.destroy();
      }
    }
  }

  return ViewPlugin.fromClass(AISlash);
}
