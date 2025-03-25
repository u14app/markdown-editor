import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const dir = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(dir, "src/editor", "index.ts"),
      name: `markdown_editor`,
      fileName: (format: string) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: [
        {
          dir: resolve(dir, "lib/esm"),
          format: "esm",
        },
        {
          dir: resolve(dir, "lib/cjs"),
          format: "cjs",
        },
      ],
    },
  },
});
