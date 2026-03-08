import { type Text, type Extension, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  placeholder,
  type KeyBinding,
} from "@codemirror/view";
import {
  syntaxHighlighting,
  type LanguageDescription,
} from "@codemirror/language";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { themeHighlightStyle } from "./theme";
import {
  tooltipPlugin,
  type I18n as TooltipPluginI18n,
} from "./plugins/tooltip";
import { slashPlugin, type I18n as SlashPluginI18n } from "./plugins/slash";
import { placeholderPlugin } from "./plugins/placeholder";

interface I18n {
  tooltip?: Partial<TooltipPluginI18n>;
  slash?: Partial<SlashPluginI18n>;
  placeholder?: string;
}
export interface EditorConfig {
  root: Element | DocumentFragment | null;
  defaultValue?: string | Text;
  languages?: LanguageDescription[];
  themes?: Extension[];
  extensions?: Extension[];
  keymaps?: KeyBinding[];
  placeholder?: string;
  theme?: "system" | "light" | "dark";
  i18n?: I18n;
  onChange?: (value: string) => void;
}

const defaultPlaceholder = 'Please enter text, or enter "/ " to use commands';

export class MagicdownEditor {
  readonly EditorView = EditorView;
  readonly root: Element | DocumentFragment | null;
  readonly defaultValue?: string | Text;
  extensions: Extension[];
  view?: EditorView;
  languages: LanguageDescription[];
  themes: Extension[];
  keymaps: KeyBinding[];
  i18n?: I18n;
  onChange?: (value: string) => void;
  status: "init" | "created" | "destroy";
  theme: "system" | "light" | "dark";
  private themeCompartment = new Compartment();
  constructor(config: EditorConfig) {
    this.root = config.root;
    this.defaultValue = config.defaultValue;
    this.languages = config.languages ?? [];
    this.themes = config.themes ?? [];
    this.extensions = config.extensions ?? [];
    this.keymaps = config.keymaps ?? [];
    this.theme = config.theme ?? "system";
    this.i18n = config.i18n;
    if (config.onChange) this.onChange = config.onChange;
    this.status = "init";
  }
  private isDark(): boolean {
    if (this.theme === "dark") return true;
    if (this.theme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  private async getThemeExtension() {
    const { lightTheme, darkTheme } = await import("./theme");
    return this.isDark()
      ? [darkTheme, syntaxHighlighting(themeHighlightStyle)]
      : [lightTheme, syntaxHighlighting(themeHighlightStyle)];
  }
  async create() {
    if (this.languages.length === 0) {
      const { languages: langList } = await import("@codemirror/language-data");
      this.languages = langList;
    }

    if (this.status !== "init") return;

    const editorView = new EditorView({
      doc: this.defaultValue,
      parent: this.root || document.createElement("div"),
      extensions: [
        markdown({
          codeLanguages: this.languages,
        }),
        history(),
        placeholder(this.i18n?.placeholder || defaultPlaceholder),
        this.themeCompartment.of(await this.getThemeExtension()),
        ...this.themes,
        ...this.extensions,
        EditorView.lineWrapping,
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
          ...this.keymaps,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            if (this.onChange) this.onChange(this.value);
          }
        }),
        tooltipPlugin(this.i18n?.tooltip),
        slashPlugin(this.i18n?.slash),
        placeholderPlugin(this.i18n?.placeholder || defaultPlaceholder),
      ],
    });

    this.view = editorView;
    this.status = "created";
  }
  get value(): string {
    if (this.view) {
      return this.view.state.doc.toString();
    } else {
      throw new Error("Please use `create()` to create an instance.");
    }
  }
  update(value: string) {
    if (this.view) {
      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: value },
      });
      return this;
    } else {
      throw new Error("Please use `create()` to create an instance.");
    }
  }
  async setTheme(theme: "system" | "light" | "dark") {
    this.theme = theme;
    if (this.view) {
      this.view.dispatch({
        effects: this.themeCompartment.reconfigure(
          await this.getThemeExtension(),
        ),
      });
    }
  }
  use(plugin: Extension | Extension[]) {
    if (Array.isArray(plugin)) {
      this.extensions = [...this.extensions, ...plugin];
    } else {
      this.extensions.push(plugin);
    }
    return this;
  }
  destroy(): void {
    this.status = "destroy";
    this.view?.destroy();
  }
}

export { aiPlugin, type AIPluginConfig, type AIPluginI18n } from "./plugins/ai";
