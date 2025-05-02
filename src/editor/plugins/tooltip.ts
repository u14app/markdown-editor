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
  strike,
  quote,
  link,
} from "codemirror-markdown-commands";
import boldIcon from "../icons/bold";
import italicIcon from "../icons/italic";
import strikethroughIcon from "../icons/strikethrough";
import quoteIcon from "../icons/quote";
import linkIcon from "../icons/link";

function createTooltipDOM(view: EditorView): HTMLElement {
  const dom = document.createElement("div");
  // Add CSS class name for style control
  dom.className = "mde-tooltip";

  // Prevent events on the toolbar from bubbling to the editor to prevent the editor from losing focus
  dom.addEventListener("mousedown", (e) => e.preventDefault());
  dom.addEventListener("click", (e) => e.preventDefault());

  const addCommand = (text: string, icon: string, command: Command) => {
    const button = document.createElement("span");
    button.innerHTML = icon;
    button.title = `Markdown ${text}`;
    button.addEventListener("click", () => command(view));
    dom.appendChild(button);
  };

  addCommand("Bold", boldIcon, bold);
  addCommand("Italic", italicIcon, italic);
  addCommand("Strikethrough", strikethroughIcon, strike);
  addCommand("Quote", quoteIcon, quote);
  addCommand("Link", linkIcon, link);

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
      // Reference https://github.com/marimo-team/codemirror-ai/src/trigger.ts
      update.view.requestMeasure({
        read: (view) => {
          const range = view.state.selection.ranges.find(
            (range) => !range.empty
          );
          if (range) {
            // Coords here are relative to the scrollable document.
            const coords = view.coordsAtPos(range.from);
            if (!coords) return;

            this.dom.style.display = "flex";

            // These measurements are definitely slow and we don't want to
            // do them very often! We may want to cache these in the future.
            const tooltipRect = this.dom.getBoundingClientRect();
            const scrollRect = view.dom.getBoundingClientRect();
            const domRect = view.dom.parentElement?.getBoundingClientRect();

            // The furthest right we want to place the tooltip, to avoid
            // it getting smushed
            const rightEdge = scrollRect.width - tooltipRect.width;

            // If the tooltip is slammed to the right side of the page,
            // pull it back so that it isn't quite as slammed.
            const left = Math.min(coords.left, rightEdge);

            // If the tooltip is in the overscrolled area at the top,
            // try to show it just at the top. This relies on the parent
            // of the codemirror container, which is not an ideal
            // strategy.
            let top = coords.top - tooltipRect.height;
            top = domRect ? Math.max(domRect.y, top) : top;

            // Position and show the element
            this.dom.style.left = `${left}px`;
            this.dom.style.top = `${top - 16}px`;
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

const tooltipBaseTheme = EditorView.baseTheme({
  ".mde-tooltip": {
    display: "none",
    position: "absolute",
    zIndex: 100,
    padding: "6px",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center",
    backgroundColor: "#f8f9ff",
    boxShadow: "0px 1px 3px 1px rgba(0,0,0,.15),0px 1px 2px 0px rgba(0,0,0,.3)",
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

export function tooltipPlugin() {
  return [tooltipViewPlugin, tooltipBaseTheme];
}
