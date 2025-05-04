import { StateEffect, Extension, EditorSelection } from "@codemirror/state";
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

export function slashPlugin(i18n: Partial<I18n> = {}): Extension {
  // 定义启动和停止 slash command 模式的 StateEffect
  const startSlashCommandEffect = StateEffect.define<{ pos: number }>();
  const stopSlashCommandEffect = StateEffect.define();

  // 示例命令数组，修改 execute 方法，在执行后 dispatch stopSlashCommandEffect
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
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.h2?.name || "Heading 2",
      description: i18n.h2?.description || "Insert Heading 2",
      type: "command",
      execute: (view: EditorView) => {
        command.h2(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.h3?.name || "Heading 3",
      description: i18n.h3?.description || "Insert Heading 3",
      type: "command",
      execute: (view: EditorView) => {
        command.h3(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.h4?.name || "Heading 4",
      description: i18n.h4?.description || "Insert Heading 4",
      type: "command",
      execute: (view: EditorView) => {
        command.h4(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.h5?.name || "Heading 5",
      description: i18n.h5?.description || "Insert Heading 5",
      type: "command",
      execute: (view: EditorView) => {
        command.h5(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.h6?.name || "Heading 6",
      description: i18n.h6?.description || "Insert Heading 6",
      type: "command",
      execute: (view: EditorView) => {
        command.h6(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
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
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.ol?.name || "Ordered List",
      description: i18n.ol?.description || "Insert Ordered List Item",
      type: "command",
      execute: (view: EditorView) => {
        command.ol(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.todo?.name || "Todo List",
      description: i18n.todo?.description || "Insert Todo List Item",
      type: "command",
      execute: (view: EditorView) => {
        command.todo(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
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
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.image?.name || "Image",
      description: i18n.image?.description || "Insert Image",
      type: "command",
      execute: (view: EditorView) => {
        command.image(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.code?.name || "Code Block",
      description: i18n.code?.description || "Insert Code Block",
      type: "command",
      execute: (view: EditorView) => {
        command.code(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.math?.name || "Math Block",
      description: i18n.math?.description || "Insert Math Block",
      type: "command",
      execute: (view: EditorView) => {
        command.math(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.table?.name || "Table",
      description: i18n.table?.description || "Insert Table",
      type: "command",
      execute: (view: EditorView) => {
        command.table(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.quote?.name || "Quote",
      description: i18n.quote?.description || "Insert Quote",
      type: "command",
      execute: (view: EditorView) => {
        command.quote(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
    {
      name: i18n.horizontal?.name || "Horizontal",
      description: i18n.horizontal?.description || "Insert Horizontal",
      type: "command",
      execute: (view: EditorView) => {
        command.horizontal(view);
        view.dispatch({
          // 执行命令后，停止 slash command 模式
          effects: [stopSlashCommandEffect.of(null)],
        });
      },
    },
  ];

  function createTooltipDOM(view: EditorView): HTMLElement {
    const dom = document.createElement("div");
    dom.classList.add("cm-slash-command-list");

    // 添加 mousedown 阻止默认事件，防止点击 tooltip 时编辑器失焦
    dom.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    exampleCommands.forEach((cmd) => {
      const item = document.createElement("div");
      item.textContent = cmd.name;
      item.title = cmd.description || cmd.name;
      if (cmd.type === "command") {
        item.classList.add("cm-slash-command-item");
        item.addEventListener("click", () => cmd.execute && cmd.execute(view));
      } else {
        item.classList.add("cm-slash-label-item");
      }

      dom.appendChild(item);
    });

    return dom;
  }

  class ToolTip implements PluginValue {
    dom: HTMLElement;
    active = false; // Tooltip 的激活状态
    triggerPos: number = 0; // 记录触发时的光标位置（行首）
    view: EditorView; // 保存 view 实例，方便在事件处理中使用

    constructor(view: EditorView) {
      this.view = view; // 保存 view 实例
      const toolTipDOM = createTooltipDOM(view);
      this.dom = view.dom.appendChild(toolTipDOM);
      this.dom.style.display = "none"; // 初始状态隐藏
      this.dom.ariaHidden = "true";

      // (可选) 添加点击编辑器外部隐藏 tooltip 的监听，如果需要的话
      this.onDocClick = this.onDocClick.bind(this);
      document.addEventListener("click", this.onDocClick);
    }

    onDocClick(event: MouseEvent): void {
      // 如果 tooltip 激活并且点击事件的目标不在 tooltip DOM 内
      if (this.active && !this.dom.contains(event.target as Node)) {
        // Dispatch stop effect
        this.view.dispatch({ effects: stopSlashCommandEffect.of(null) });
      }
    }

    update(update: ViewUpdate): void {
      // 检查本次更新中是否包含启动或停止 slash command 的 StateEffect
      for (const tr of update.transactions) {
        for (const effect of tr.effects) {
          if (effect.is(startSlashCommandEffect)) {
            this.active = true; // 启动模式
            this.triggerPos = effect.value.pos; // 记录触发时的光标位置
            // console.log("ToolTip: Received start effect, active:", this.active, "pos:", this.triggerPos);
          } else if (effect.is(stopSlashCommandEffect)) {
            this.active = false; // 停止模式
            // console.log("ToolTip: Received stop effect, active:", this.active);
          }
        }
      }

      // 如果当前 tooltip 是非激活状态，确保 DOM 是隐藏的，然后直接返回，不需要测量和定位
      if (!this.active) {
        if (this.dom.style.display !== "none") {
          this.dom.style.display = "none";
          this.dom.ariaHidden = "true";
          // console.log("ToolTip: Hiding DOM because not active");
        }
        return; // 不活跃时不进行后续测量和定位
      }

      // 如果 tooltip 处于激活状态，请求测量以定位 DOM
      update.view.requestMeasure({
        read: (view) => {
          // 在激活状态下，使用记录的触发位置来获取坐标
          const pos = this.triggerPos;

          // 检查记录的位置是否仍然有效（防止文档被大幅度修改导致位置失效）
          if (pos < 0 || pos > view.state.doc.length) {
            this.active = false; // 位置无效，停止模式
            // console.log("ToolTip: Deactivating due to invalid position");
            return { shouldShow: false }; // 不显示 DOM
          }

          // 获取触发位置的坐标
          const coords = view.coordsAtPos(pos);
          if (!coords) {
            // 如果坐标不可用（例如，触发位置不在当前可见区域），隐藏 DOM 但保持 active 状态
            // console.log("ToolTip: Coords not available, hiding DOM temporarily");
            return { shouldShow: false }; // 不显示 DOM
          }

          // 返回坐标信息和显示标志 (如果 active 就是 true)
          // console.log("ToolTip: Coords available, requesting show:", this.active);
          return { coords, shouldShow: this.active }; // 在 active 状态下始终请求显示
        },
        write: (measure, view) => {
          // write 阶段只负责根据 read 阶段的结果来操作 DOM (显示/隐藏和定位)
          if (measure && measure.shouldShow && measure.coords) {
            const { coords } = measure;

            const editorRect = view.dom.getBoundingClientRect();
            const tooltipRect = this.dom.getBoundingClientRect();

            // 定位逻辑，相对于编辑器容器的左上角
            let top = coords.bottom + 2; // 位于触发位置下方
            let left = coords.left;

            // 边界检查，确保 tooltip 在编辑器可见区域内
            const editorBottom = editorRect.top + view.dom.clientHeight; // 可见区域底部
            if (top + tooltipRect.height > editorBottom) {
              top = coords.top - tooltipRect.height - 2; // 如果下方空间不足，则位于上方
            }
            top = Math.max(top, editorRect.top); // 不超过编辑器顶部

            const editorRight = editorRect.left + view.dom.clientWidth; // 可见区域右侧
            left = Math.min(left, editorRight - tooltipRect.width); // 不超过编辑器右侧
            left = Math.max(left, editorRect.left); // 不小于编辑器左侧

            // 设置 DOM 的位置，转换为相对于编辑器容器的坐标
            this.dom.style.left = `${left - editorRect.left}px`;
            this.dom.style.top = `${top - editorRect.top}px`;

            this.dom.style.display = "block";
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
    }
  }

  // Update Listener 负责检测 "/ " 输入，并触发删除文本、移动光标以及启动 slash command 模式
  const slashCommandStartListener = VEditorView.updateListener.of(
    (update: ViewUpdate) => {
      // 只有文档发生改变时才触发检查
      if (!update.docChanged) {
        return;
      }

      const { state, view } = update;
      const { head } = state.selection.main;
      const line = state.doc.lineAt(head);
      const lineText = state.doc.sliceString(line.from, line.to);

      // 启动 slash command 模式的条件：
      // 1. 当前行的文本是 exactly "/ "
      // 2. 光标位于行的末尾 (head === line.to)。这确保是在输入空格后立即触发。
      // 3. 检查 tooltip 插件是否已经处于激活状态，避免重复启动 (可选，但可以更精确控制)
      // 通过查找 tooltip 插件实例来检查其 active 状态，但这有点复杂。
      // 简单起见，我们先不检查当前 active 状态，依赖 dispatch 的幂等性（多次 dispatch 同一个 effect 会合并）。
      // 一个更 robust 的方法可能是使用 StateField 来存储 active 状态。

      if (lineText === "/ " && head === line.to) {
        // Dispatch 一个包含两个部分的事务：
        // 1. 清除当前行文本并移动光标。
        // 2. 发送 startSlashCommandEffect 来通知 tooltip 插件启动模式。
        view.dispatch(
          state.changeByRange((range) => {
            // 在 range 函数内部再次检查状态，确保在执行前条件仍然满足
            const currentLine = view.state.doc.lineAt(
              view.state.selection.main.head
            );
            const currentLineText = view.state.doc.sliceString(
              currentLine.from,
              currentLine.to
            );

            if (
              currentLineText === "/ " &&
              view.state.selection.main.head === currentLine.to
            ) {
              // 执行删除和移动光标
              return {
                changes: [
                  {
                    from: currentLine.from,
                    to: currentLine.to,
                    insert: "",
                  },
                ],
                range: EditorSelection.range(
                  currentLine.from,
                  currentLine.from
                ),
                // 同时附带 startSlashCommandEffect，将行首位置传递给 tooltip
                effects: [
                  startSlashCommandEffect.of({ pos: currentLine.from }),
                ],
              };
            }
            // 如果条件不再满足，返回原始 range
            return { range };
          })
        );
      }
    }
  );

  // (可选) 添加一个 keymap 来处理按 Escape 键取消
  const slashCommandKeymap = keymap.of([
    {
      key: "Escape",
      run: (view: EditorView) => {
        // 在按 Escape 时 dispatch stopSlashCommandEffect
        // ToolTip 插件会响应这个 effect 来隐藏。
        // 这里不检查当前是否 active，直接 dispatch 即可，非 active 状态下 effect 没有副作用。
        view.dispatch({ effects: stopSlashCommandEffect.of(null) });
        return true; // 标记事件已处理
      },
    },
  ]);

  const tooltipViewPlugin = ViewPlugin.fromClass(ToolTip);

  const tooltipBaseTheme = EditorView.theme({
    ".cm-slash-command-list": {
      display: "none", // 默认隐藏
      position: "absolute", // 绝对定位
      maxHeight: "300px",
      overflow: "auto",
      color: "#191c20",
      borderRadius: "8px",
      background: "#f8f9ff",
      boxShadow:
        "0px 1px 3px 1px rgba(0,0,0,.15),0px 1px 2px 0px rgba(0,0,0,.3)",
      padding: "8px",
      minWidth: "200px",
      zIndex: 100, // 确保在编辑器上方
      userSelect: "none", // 防止文本选择问题
      cursor: "default", // 默认光标样式
    },
    ".cm-slash-command-item": {
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "20px",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer", // 可点击的光标
      "&:hover": {
        background: "#e1e2e8",
      },
    },
    ".cm-slash-label-item": {
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "20px",
      padding: "10px",
      color: "#777",
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
      ".cm-slash-label-item": {
        color: "#8a8a8a",
      },
    },
    { dark: true }
  );

  return [
    tooltipViewPlugin, // 管理 tooltip 的 DOM 元素和其可见性/位置
    tooltipBaseTheme, // tooltip 的样式
    tooltipDarkTheme,
    slashCommandStartListener, // 检测 "/ " 输入，启动模式 (删除文本+effect)
    slashCommandKeymap, // 处理 Escape 键取消模式 (effect)
  ];
}
