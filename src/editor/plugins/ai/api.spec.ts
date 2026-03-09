import { describe, it, expect, vi, beforeEach } from "vitest";
import { callAI, type AIConfig } from "./api";

describe("callAI", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should use customRequest when provided", async () => {
    const customRequest = vi.fn().mockResolvedValue("custom result");
    const config: AIConfig = { customRequest };

    const result = await callAI("test prompt", config);

    expect(customRequest).toHaveBeenCalledWith(
      "test prompt",
      undefined,
      expect.any(AbortSignal),
    );
    expect(result).toBe("custom result");
  });

  it("should pass onChunk to customRequest", async () => {
    const onChunk = vi.fn();
    const customRequest = vi.fn().mockResolvedValue("result");
    const config: AIConfig = { customRequest };

    await callAI("prompt", config, onChunk);

    expect(customRequest).toHaveBeenCalledWith(
      "prompt",
      onChunk,
      expect.any(AbortSignal),
    );
  });

  it("should construct OpenAI-compatible request when apiBaseUrl and apiKey are provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: null,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "AI response" } }],
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const config: AIConfig = {
      apiBaseUrl: "https://api.openai.com/v1",
      apiKey: "sk-test",
      model: "gpt-4",
    };

    const result = await callAI("hello", config);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer sk-test",
          "Content-Type": "application/json",
        },
      }),
    );

    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body.model).toBe("gpt-4");
    expect(body.messages).toEqual([
      { role: "system", content: expect.stringContaining("AI editing") },
      { role: "user", content: "hello" },
    ]);
    expect(body.stream).toBe(false);
    expect(result).toBe("AI response");
  });

  it("should use custom endpoint when no apiBaseUrl", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: null,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "response" } }],
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const config: AIConfig = { endpoint: "/my-api" };

    await callAI("prompt", config);

    expect(mockFetch).toHaveBeenCalledWith(
      "/my-api",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("should default endpoint to /api/command", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: null,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "" } }],
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await callAI("prompt", {});

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/command",
      expect.anything(),
    );
  });

  it("should throw on HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    await expect(callAI("prompt", {})).rejects.toThrow("API error: 500");
  });

  it("should handle streaming response with onChunk", async () => {
    const chunks = [
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n',
      'data: {"choices":[{"delta":{"content":" World"}}]}\n',
      "data: [DONE]\n",
    ];

    const encoder = new TextEncoder();
    let chunkIndex = 0;

    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        if (chunkIndex < chunks.length) {
          const value = encoder.encode(chunks[chunkIndex]);
          chunkIndex++;
          return Promise.resolve({ done: false, value });
        }
        return Promise.resolve({ done: true, value: undefined });
      }),
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      }),
    );

    const onChunk = vi.fn();
    const config: AIConfig = {
      apiBaseUrl: "https://api.example.com",
      apiKey: "key",
    };

    const result = await callAI("prompt", config, onChunk);

    expect(onChunk).toHaveBeenCalledWith("Hello");
    expect(onChunk).toHaveBeenCalledWith(" World");
    expect(result).toBe("Hello World");
  });
});
