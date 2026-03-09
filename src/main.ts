import { MagicdownEditor, aiPlugin } from "./editor";
import { loadSettings, createSettingsUI } from "./settings";

const defaultDoc = `# Magicdown Editor

👋 Welcome to Magicdown Editor. We are so glad to see you here!

💭 You may wonder, what is Magicdown Editor? Please write something here.

> ⚠️ **Not the right side!**
>
> Please try something on the left side.

![1.00](/logo.svg "Logo")

\`\`\`Mermaid
graph TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
\`\`\`

You're seeing this editor called **Magicdown Editor**, which is an editor built on top of CodeMirror.

If you want to install this editor, you can run \`npm install @xiangfa/mdeditor\`. Then you can use it like this:

\`\`\`JavaScript
import { MagicdownEditor } from "@xiangfa/mdeditor";

const editor = new MagicdownEditor({
  root,
  defaultValue: defaultDoc,
});

editor.create().then(({ view }) => {
  conole.log(editor.value);
  setTimeout(() => {
    editor.update("New documentation content");
  }, 3000);
});
\`\`\`

***

## Structure

> 🍼 [Magicdown Editor](https://github.com/u14app/markdown-editor) is a markdown editor framework.
>
> Which means you can build your own markdown editor with Magicdown Editor.

In the real world, a typical Magicdown editor is built on top of 2 layers:

* [x] 🥛 Core: The core of Magicdown Editor, which provides the plugin loading system with the editor.
* [x] 🧇 Plugins: A set of plugins that can be used to extend the functionalities of the editor.

At the start, you may find it hard to understand all these editor.
But don't worry, we have this \`@xiangfa/mdeditor\` editor for you to get started quickly.

***

## You can do more with Magicdown Editor

In Magicdown Editor, you can extend the editor in many ways:

| Feature      | Description                                          |
| ------------ | ---------------------------------------------------- |
| 🎨 Theme     | Create your own theme with CSS                       |
| 🧩 Plugin    | Create your own plugin to extend the editor          |
| 📚 Syntax    | Create your own syntax to extend the markdown parser |

We have provided a lot of plugins, with an out-of-the-box markdown editor for you to use and learn.

***

## Open Source

* Magicdown Editor is an open-source project under the MIT license.
* Everyone is welcome to contribute to the project, and you can use it in your own project for free.
* Please let me know what you are building with Magicdown Editor, I would be so glad to see that!

## Who built Magicdown Editor?

Magicdown Editor is built by [u14app](https://github.com/u14app) and designed by [Amery2010](https://github.com/Amery2010).`;

const root = document.createElement("div");
const app = document.querySelector<HTMLDivElement>("#app")!;
app.appendChild(root);

const settings = loadSettings();

let editor: MagicdownEditor | null | void = null;

async function createEditor(doc?: string) {
  editor = await MagicdownEditor.create({
    root,
    defaultValue: doc || "# Initialize Text",
    theme: settings.theme,
    extensions: [
      ...(settings.ai.apiBaseUrl && settings.ai.apiKey
        ? [
            aiPlugin({
              customRequest: async (prompt, onChunk, signal) => {
                // 用户自行实现请求逻辑
                const res = await fetch(
                  `${settings.ai.apiBaseUrl}/chat/completions`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${settings.ai.apiKey}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      model: settings.ai.model,
                      messages: [
                        {
                          role: "system",
                          content:
                            "You are an AI editing assistant embedded in a Markdown editor.",
                        },
                        { role: "user", content: prompt },
                      ],
                      stream: true,
                    }),
                    signal,
                  },
                );
                // 流式输出
                const reader = res.body!.getReader();
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
                        const content =
                          parsed.choices?.[0]?.delta?.content || "";
                        if (content) {
                          fullText += content;
                          onChunk && onChunk(content);
                        }
                      } catch (e) {
                        // Skip invalid JSON
                      }
                    }
                  }
                }
                return fullText;
              },
              enableTooltip: true,
              enableSlash: true,
              i18n: {
                improveWriting: "提升写作",
                emojify: "添加 Emoji",
                makeLonger: "扩展内容",
                makeShorter: "精简内容",
                fixSpellingGrammar: "修正语法",
                simplifyLanguage: "简化语言",
                continueWriting: "继续写作",
                summary: "总结",
                comment: "添加注释",
                explain: "解释说明",
                askAI: "询问 AI",
                askAIPlaceholder: "向 AI 提问...",
              },
            }),
          ]
        : []),
    ],
    onChange: () => {},
    i18n: {
      placeholder: "请输入文本...",
      slash: {
        heading: { name: "标题" },
        h1: { name: "一级标题", description: "插入一级标题" },
      },
      tooltip: { bold: "粗体" },
    },
  }).then((editor) => {
    editor.update(defaultDoc);
  });
}

createEditor();

// Listen for system theme changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", () => {
  if (settings.theme === "system") {
    editor?.setTheme("system");
  }
});

// Settings UI
const settingsUI = createSettingsUI({
  settings,
  onThemeChange: (theme) => {
    editor?.setTheme(theme);
  },
  onAISettingsChange: () => {
    const currentDoc = editor?.status === "created" ? editor.value : undefined;
    editor?.destroy();
    root.innerHTML = "";
    createEditor(currentDoc);
  },
});

app.appendChild(settingsUI);
