import { type Extension } from "@codemirror/state";
import {
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  type PluginValue,
  type Command,
} from "@codemirror/view";
import {
  bold,
  italic,
  strikethrough,
  code,
  math,
  link,
  quote,
} from "../commands";
import * as icons from "../icons";

export type I18n = Record<
  "bold" | "italic" | "strikethrough" | "quote" | "link" | "code" | "math",
  string
>;

export function tooltipPlugin(i18n: Partial<I18n> = {}): Extension {
  function createTooltipDOM(view: EditorView): HTMLElement {
    const dom = document.createElement("div");
    // Add CSS class name for style control
    dom.className = "cm-tooltips";

    // Prevent events on the toolbar from bubbling to the editor to prevent the editor from losing focus
    dom.addEventListener("mousedown", (e) => e.preventDefault());
    dom.addEventListener("click", (e) => e.preventDefault());

    const addCommand = (text: string, icon: string, command: Command) => {
      const button = document.createElement("span");
      button.innerHTML = icon;
      button.title = text;
      button.addEventListener("click", () => command(view));
      dom.appendChild(button);
    };

    addCommand(i18n.bold || "Bold", icons.bold, bold);
    addCommand(i18n.italic || "Italic", icons.italic, italic);
    addCommand(
      i18n.strikethrough || "Strikethrough",
      icons.strikethrough,
      strikethrough
    );
    addCommand(i18n.code || "Code", icons.code, code);
    addCommand(i18n.math || "Math", icons.math, math);
    addCommand(i18n.link || "Link", icons.link, link);
    addCommand(i18n.quote || "Quote", icons.quote, quote);

    return dom;
  }

  class ToolTip implements PluginValue {
    dom: HTMLElement;
    constructor(view: EditorView) {
      const toolTipDOM = createTooltipDOM(view);
      this.dom = view.dom.appendChild(toolTipDOM);
    }
    update(update: ViewUpdate): void {
      if (update.selectionSet) {
        update.view.requestMeasure({
          read: (view) => {
            const range = view.state.selection.ranges.find(
              (range) => !range.empty
            );
            if (range) {
              // Coords here are relative to the scrollable document.
              const coords = view.coordsAtPos(range.from);
              if (!coords) return { shouldShow: false };

              return { shouldShow: true, coords };
            } else {
              return { shouldShow: false };
            }
          },
          write: (measure, view) => {
            if (measure && measure.shouldShow && measure.coords) {
              const { coords } = measure;

              const editorRect = view.dom.getBoundingClientRect();
              const tooltipRect = this.dom.getBoundingClientRect();
              let top = coords.top - tooltipRect.height - 8; // Prioritize above
              let left = coords.left;

              // Check if there's enough space above
              if (top < editorRect.top) {
                top = coords.top + 8; // Fallback to below if not enough space above
              }

              // Boundary checks (simplified)
              top = Math.max(top, editorRect.top);
              top = Math.min(top, editorRect.bottom - tooltipRect.height);
              left = Math.max(left, editorRect.left);
              left = Math.min(left, editorRect.right - tooltipRect.width);

              this.dom.style.left = `${left - editorRect.left}px`;
              this.dom.style.top = `${top - editorRect.top}px`;
              this.dom.style.display = "flex";
              this.dom.ariaHidden = "false";
            } else {
              this.dom.style.display = "none";
              this.dom.ariaHidden = "true";
            }
          },
        });
      }
    }
    destroy() {
      this.dom.remove();
    }
  }

  const tooltipViewPlugin = ViewPlugin.fromClass(ToolTip);

  const tooltipBaseTheme = EditorView.theme({
    ".cm-tooltips": {
      display: "none",
      position: "absolute",
      zIndex: 100,
      padding: "6px",
      borderRadius: "8px",
      overflow: "hidden",
      textAlign: "center",
      backgroundColor: "#f8f9ff",
      boxShadow:
        "0px 1px 3px 1px rgba(0,0,0,.15),0px 1px 2px 0px rgba(0,0,0,.3)",
      gap: "6px",
      "& > span": {
        display: "block",
        width: "24px",
        height: "24px",
        padding: "4px",
        cursor: "pointer",
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: "#eceef4",
        },
        "& > svg": {
          width: "18px",
          height: "18px",
          padding: "3px",
        },
      },
    },
  });

  const tooltipDarkTheme = EditorView.theme(
    {
      ".cm-tooltips": {
        color: "#f7fafa",
        backgroundColor: "#1f1f23",
        "& > span:hover": {
          backgroundColor: "#343434",
        },
      },
    },
    { dark: true }
  );

  return [tooltipViewPlugin, tooltipBaseTheme, tooltipDarkTheme];
}
