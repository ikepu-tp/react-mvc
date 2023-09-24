import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				"": resolve(__dirname, "src/index.ts"),
				functions: resolve(__dirname, "src/functions/index.ts"),
				Url: resolve(__dirname, "src/Url/index.ts"),
				Send: resolve(__dirname, "src/Send/index.ts"),
				Model: resolve(__dirname, "src/Model/index.ts"),
			},
			name: '@ikepu-tp/react-mvc',
			fileName: (format, entryName) => {
				return `${format}/${entryName ? `${entryName}/` : ""}index.js`;
			},
			formats: ["cjs", "esm"],
		},
		rollupOptions: {},
		minify: false,
		outDir: "./dist"
	},
});