import { EditorSelection } from "@codemirror/state";
import type { Command } from "@codemirror/view";

const horizontal: Command = (view) => {
  const { state } = view;

  view.dispatch(
    state.changeByRange((range) => {
      const line = state.doc.lineAt(range.from);

      return {
        changes: {
          from: line.from,
          to: line.to,
          insert: "---",
        },
        range: EditorSelection.range(range.anchor + 3, range.head + 3),
      };
    })
  );

  view.focus();
  return true;
};

export default horizontal;
