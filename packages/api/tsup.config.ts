import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	outDir: "build",
	splitting: false,
	sourcemap: true,
	format: ["esm"],
	dts: true,
	clean: true,
});
