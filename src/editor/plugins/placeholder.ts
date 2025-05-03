import { Extension, RangeSetBuilder } from "@codemirror/state";
import {
  EditorView,
  ViewPlugin,
  Decoration,
  DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";

// 导出为 CodeMirror 扩展
export function placeholderPlugin(placeholder?: string): Extension {
  // 创建 ViewPlugin
  const placeholderViewPlugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet
        ) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView): DecorationSet {
        // 正确的使用 RangeSetBuilder
        const builder = new RangeSetBuilder<Decoration>();

        const { state } = view;
        const placeholderText = placeholder || "Please enter text..."; // 你的占位文本

        for (const { from, to } of view.visibleRanges) {
          let pos = from;
          while (pos <= to) {
            const line = state.doc.lineAt(pos);
            // 判断是否是空白行（只包含空格或 Tab）且光标在该行
            if (
              line.text.trim().length === 0 &&
              state.selection.ranges.some(
                (r) => r.from >= line.from && r.to <= line.to
              )
            ) {
              // 使用 line decoration 添加样式类
              builder.add(
                line.from,
                line.from,
                Decoration.line({
                  attributes: {
                    class: "cm-emptyline-placeholder",
                    "data-placeholder": placeholderText,
                  },
                })
              );
            }
            pos = line.to + 1;
          }
        }
        return builder.finish(); // 使用 builder.finish() 来获取构建好的 DecorationSet
      }
    },
    {
      decorations: (instance) => instance.decorations,
    }
  );

  const placeholderBaseTheme = EditorView.baseTheme({
    [`.cm-emptyline-placeholder::before`]: {
      content: "attr(data-placeholder)",
      color: "#aaa", // 占位文本颜色
      fontStyle: "italic",
      // 确保占位文本不会影响实际内容
      pointerEvents: "none",
      position: "absolute",
    },
  });

  return [placeholderViewPlugin, placeholderBaseTheme];
}
