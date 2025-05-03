import { type ChangeSpec, EditorSelection } from "@codemirror/state";
import type { Command } from "@codemirror/view";

/**
 * CodeMirror command to toggle inline math or math block based on selection.
 * If selection is multiline, applies math block ($$\n...\n$$).
 * If selection is single line (non-empty), applies inline math ($...$).
 * If selection is empty, inserts an empty math block structure ($$\n\n$$).
 */
const math: Command = (view) => {
  const { state } = view;
  const { doc } = state;

  // Use changeByRange to handle multiple potential selections,
  // although the main selection is the primary focus here.
  view.dispatch(
    state.changeByRange((range) => {
      const changes: ChangeSpec[] = [];
      let newSelectionAnchor: number;
      let newSelectionHead: number;

      // Determine if the current range spans multiple lines
      const startLine = doc.lineAt(range.from);
      const endLine = doc.lineAt(range.to);
      const isMultiline = startLine.number !== endLine.number;

      if (range.empty) {
        // Case 1: Empty selection - Insert empty math block structure
        // This behavior aligns with typical empty-selection math block commands.
        const insertion = "$$\n\n$$";
        changes.push({ from: range.from, insert: insertion });

        // Place cursor in the middle empty line
        newSelectionAnchor = range.from + "$$\n".length;
        newSelectionHead = newSelectionAnchor; // Cursor position
      } else if (isMultiline) {
        // Case 2: Non-empty, multiline selection - Apply math block
        const startMarker = "$$\n";
        const endMarker = "\n$$";

        changes.push(
          { from: range.from, insert: startMarker }, // Insert $$\n before selection
          { from: range.to, insert: endMarker } // Insert \n$$ after selection
        );

        // New selection range should cover the original text, offset by the inserted startMarker length
        newSelectionAnchor = range.from + startMarker.length;
        newSelectionHead = range.to + startMarker.length; // range.to is the position *after* the selected text, so add startMarker length
      } else {
        // Case 3: Non-empty, single-line selection - Apply inline math
        // Note: This implementation *always* wraps with backticks if non-empty single line,
        // it does not include the unwrap logic from your original inline math command.
        changes.push(
          { from: range.from, insert: "$" }, // Insert ` before selection
          { from: range.to, insert: "$" } // Insert ` after selection
        );

        // New selection range should cover the original text, offset by the first `
        newSelectionAnchor = range.from + 1;
        newSelectionHead = range.to + 1; // range.to is the position *after* the selected text, so add 1 for the first `
      }

      // Return the changes and the new selection range for this range
      return {
        changes,
        range: EditorSelection.range(newSelectionAnchor, newSelectionHead),
      };
    })
  );

  view.focus(); // Ensure the editor remains focused after the command
  return true; // Indicate that the command successfully performed an action
};

export default math;
