import { describe, it, expect } from "vitest";
import { getListTypeOfLine } from "./list";

describe("getListTypeOfLine", () => {
  it("should detect unordered list", () => {
    expect(getListTypeOfLine("- item")).toEqual(["ul"]);
    expect(getListTypeOfLine("- hello world")).toEqual(["ul"]);
  });

  it("should detect todo list (unchecked)", () => {
    expect(getListTypeOfLine("- [ ] task")).toEqual(["todo"]);
  });

  it("should detect todo list (checked)", () => {
    expect(getListTypeOfLine("- [x] done")).toEqual(["todo"]);
  });

  it("should detect ordered list", () => {
    expect(getListTypeOfLine("1. first")).toEqual(["ol", 1]);
    expect(getListTypeOfLine("10. tenth")).toEqual(["ol", 10]);
    expect(getListTypeOfLine("99. item")).toEqual(["ol", 99]);
  });

  it("should return undefined for plain text", () => {
    expect(getListTypeOfLine("plain text")).toBeUndefined();
    expect(getListTypeOfLine("hello")).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    expect(getListTypeOfLine("")).toBeUndefined();
  });

  it("should handle indented list items", () => {
    expect(getListTypeOfLine("  - item")).toEqual(["ul"]);
    expect(getListTypeOfLine("    - [ ] task")).toEqual(["todo"]);
    expect(getListTypeOfLine("  1. item")).toEqual(["ol", 1]);
  });
});
