/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require("esbuild");

const mode = process.argv[2]

const shared = {
	watch: mode === "dev",
	minify: mode === "pack",
	bundle: true,
	logLevel: "info"
}

build({
	...shared,
	entryPoints: [
		"./src/background/background.ts"
	],
	outdir: "./crx/background/build/",
	platform: "neutral",
	tsconfig: "./src/background/tsconfig.json"
});

build({
	...shared,
	entryPoints: [
		"./src/window/output/main.tsx"
	],
	outdir: "./crx/content/build/",
	platform: "browser",
	tsconfig: "./src/window/tsconfig.json",
	inject: ["./preact-shim.js"]
});