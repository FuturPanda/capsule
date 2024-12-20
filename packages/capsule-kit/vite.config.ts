import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import * as fs from "node:fs";
import { parse } from "smol-toml";

const tomlPlugin = (): Plugin => ({
  name: "vite-plugin-toml",
  transform(code: string, id: string) {
    if (id.endsWith(".toml")) {
      try {
        const parsed = parse(code);

        return {
          code: `export default ${JSON.stringify(parsed)};`,
          map: null,
        };
      } catch (error: any) {
        this.error(`Failed to parse TOML file ${id}: ${error.message}`);
      }
    }
  },
});

const typeDeclarations = (): Plugin => ({
  name: "type-declarations",
  buildStart() {
    const typesDir = path.resolve(__dirname, "src/_utils/types");
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    const dtsPath = path.resolve(typesDir, "toml.d.ts");
    fs.writeFileSync(
      dtsPath,
      `declare module "*.toml" {
        const content: Migration;
        export default content;
      }`,
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-05",
            },
          ],
        ],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: { globPatterns: ["**/*{js, ts, css, html, ico, png, svg}"] },
    }),
    TanStackRouterVite(),
    typeDeclarations(),
    tomlPlugin(),
  ],
  build: {
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
