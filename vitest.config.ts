import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			exclude: ["lib"],
			include: ["src"],
			reporter: ["html", "lcov"],

			// c8 reports types-only lines as uncovered
			// https://github.com/JoshuaKGoldberg/ts-api-utils/issues/100
			provider: "istanbul",
		},
		exclude: ["lib", "node_modules"],
	},
});
