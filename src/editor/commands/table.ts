import { type ChangeSpec, EditorSelection } from "@codemirror/state";
import type { Command } from "@codemirror/view";

const table: Command = (view) => {
  // 定义要插入的 Markdown 表格文本
  const tableContent = `| Header 1 | Header 2 | Header 3 |
|   ----   |   ----   |   ----   |
| Cell 1.1 | Cell 1.2 | Cell 1.3 |
| Cell 2.1 | Cell 2.2 | Cell 2.3 |`;

  view.dispatch(
    view.state.changeByRange((range) => {
      // changeByRange 会处理多光标的情况，对每个选区都会调用这个回调函数
      const changes: ChangeSpec[] = [];

      // 在当前选区的起始位置插入表格内容
      changes.push({
        from: range.from,
        insert: tableContent,
      });

      // 计算插入表格后新的光标位置。
      // 我们可以将光标放在表格内容的末尾，或者表格中的某个特定位置（例如第一个数据单元格）。
      // 这里我们选择将光标放在表格的第一个数据单元格 (Cell 1.1) 的起始位置。
      const firstDataRowStart = range.from + tableContent.indexOf("Header 1");
      const newSelection = EditorSelection.cursor(firstDataRowStart);

      return {
        changes,
        range: newSelection, // 设置新的选区/光标位置
      };
    })
  );

  view.focus();

  return true;
};

export default table;
