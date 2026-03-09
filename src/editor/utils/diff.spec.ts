import { describe, it, expect } from "vitest";
import { diffChanges } from "./diff";

describe("diffChanges", () => {
  it("should return null when texts are identical", () => {
    expect(diffChanges("hello", "hello")).toBeNull();
  });

  it("should detect appended text", () => {
    expect(diffChanges("hello", "hello world")).toEqual({
      from: 5,
      to: 5,
      insert: " world",
    });
  });

  it("should detect prepended text", () => {
    expect(diffChanges("world", "hello world")).toEqual({
      from: 0,
      to: 0,
      insert: "hello ",
    });
  });

  it("should detect middle change", () => {
    expect(diffChanges("hello world", "hello there")).toEqual({
      from: 6,
      to: 11,
      insert: "there",
    });
  });

  it("should detect full replacement", () => {
    expect(diffChanges("abc", "xyz")).toEqual({
      from: 0,
      to: 3,
      insert: "xyz",
    });
  });

  it("should detect deletion", () => {
    expect(diffChanges("hello world", "hello")).toEqual({
      from: 5,
      to: 11,
      insert: "",
    });
  });

  it("should detect single character change", () => {
    expect(diffChanges("cat", "car")).toEqual({
      from: 2,
      to: 3,
      insert: "r",
    });
  });

  it("should handle empty old text", () => {
    expect(diffChanges("", "new")).toEqual({
      from: 0,
      to: 0,
      insert: "new",
    });
  });

  it("should handle empty new text", () => {
    expect(diffChanges("old", "")).toEqual({
      from: 0,
      to: 3,
      insert: "",
    });
  });
});
