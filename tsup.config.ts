import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  outDir: "dist",
  clean: true,

  platform: "neutral",
  target: "es2022",
  format: ["esm"],
  dts: true,

  cjsInterop: true,
  replaceNodeEnv: true,
  shims: true,
  splitting: true,
});
