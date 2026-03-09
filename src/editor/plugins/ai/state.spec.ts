import { describe, it, expect } from "vitest";
import { EditorState } from "@codemirror/state";
import {
  aiStateField,
  startAIRequest,
  completeAIRequest,
  errorAIRequest,
} from "./state";

function createState() {
  return EditorState.create({ extensions: [aiStateField] });
}

function applyEffect(state: EditorState, effect: any) {
  return state.update({ effects: effect }).state;
}

describe("aiStateField", () => {
  it("should have correct initial state", () => {
    const state = createState();
    expect(state.field(aiStateField)).toEqual({
      loading: false,
      error: null,
    });
  });

  it("should transition to loading on startAIRequest", () => {
    const state = createState();
    const next = applyEffect(state, startAIRequest.of(null));
    expect(next.field(aiStateField)).toEqual({
      loading: true,
      error: null,
    });
  });

  it("should transition to idle on completeAIRequest", () => {
    let state = createState();
    state = applyEffect(state, startAIRequest.of(null));
    state = applyEffect(state, completeAIRequest.of(null));
    expect(state.field(aiStateField)).toEqual({
      loading: false,
      error: null,
    });
  });

  it("should transition to error on errorAIRequest", () => {
    let state = createState();
    state = applyEffect(state, startAIRequest.of(null));
    state = applyEffect(state, errorAIRequest.of("Something went wrong"));
    expect(state.field(aiStateField)).toEqual({
      loading: false,
      error: "Something went wrong",
    });
  });

  it("should clear error when starting a new request", () => {
    let state = createState();
    state = applyEffect(state, errorAIRequest.of("error"));
    state = applyEffect(state, startAIRequest.of(null));
    expect(state.field(aiStateField)).toEqual({
      loading: true,
      error: null,
    });
  });
});
