import {
  EditorView,
  ViewPlugin,
  type PluginValue,
  type ViewUpdate,
} from "@codemirror/view";
import { type AIConfig } from "./api";
import { AIDialog } from "./dialog";
import * as icons from "../../icons";
import { isBrowser } from "../../utils/environment";

export interface AITooltipConfig extends AIConfig {
  dialog?: AIDialog;
  i18n?: Partial<import("./index").AIPluginI18n>;
}

export function aiTooltipPlugin(config: AITooltipConfig) {
  class AITooltip implements PluginValue {
    dom: HTMLElement | null = null;
    dialog: AIDialog;
    view: EditorView;

    constructor(view: EditorView) {
      this.view = view;
      this.dialog = config.dialog || new AIDialog(view, config);
      if (isBrowser()) {
        setTimeout(() => this.attachToTooltip(), 0);
      }
    }

    attachToTooltip() {
      if (!isBrowser()) return;

      const tooltip = this.view.dom.querySelector(".cm-tooltips");
      if (!tooltip) return;

      this.dom = document.createElement("span");
      this.dom.innerHTML = icons.sparkle;
      this.dom.title = config.i18n?.askAI || "Ask AI";
      this.dom.style.cursor = "pointer";
      this.dom.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const selection = this.view.state.selection.main;
        if (selection.empty) return;
        const coords = this.view.coordsAtPos(selection.from);
        if (coords) {
          this.dialog.show(
            { top: coords.top, left: coords.left },
            { from: selection.from, to: selection.to },
          );
          // Hide tooltip directly instead of clearing selection
          const tooltipEl = this.view.dom.querySelector(
            ".cm-tooltips",
          ) as HTMLElement;
          if (tooltipEl) {
            tooltipEl.style.display = "none";
            tooltipEl.ariaHidden = "true";
          }
        }
      });
      tooltip.insertBefore(this.dom, tooltip.firstChild);
    }

    update(update: ViewUpdate) {
      if (!this.dom && update.selectionSet && isBrowser()) {
        setTimeout(() => this.attachToTooltip(), 0);
      }
    }

    destroy() {
      if (!config.dialog) {
        this.dialog.destroy();
      }
    }
  }

  const plugin = ViewPlugin.fromClass(AITooltip);

  const dialogTheme = EditorView.theme({
    ".cm-ai-dialog": {
      position: "absolute",
      zIndex: 200,
      background: "#f8f9ff",
      borderRadius: "8px",
      boxShadow:
        "0px 1px 3px 1px rgba(0,0,0,.15),0px 1px 2px 0px rgba(0,0,0,.3)",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    ".cm-ai-dialog-input-wrapper": {
      display: "flex",
      alignItems: "flex-end",
      gap: "6px",
      padding: "10px 10px 10px 12px",
      borderBottom: "1px solid #e5e7eb",
    },
    ".cm-ai-dialog-input": {
      flex: "1",
      padding: "0",
      border: "none",
      fontSize: "14px",
      lineHeight: "20px",
      outline: "none",
      resize: "none",
      background: "transparent",
      color: "inherit",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    ".cm-ai-dialog-send-btn": {
      width: "24px",
      height: "24px",
      flexShrink: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRadius: "50%",
      background: "#ccc",
      color: "#fff",
      cursor: "pointer",
      padding: "0",
      "&:hover": {
        background: "#aaa",
      },
      "& > svg": {
        width: "16px",
        height: "16px",
      },
    },
    ".cm-ai-dialog-commands": {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      padding: "4px",
    },
    ".cm-ai-dialog-btn": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "100%",
      padding: "8px 10px",
      fontSize: "13px",
      border: "none",
      borderRadius: "6px",
      background: "transparent",
      color: "inherit",
      cursor: "pointer",
      textAlign: "left",
      "&:hover": {
        background: "#e8e9ee",
      },
    },
    ".cm-ai-dialog-btn-icon": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "18px",
      height: "18px",
      flexShrink: "0",
      opacity: "0.6",
      "& > svg": {
        width: "16px",
        height: "16px",
      },
    },
    ".cm-ai-highlight": {
      backgroundColor: "rgba(96, 165, 250, 0.4)",
    },
    ".cm-ai-loading-toast": {
      position: "absolute",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 16px",
      background: "#f8f9ff",
      borderRadius: "8px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
    },
    ".cm-ai-loading-content": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    ".cm-ai-loading-text": {
      fontSize: "14px",
      color: "#334155",
    },
    ".cm-ai-loading-stop": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 8px",
      border: "none",
      borderRadius: "6px",
      background: "transparent",
      cursor: "pointer",
      color: "#64748b",
      "&:hover": {
        background: "#e8e9ee",
        color: "#334155",
      },
    },
  });

  const dialogDarkTheme = EditorView.theme(
    {
      ".cm-ai-dialog": {
        background: "#1f1f23",
        color: "#f7fafa",
      },
      ".cm-ai-dialog-input-wrapper": {
        borderBottom: "1px solid #333",
      },
      ".cm-ai-dialog-input": {
        color: "#f7fafa",
      },
      ".cm-ai-dialog-send-btn": {
        background: "#4a90e2",
        "&:hover": {
          background: "#3a7bd5",
        },
      },
      ".cm-ai-dialog-btn": {
        "&:hover": {
          background: "#343434",
        },
      },
      ".cm-ai-dialog-btn-icon": {
        opacity: "0.5",
      },
      ".cm-ai-highlight": {
        backgroundColor: "rgba(96, 165, 250, 0.3)",
      },
      ".cm-ai-loading-toast": {
        background: "#1f1f23",
      },
      ".cm-ai-loading-text": {
        color: "#f7fafa",
      },
      ".cm-ai-loading-stop": {
        color: "#94a3b8",
        "&:hover": {
          background: "#343434",
          color: "#f7fafa",
        },
      },
    },
    { dark: true },
  );

  return [plugin, dialogTheme, dialogDarkTheme];
}
