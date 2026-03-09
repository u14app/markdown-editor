import { describe, it, expect } from "vitest";
import { isBrowser } from "./environment";

describe("isBrowser", () => {
  it("should return false in Node.js environment", () => {
    expect(isBrowser()).toBe(false);
  });
});
