import { describe, it, expect, vi } from "vitest";

vi.mock("../icons", () => ({}));

import { formatUtils } from "./tooltip";

describe("formatUtils", () => {
  describe("bold", () => {
    it("should detect bold text", () => {
      expect(formatUtils.bold.test("**hello**")).toBe(true);
      expect(formatUtils.bold.test("**multi word**")).toBe(true);
    });

    it("should not detect non-bold text", () => {
      expect(formatUtils.bold.test("hello")).toBe(false);
      expect(formatUtils.bold.test("*hello*")).toBe(false);
    });

    it("should remove bold markers", () => {
      expect(formatUtils.bold.remove("**hello**")).toBe("hello");
      expect(formatUtils.bold.remove("**multi word**")).toBe("multi word");
    });
  });

  describe("italic", () => {
    it("should detect italic text", () => {
      expect(formatUtils.italic.test("*hello*")).toBe(true);
    });

    it("should not match bold as italic", () => {
      expect(formatUtils.italic.test("**hello**")).toBe(false);
    });

    it("should remove italic markers", () => {
      expect(formatUtils.italic.remove("*hello*")).toBe("hello");
    });
  });

  describe("strikethrough", () => {
    it("should detect strikethrough text", () => {
      expect(formatUtils.strikethrough.test("~~hello~~")).toBe(true);
    });

    it("should not detect non-strikethrough text", () => {
      expect(formatUtils.strikethrough.test("hello")).toBe(false);
    });

    it("should remove strikethrough markers", () => {
      expect(formatUtils.strikethrough.remove("~~hello~~")).toBe("hello");
    });
  });

  describe("code", () => {
    it("should detect inline code", () => {
      expect(formatUtils.code.test("`code`")).toBe(true);
      expect(formatUtils.code.test("`hello world`")).toBe(true);
    });

    it("should not detect non-code text", () => {
      expect(formatUtils.code.test("code")).toBe(false);
    });

    it("should remove code markers", () => {
      expect(formatUtils.code.remove("`code`")).toBe("code");
    });
  });

  describe("math", () => {
    it("should detect inline math", () => {
      expect(formatUtils.math.test("$x+1$")).toBe(true);
    });

    it("should not match block math ($$)", () => {
      expect(formatUtils.math.test("$$x+1$$")).toBe(false);
    });

    it("should not detect non-math text", () => {
      expect(formatUtils.math.test("hello")).toBe(false);
    });

    it("should remove math markers", () => {
      expect(formatUtils.math.remove("$x+1$")).toBe("x+1");
    });
  });

  describe("link", () => {
    it("should detect links", () => {
      expect(formatUtils.link.test("[text](url)")).toBe(true);
      expect(formatUtils.link.test("[hello](https://example.com)")).toBe(true);
    });

    it("should not detect non-link text", () => {
      expect(formatUtils.link.test("hello")).toBe(false);
    });

    it("should remove link syntax, keeping text", () => {
      expect(formatUtils.link.remove("[text](url)")).toBe("text");
      expect(formatUtils.link.remove("[hello](https://example.com)")).toBe(
        "hello",
      );
    });
  });
});
