import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";

export interface AIState {
  loading: boolean;
  error: string | null;
}

export const startAIRequest = StateEffect.define();
export const completeAIRequest = StateEffect.define();
export const errorAIRequest = StateEffect.define<string>();

export const aiStateField = StateField.define<AIState>({
  create: () => ({ loading: false, error: null }),
  update: (state, tr) => {
    for (const effect of tr.effects) {
      if (effect.is(startAIRequest)) {
        return { loading: true, error: null };
      }
      if (effect.is(completeAIRequest)) {
        return { loading: false, error: null };
      }
      if (effect.is(errorAIRequest)) {
        return { loading: false, error: effect.value };
      }
    }
    return state;
  },
});

// Selection highlight decoration for AI dialog
export const showAIHighlight = StateEffect.define<{ from: number; to: number }>();
export const hideAIHighlight = StateEffect.define();

const aiHighlightMark = Decoration.mark({ class: "cm-ai-highlight" });

export const aiHighlightField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (deco, tr) => {
    for (const effect of tr.effects) {
      if (effect.is(showAIHighlight)) {
        return Decoration.set([aiHighlightMark.range(effect.value.from, effect.value.to)]);
      }
      if (effect.is(hideAIHighlight)) {
        return Decoration.none;
      }
    }
    return deco.map(tr.changes);
  },
  provide: f => EditorView.decorations.from(f),
});
