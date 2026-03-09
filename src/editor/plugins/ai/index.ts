import type { Extension } from "@codemirror/state";
import { aiStateField, aiHighlightField } from "./state";
import { aiTooltipPlugin, type AITooltipConfig } from "./tooltip-ai";
import { aiSlashPlugin, type AISlashConfig } from "./slash-ai";

export interface AIPluginI18n {
  improveWriting?: string;
  emojify?: string;
  makeLonger?: string;
  makeShorter?: string;
  fixSpellingGrammar?: string;
  simplifyLanguage?: string;
  continueWriting?: string;
  summary?: string;
  comment?: string;
  explain?: string;
  askAI?: string;
  askAIPlaceholder?: string;
}

export interface AIPluginConfig {
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
  enableTooltip?: boolean;
  enableSlash?: boolean;
  i18n?: Partial<AIPluginI18n>;
}

export function aiPlugin(config: AIPluginConfig = {}): Extension {
  const extensions: Extension[] = [aiStateField, aiHighlightField];

  if (config.enableTooltip !== false) {
    const tooltipConfig: AITooltipConfig = {
      endpoint: config.endpoint,
      apiBaseUrl: config.apiBaseUrl,
      apiKey: config.apiKey,
      model: config.model,
      timeout: config.timeout || 30000,
      headers: config.headers,
      customRequest: config.customRequest,
      i18n: config.i18n,
    };
    extensions.push(aiTooltipPlugin(tooltipConfig));
  }

  if (config.enableSlash !== false) {
    const slashConfig: AISlashConfig = {
      endpoint: config.endpoint,
      apiBaseUrl: config.apiBaseUrl,
      apiKey: config.apiKey,
      model: config.model,
      timeout: config.timeout || 30000,
      headers: config.headers,
      customRequest: config.customRequest,
      i18n: config.i18n,
    };
    extensions.push(aiSlashPlugin(slashConfig));
  }

  return extensions;
}

export type { AITooltipConfig, AISlashConfig };
