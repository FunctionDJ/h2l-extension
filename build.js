import { context } from "esbuild";

const mode = process.argv[2];

const shared = {
	minify: mode === "pack",
	bundle: true,
	logLevel: "info",
};

const backgroundContext = await context({
	...shared,
	entryPoints: ["./src/background/background.ts"],
	outdir: "./crx/background/build/",
	platform: "neutral",
	tsconfig: "./src/background/tsconfig.json",
});

const windowContext = await context({
	...shared,
	entryPoints: ["./src/window/main.tsx"],
	outdir: "./crx/content/build/",
	platform: "browser",
	tsconfig: "./src/window/tsconfig.json",
	inject: ["./preact-shim.js"],
});

if (mode === "dev") {
	backgroundContext.watch();
	windowContext.watch();
} else {
	backgroundContext.rebuild().then(() => backgroundContext.dispose());
	windowContext.rebuild().then(() => windowContext.dispose());
}
