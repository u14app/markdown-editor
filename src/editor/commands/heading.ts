import type { Command } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6): Command => {
  return (view) => {
    const state = view.state;

    const flags = "#".repeat(level) + " ";

    view.dispatch(
      state.changeByRange((range) => {
        const line = state.doc.lineAt(range.from);

        const content = line.text.replace(/^((#+) )?/, flags);

        const diffLength = content.length - line.length;

        return {
          changes: {
            from: line.from,
            to: line.to,
            insert: content,
          },
          range: EditorSelection.range(
            range.anchor + diffLength,
            range.head + diffLength
          ),
        };
      })
    );

    view.focus();

    return true;
  };
};

export const h1 = createHeading(1);
export const h2 = createHeading(2);
export const h3 = createHeading(3);
export const h4 = createHeading(4);
export const h5 = createHeading(5);
export const h6 = createHeading(6);
