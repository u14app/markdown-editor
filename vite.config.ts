import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const dir = dirname(fileURLToPath(import.meta.url));

// 收集所有入口文件，排除 spec 测试文件
const entries = Object.fromEntries(
  glob
    .sync("src/editor/**/*.ts", {
      ignore: ["src/**/*.spec.ts"],
    })
    .map((file) => [
      relative("src", file.slice(0, file.length - extname(file).length)),
      resolve(dir, file),
    ]),
);

export default defineConfig({
  plugins: [
    dts({
      include: ["src/editor"],
      exclude: ["src/**/*.spec.ts", "src/main.ts", "src/settings.ts"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(dir, "src/editor/index.ts"),
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      external: [/^@codemirror\//, /^@lezer\//, /^codemirror/, /^lucide/],
      input: entries,
      output: {
        format: "esm",
        dir: resolve(dir, "dist"),
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
