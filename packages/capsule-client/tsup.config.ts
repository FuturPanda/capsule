import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/browser.ts"],
  dts: true,
  format: ["cjs", "esm"],
  platform: "browser",
  esbuildOptions(options) {
    options.platform = "browser";

    options.bundle = true;

    options.define = {
      ...options.define,
      "process.env.NODE_ENV": '"production"',
    };

    options.external = ["node:*"];
  },
});
