# @xiangfa/mdeditor

A Markdown editor with built-in syntax highlighting based on CodeMirror.

## Install

```bash
pnpm add @xiangfa/mdeditor
# or
yarn add @xiangfa/mdeditor
# or
npm install @xiangfa/mdeditor
```

### First editor

```javascript
import {
  MagicdownEditor,
  tooltipPlugin,
  slashPlugin,
  placeholderPlugin,
} from "@xiangfa/mdeditor";

const editor = new MagicdownEditor({
  root,
  defaultValue: defaultDoc,
  theme: "system",
  extensions: [
    tooltipPlugin({ bold: "Bold" }),
    slashPlugin({ heading: { name: "Heading" } }),
    placeholderPlugin("Please enter text..."),
  ],
});

editor.create().then(({ view }) => {
  conole.log(editor.value);
  setTimeout(() => {
    editor.update("New documentation content");
  }, 3000);
});
```

Initialization parameters:

```typescript
interface EditorConfig {
  root?: Element | DocumentFragment;
  defaultValue?: string | Text;
  languages?: LanguageDescription[];
  themes?: Extension[];
  extensions?: Extension[]; // 手动传入插件/扩展
  keymaps?: KeyBinding[];
}
```
