import { MarkdownEditor } from "./editor";

const defaultDoc = `# Milkdown

👋 Welcome to Milkdown. We are so glad to see you here!

💭 You may wonder, what is Milkdown? Please write something here.

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

You're seeing this editor called **🥞Crepe**, which is an editor built on top of Milkdown.

If you want to install this editor, you can run \`npm install @milkdown/crepe\`. Then you can use it like this:

\`\`\`JavaScript
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
// We have some themes for you to choose, ex.
import "@milkdown/crepe/theme/frame.css";

// Or you can create your own theme
import "./your-theme.css";

const crepe = new Crepe({
  root: "#app",
  defaultValue: "# Hello, Milkdown!",
});

crepe.create().then(() => {
  console.log("Milkdown is ready!");
});

// Before unmount
crepe.destroy();
\`\`\`

***

## Structure

> 🍼 [Milkdown](https://github.com/Milkdown/milkdown) is a WYSIWYG markdown editor framework.
>
> Which means you can build your own markdown editor with Milkdown.

In the real world, a typical milkdown editor is built on top of 3 layers:

* [x] 🥛 Core: The core of Milkdown, which provides the plugin loading system with the editor concepts.
* [x] 🧇 Plugins: A set of plugins that can be used to extend the functionalities of the editor.
* [x] 🍮 Components: Some headless components that can be used to build your own editor.

At the start, you may find it hard to understand all these concepts.
But don't worry, we have this \`@milkdown/crepe\` editor for you to get started quickly.

***

## You can do more with Milkdown

In Milkdown, you can extend the editor in many ways:

| Feature      | Description                                          | Example                   |
| ------------ | ---------------------------------------------------- | ------------------------- |
| 🎨 Theme     | Create your own theme with CSS                       | Nord, Dracula             |
| 🧩 Plugin    | Create your own plugin to extend the editor          | Search, Collab            |
| 📦 Component | Create your own component to build your own editor   | Slash Menu, Toolbar       |
| 📚 Syntax    | Create your own syntax to extend the markdown parser | Image with Caption, LaTex |

We have provided a lot of plugins and components, with an out-of-the-box crepe editor for you to use and learn.

***

## Open Source

* Milkdown is an open-source project under the MIT license.
* Everyone is welcome to contribute to the project, and you can use it in your own project for free.
* Please let me know what you are building with Milkdown, I would be so glad to see that!

Maintaining Milkdown is a lot of work, and we are working on it in our spare time.
If you like Milkdown, please consider supporting us by [sponsoring](https://github.com/sponsors/Saul-Mirone) the project.
We'll be so grateful for your support.

## Who built Milkdown?

Milkdown is built by [Mirone](https://github.com/Saul-Mirone) and designed by [Meo](https://meo.cool).`;

const root = document.createElement("div");

const editor = new MarkdownEditor({
  root,
  defaultValue: "# Initialize Text",
  onChange: (value) => {
    console.log(value);
  },
});

editor.create().then(() => {
  setTimeout(() => {
    editor.update(defaultDoc);
  }, 2000);
});

document.querySelector<HTMLDivElement>("#app")?.appendChild(root);
