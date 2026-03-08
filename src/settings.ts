import { createElement, icons } from "lucide";

const STORAGE_KEY = "mdeditor-settings";

export interface Settings {
  theme: "system" | "light" | "dark";
  ai: {
    apiBaseUrl: string;
    apiKey: string;
    model: string;
  };
}

const defaultSettings: Settings = {
  theme: "system",
  ai: { apiBaseUrl: "", apiKey: "", model: "" },
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
        ai: { ...defaultSettings.ai, ...parsed.ai },
      };
    }
  } catch {
    // ignore
  }
  return { ...defaultSettings, ai: { ...defaultSettings.ai } };
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface SettingsUIOptions {
  settings: Settings;
  onThemeChange: (theme: Settings["theme"]) => void;
  onAISettingsChange: (ai: Settings["ai"]) => void;
}

export function createSettingsUI(options: SettingsUIOptions): HTMLElement {
  const { settings } = options;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .mdeditor-settings-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #f8f9ff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: transform 0.2s, box-shadow 0.2s;
      color: #334155;
    }
    .mdeditor-settings-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .mdeditor-settings-btn svg {
      width: 20px;
      height: 20px;
    }
    .mdeditor-settings-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      z-index: 1001;
      display: none;
      justify-content: center;
      align-items: center;
    }
    .mdeditor-settings-overlay.open {
      display: flex;
    }
    .mdeditor-settings-panel {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 28px;
      width: 400px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      color: #334155;
    }
    .mdeditor-settings-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 20px 0;
    }
    .mdeditor-settings-section {
      margin-bottom: 20px;
    }
    .mdeditor-settings-section-title {
      font-size: 13px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .mdeditor-settings-radios {
      display: flex;
      gap: 4px;
      background: #f1f3f5;
      border-radius: 8px;
      padding: 3px;
    }
    .mdeditor-settings-radio {
      flex: 1;
      padding: 7px 0;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      color: #555;
      transition: background 0.15s, color 0.15s;
    }
    .mdeditor-settings-radio.active {
      background: #fff;
      color: #334155;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-weight: 500;
    }
    .mdeditor-settings-field {
      margin-bottom: 10px;
    }
    .mdeditor-settings-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 4px;
      color: #555;
    }
    .mdeditor-settings-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      background: #fff;
      color: #334155;
      transition: border-color 0.15s;
    }
    .mdeditor-settings-input:focus {
      border-color: #4a90e2;
    }
    .mdeditor-settings-save {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: #334155;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }
    .mdeditor-settings-save:hover {
      background: #1e293b;
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");

  // Floating button
  const btn = document.createElement("button");
  btn.className = "mdeditor-settings-btn";
  const settingsIcon = createElement(icons.Settings);
  btn.appendChild(settingsIcon);

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "mdeditor-settings-overlay";

  // Panel
  const panel = document.createElement("div");
  panel.className = "mdeditor-settings-panel";
  panel.addEventListener("click", (e) => e.stopPropagation());

  const title = document.createElement("h2");
  title.className = "mdeditor-settings-title";
  title.textContent = "Settings";
  panel.appendChild(title);

  // Theme section
  const themeSection = document.createElement("div");
  themeSection.className = "mdeditor-settings-section";
  const themeTitle = document.createElement("div");
  themeTitle.className = "mdeditor-settings-section-title";
  themeTitle.textContent = "Theme";
  themeSection.appendChild(themeTitle);

  const themeRadios = document.createElement("div");
  themeRadios.className = "mdeditor-settings-radios";
  const themeOptions: { value: Settings["theme"]; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  let currentTheme = settings.theme;
  const themeButtons: HTMLButtonElement[] = [];

  themeOptions.forEach((opt) => {
    const radio = document.createElement("button");
    radio.className = "mdeditor-settings-radio";
    if (opt.value === currentTheme) radio.classList.add("active");
    radio.textContent = opt.label;
    radio.addEventListener("click", () => {
      currentTheme = opt.value;
      themeButtons.forEach((b) => b.classList.remove("active"));
      radio.classList.add("active");
      // Instant theme switch
      settings.theme = opt.value;
      saveSettings(settings);
      options.onThemeChange(opt.value);
    });
    themeButtons.push(radio);
    themeRadios.appendChild(radio);
  });

  themeSection.appendChild(themeRadios);
  panel.appendChild(themeSection);

  // AI section
  const aiSection = document.createElement("div");
  aiSection.className = "mdeditor-settings-section";
  const aiTitle = document.createElement("div");
  aiTitle.className = "mdeditor-settings-section-title";
  aiTitle.textContent = "AI Configuration";
  aiSection.appendChild(aiTitle);

  const fields: {
    key: keyof Settings["ai"];
    label: string;
    type: string;
    placeholder: string;
  }[] = [
    {
      key: "apiBaseUrl",
      label: "API Base URL",
      type: "text",
      placeholder: "https://api.openai.com/v1",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-...",
    },
    { key: "model", label: "Model", type: "text", placeholder: "gpt-4o" },
  ];

  const inputs: Record<string, HTMLInputElement> = {};

  fields.forEach((field) => {
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "mdeditor-settings-field";
    const label = document.createElement("label");
    label.className = "mdeditor-settings-label";
    label.textContent = field.label;
    fieldDiv.appendChild(label);
    const input = document.createElement("input");
    input.className = "mdeditor-settings-input";
    input.type = field.type;
    input.placeholder = field.placeholder;
    input.value = settings.ai[field.key];
    inputs[field.key] = input;
    fieldDiv.appendChild(input);
    aiSection.appendChild(fieldDiv);
  });

  panel.appendChild(aiSection);

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.className = "mdeditor-settings-save";
  saveBtn.textContent = "Save AI Settings";
  saveBtn.addEventListener("click", () => {
    const newAI: Settings["ai"] = {
      apiBaseUrl: inputs.apiBaseUrl?.value.trim() || "",
      apiKey: inputs.apiKey?.value.trim() || "",
      model: inputs.model?.value.trim() || "",
    };
    settings.ai = newAI;
    saveSettings(settings);
    options.onAISettingsChange(newAI);
    overlay.classList.remove("open");
  });
  panel.appendChild(saveBtn);

  overlay.appendChild(panel);

  // Open/close
  btn.addEventListener("click", () => overlay.classList.toggle("open"));
  overlay.addEventListener("click", () => overlay.classList.remove("open"));

  wrapper.appendChild(btn);
  wrapper.appendChild(overlay);

  return wrapper;
}
