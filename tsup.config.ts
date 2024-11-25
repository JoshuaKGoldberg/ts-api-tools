import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	outDir: "lib",
	sourcemap: false,
	target: "node16",
	treeshake: {
		preset: "smallest",
	},
});
