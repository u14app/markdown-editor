export interface AIConfig {
  endpoint?: string;
  apiBaseUrl?: string;
  apiKey?: string;
  model?: string;
  timeout?: number;
  headers?: Record<string, string>;
  customRequest?: (
    prompt: string,
    onChunk?: (chunk: string) => void,
  ) => Promise<string>;
}

const SYSTEM_PROMPT = `You are an AI editing assistant embedded in a Markdown editor.

Rules:
1. Always respond with valid Markdown syntax only — no wrapping code fences unless the content itself is code.
2. Keep responses concise unless the user explicitly asks for more detail.
3. Respond in the same language as the provided text, unless the user explicitly requests a different language.
4. Output only the resulting text. Do not include explanations, commentary, or preamble.`;

export async function callAI(
  prompt: string,
  config: AIConfig,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (config.customRequest) {
    return config.customRequest(prompt, onChunk);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.timeout || 30000,
  );

  try {
    let url: string;
    let headers: Record<string, string>;
    let body: any;

    if (config.apiBaseUrl && config.apiKey) {
      url = `${config.apiBaseUrl}/chat/completions`;
      headers = {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      };
      body = {
        model: config.model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        stream: !!onChunk,
      };
    } else {
      url = config.endpoint || "/api/command";
      headers = { "Content-Type": "application/json" };
      body = {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                fullText += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      return fullText;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") throw new Error("Request timeout");
      throw error;
    }
    throw new Error("Unknown error");
  }
}
