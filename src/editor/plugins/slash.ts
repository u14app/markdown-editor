import { StateEffect, Extension } from "@codemirror/state";
import {
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  type PluginValue,
  EditorView as VEditorView,
  keymap,
} from "@codemirror/view";
import * as command from "../commands";

interface commandText {
  name?: string;
  description?: string;
}

export type I18n = Record<
  | "heading"
  | "list"
  | "advanced"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "todo"
  | "link"
  | "image"
  | "quote"
  | "code"
  | "math"
  | "table"
  | "horizontal",
  commandText
>;

interface Command {
  name: string;
  description?: string;
  type: "command" | "text";
  execute?: (view: EditorView) => void;
}

export const stopSlashCommandEffect = StateEffect.define();

export function slashPlugin(i18n: Partial<I18n> = {}): Extension {
  const startSlashCommandEffect = StateEffect.define<{ pos: number }>();

  const exampleCommands: Command[] = [
    {
      name: i18n.heading?.name || "Heading",
      type: "text",
    },
    {
      name: i18n.h1?.name || "Heading 1",
      description: i18n.h1?.description || "Insert Heading 1",
      type: "command",
      execute: (view: EditorView) => {
        command.h1(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.h2?.name || "Heading 2",
      description: i18n.h2?.description || "Insert Heading 2",
      type: "command",
      execute: (view: EditorView) => {
        command.h2(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.h3?.name || "Heading 3",
      description: i18n.h3?.description || "Insert Heading 3",
      type: "command",
      execute: (view: EditorView) => {
        command.h3(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.h4?.name || "Heading 4",
      description: i18n.h4?.description || "Insert Heading 4",
      type: "command",
      execute: (view: EditorView) => {
        command.h4(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.h5?.name || "Heading 5",
      description: i18n.h5?.description || "Insert Heading 5",
      type: "command",
      execute: (view: EditorView) => {
        command.h5(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.h6?.name || "Heading 6",
      description: i18n.h6?.description || "Insert Heading 6",
      type: "command",
      execute: (view: EditorView) => {
        command.h6(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.list?.name || "List",
      type: "text",
    },
    {
      name: i18n.ul?.name || "Bullet List",
      description: i18n.ul?.description || "Insert Bullet List Item",
      type: "command",
      execute: (view: EditorView) => {
        command.ul(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.ol?.name || "Ordered List",
      description: i18n.ol?.description || "Insert Ordered List Item",
      type: "command",
      execute: (view: EditorView) => {
        command.ol(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.todo?.name || "Todo List",
      description: i18n.todo?.description || "Insert Todo List Item",
      type: "command",
      execute: (view: EditorView) => {
        command.todo(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.advanced?.name || "Advanced",
      type: "text",
    },
    {
      name: i18n.link?.name || "Link",
      description: i18n.link?.description || "Insert Link",
      type: "command",
      execute: (view: EditorView) => {
        command.link(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.image?.name || "Image",
      description: i18n.image?.description || "Insert Image",
      type: "command",
      execute: (view: EditorView) => {
        command.image(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.code?.name || "Code Block",
      description: i18n.code?.description || "Insert Code Block",
      type: "command",
      execute: (view: EditorView) => {
        command.code(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.math?.name || "Math Block",
      description: i18n.math?.description || "Insert Math Block",
      type: "command",
      execute: (view: EditorView) => {
        command.math(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.table?.name || "Table",
      description: i18n.table?.description || "Insert Table",
      type: "command",
      execute: (view: EditorView) => {
        command.table(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.quote?.name || "Quote",
      description: i18n.quote?.description || "Insert Quote",
      type: "command",
      execute: (view: EditorView) => {
        command.quote(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
    {
      name: i18n.horizontal?.name || "Horizontal",
      description: i18n.horizontal?.description || "Insert Horizontal",
      type: "command",
      execute: (view: EditorView) => {
        command.horizontal(view);
        view.dispatch({ effects: [stopSlashCommandEffect.of(null)] });
      },
    },
  ];

  // Shared reference for keymap access
  let activePlugin: ToolTip | null = null;

  function createTooltipDOM(view: EditorView): {
    dom: HTMLElement;
    commandItems: { el: HTMLElement; cmd: Command }[];
  } {
    const dom = document.createElement("div");
    dom.classList.add("cm-slash-command-list");

    dom.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    const commandItems: { el: HTMLElement; cmd: Command }[] = [];

    exampleCommands.forEach((cmd) => {
      const item = document.createElement("div");
      item.textContent = cmd.name;
      item.title = cmd.description || cmd.name;
      if (cmd.type === "command") {
        item.classList.add("cm-slash-command-item");
        item.addEventListener("click", () => cmd.execute && cmd.execute(view));
        commandItems.push({ el: item, cmd });
      } else {
        item.classList.add("cm-slash-label-item");
      }

      dom.appendChild(item);
    });

    return { dom, commandItems };
  }

  class ToolTip implements PluginValue {
    dom: HTMLElement;
    commandItems: { el: HTMLElement; cmd: Command }[];
    active = false;
    activeIndex = -1;
    triggerPos: number = 0;
    view: EditorView;

    constructor(view: EditorView) {
      this.view = view;
      const { dom, commandItems } = createTooltipDOM(view);
      this.commandItems = commandItems;
      this.dom = view.dom.appendChild(dom);
      this.dom.style.display = "none";
      this.dom.ariaHidden = "true";

      this.onDocClick = this.onDocClick.bind(this);
      document.addEventListener("click", this.onDocClick);

      activePlugin = this;
    }

    onDocClick(event: MouseEvent): void {
      if (this.active && !this.dom.contains(event.target as Node)) {
        this.view.dispatch({ effects: stopSlashCommandEffect.of(null) });
      }
    }

    highlightItem(index: number) {
      this.commandItems.forEach(({ el }) =>
        el.classList.remove("cm-slash-command-item-active"),
      );
      if (index >= 0 && index < this.commandItems.length) {
        this.activeIndex = index;
        const item = this.commandItems[index]!;
        item.el.classList.add("cm-slash-command-item-active");
        item.el.scrollIntoView({ block: "nearest" });
      }
    }

    moveSelection(delta: number) {
      if (!this.active || this.commandItems.length === 0) return;
      let next = this.activeIndex + delta;
      if (next < 0) next = this.commandItems.length - 1;
      if (next >= this.commandItems.length) next = 0;
      this.highlightItem(next);
    }

    executeSelected() {
      if (
        !this.active ||
        this.activeIndex < 0 ||
        this.activeIndex >= this.commandItems.length
      )
        return;
      const item = this.commandItems[this.activeIndex]!;
      if (item.cmd.execute) item.cmd.execute(this.view);
    }

    update(update: ViewUpdate): void {
      for (const tr of update.transactions) {
        for (const effect of tr.effects) {
          if (effect.is(startSlashCommandEffect)) {
            this.active = true;
            this.triggerPos = effect.value.pos;
            this.activeIndex = -1;
          } else if (effect.is(stopSlashCommandEffect)) {
            this.active = false;
            this.activeIndex = -1;
          }
        }
      }

      if (!this.active) {
        if (this.dom.style.display !== "none") {
          this.dom.style.display = "none";
          this.dom.ariaHidden = "true";
        }
        return;
      }

      update.view.requestMeasure({
        read: (view) => {
          const pos = this.triggerPos;

          if (pos < 0 || pos > view.state.doc.length) {
            this.active = false;
            return { shouldShow: false };
          }

          const coords = view.coordsAtPos(pos);
          if (!coords) {
            return { shouldShow: false };
          }

          return { coords, shouldShow: this.active };
        },
        write: (measure, view) => {
          if (measure && measure.shouldShow && measure.coords) {
            const { coords } = measure;

            // Temporarily show to get real dimensions
            this.dom.style.display = "block";
            this.dom.style.visibility = "hidden";
            const tooltipRect = this.dom.getBoundingClientRect();
            this.dom.style.visibility = "";

            const editorRect = view.dom.getBoundingClientRect();

            let top = coords.bottom + 2;
            let left = coords.left;

            const editorBottom = editorRect.top + view.dom.clientHeight;
            const viewportBottom = window.innerHeight;
            if (
              top + tooltipRect.height >
              Math.min(editorBottom, viewportBottom)
            ) {
              top = coords.top - tooltipRect.height - 2;
            }
            top = Math.max(top, editorRect.top);

            const editorRight = editorRect.left + view.dom.clientWidth;
            left = Math.min(left, editorRight - tooltipRect.width);
            left = Math.max(left, editorRect.left);

            this.dom.style.left = `${left - editorRect.left}px`;
            this.dom.style.top = `${top - editorRect.top}px`;

            this.dom.ariaHidden = "false";
          } else {
            this.dom.style.display = "none";
            this.dom.ariaHidden = "true";
          }
        },
      });
    }

    destroy() {
      document.removeEventListener("click", this.onDocClick);
      this.dom.remove();
      if (activePlugin === this) activePlugin = null;
    }
  }

  const slashCommandStartListener = VEditorView.updateListener.of(
    (update: ViewUpdate) => {
      if (!update.docChanged) {
        return;
      }

      const { state, view } = update;
      const { head } = state.selection.main;
      const line = state.doc.lineAt(head);
      const lineText = state.doc.sliceString(line.from, line.to);

      if (lineText === "/" && head === line.to) {
        view.dispatch({
          effects: [startSlashCommandEffect.of({ pos: line.from })],
        });
      }

      if (lineText.startsWith("/") && lineText.length > 1 && head === line.to) {
        view.dispatch({
          effects: [stopSlashCommandEffect.of(null)],
        });
      }
    },
  );

  const slashCommandKeymap = keymap.of([
    {
      key: "Escape",
      run: () => {
        if (!activePlugin?.active) return false;
        activePlugin.view.dispatch({
          effects: stopSlashCommandEffect.of(null),
        });
        return true;
      },
    },
    {
      key: "ArrowDown",
      run: () => {
        if (!activePlugin?.active) return false;
        activePlugin.moveSelection(1);
        return true;
      },
    },
    {
      key: "ArrowUp",
      run: () => {
        if (!activePlugin?.active) return false;
        activePlugin.moveSelection(-1);
        return true;
      },
    },
    {
      key: "Enter",
      run: () => {
        if (!activePlugin?.active) return false;
        activePlugin.executeSelected();
        return true;
      },
    },
  ]);

  const tooltipViewPlugin = ViewPlugin.fromClass(ToolTip);

  const tooltipBaseTheme = EditorView.theme({
    ".cm-slash-command-list": {
      display: "none",
      position: "absolute",
      maxHeight: "300px",
      overflow: "auto",
      color: "#191c20",
      borderRadius: "8px",
      background: "#f8f9ff",
      boxShadow:
        "0px 1px 3px 1px rgba(0,0,0,.15),0px 1px 2px 0px rgba(0,0,0,.3)",
      padding: "8px",
      minWidth: "200px",
      zIndex: 100,
    },
    ".cm-slash-command-item": {
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "20px",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      "&:hover": {
        background: "#e1e2e8",
      },
    },
    ".cm-slash-command-item-active": {
      background: "#e1e2e8",
    },
    ".cm-slash-label-item": {
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "20px",
      padding: "10px",
      color: "#777",
    },
    "&:has(.cm-slash-command-list[aria-hidden='false']) .cm-activeLine": {
      backgroundColor: "transparent",
    },
  });

  const tooltipDarkTheme = EditorView.theme(
    {
      ".cm-slash-command-list": {
        color: "#f7fafa",
        backgroundColor: "#1f1f23",
      },
      ".cm-slash-command-item": {
        "&:hover": {
          backgroundColor: "#343434",
        },
      },
      ".cm-slash-command-item-active": {
        backgroundColor: "#343434",
      },
      ".cm-slash-label-item": {
        color: "#8a8a8a",
      },
    },
    { dark: true },
  );

  return [
    tooltipViewPlugin,
    tooltipBaseTheme,
    tooltipDarkTheme,
    slashCommandStartListener,
    slashCommandKeymap,
  ];
}
