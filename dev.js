const esbuild = require("esbuild")

esbuild.build({
  watch: true,
  bundle: true,
  entryPoints: [
    "./src/background/main.ts"
  ],
  outdir: "./src/background/build",
  platform: "neutral",
  logLevel: "info"
})

esbuild.build({
  watch: true,
  bundle: true,
  entryPoints: [
    "./src/window/output/main.ts"
  ],
  outdir: "./src/window/output/build",
  platform: "browser",
  logLevel: "info"
})