import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				Function: resolve(__dirname, "src/Function.ts"),
				Url: resolve(__dirname, "src/Url.ts"),
				Send: resolve(__dirname, "src/Send.ts"),
				Model: resolve(__dirname, "src/Model.ts"),
				Controller: resolve(__dirname, "src/Controller.tsx"),
				View: resolve(__dirname, "src/View.tsx"),
				index: resolve(__dirname, "src/index.ts"),
			},
			name: '@ikepu-tp/react-mvc',
			fileName: (format, entryName) => {
				return `${format}/${entryName}.js`;
			},
			formats: ["cjs", "esm"],
		},
		rollupOptions: {},
		minify: false,
		outDir: "./dist"
	},
});