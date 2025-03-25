import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = "#ffa360",
  coral = "#f35d69",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#55b4d4",
  sage = "#80ca4b",
  whiskey = "#d19a66",
  violet = "#d562f7",
  darkBackground = "#21252b",
  highlightBackground = "#8a91991a",
  background = "#ffffff",
  tooltipBackground = "#353a42",
  selection = "#036dd626",
  cursor = "#528bff",
  slate = "#334155",
  link = "#419aff",
  gray = "#e2e8f0";

/// The colors used in the theme, as CSS color strings.
export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor,
  slate,
  link,
  gray,
};

/// The editor theme styles for One Dark.
export const lightTheme = EditorView.theme(
  {
    "&": {
      color: slate,
      backgroundColor: background,
    },

    ".cm-content": {
      caretColor: cursor,
    },

    "&.cm-focused": {
      outline: "none",
    },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: "#44475a" },

    ".cm-panels": { backgroundColor: darkBackground, color: slate },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": { backgroundColor: "#8a91991a" },
    ".cm-selectionMatch": { backgroundColor: "#036dd636" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#036dd647",
    },

    ".cm-gutters": {
      backgroundColor: background,
      color: link,
      border: "none",
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: slate,
      },
    },
  },
  { dark: false }
);

export const darkTheme = EditorView.theme(
  {
    "&": {
      color: gray,
      backgroundColor: darkBackground,
    },

    ".cm-content": {
      caretColor: cursor,
    },

    "&.cm-focused": {
      outline: "none",
    },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },

    ".cm-panels": { backgroundColor: darkBackground, color: gray },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": { backgroundColor: "#8a91991a" },
    ".cm-selectionMatch": { backgroundColor: "#036dd636" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#036dd647",
    },

    ".cm-gutters": {
      backgroundColor: darkBackground,
      color: link,
      border: "none",
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: gray,
      },
    },
  },
  { dark: true }
);

/// The highlighting style for code in the One Dark theme.
export const themeHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: coral,
  },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: slate },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: chalky,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: cyan,
  },
  { tag: [t.meta, t.comment], color: stone },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: link, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: [t.string, t.inserted], color: sage },
  { tag: t.invalid, color: invalid },
]);

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const theme: Extension = [
  lightTheme,
  darkTheme,
  syntaxHighlighting(themeHighlightStyle),
];
