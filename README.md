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
```

Initialization parameters:

```typescript
interface EditorConfig {
  root?: Element | DocumentFragment;
  defaultValue?: string | Text;
  languages?: LanguageDescription[];
  themes?: Extension[];
  extensions?: Extension[];
  keymaps?: KeyBinding[];
  i18n?: I18n;
}
```
