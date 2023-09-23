import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				"": resolve(__dirname, "src/index.ts"),
				Model: resolve(__dirname, "src/Model/index.ts"),
				Url: resolve(__dirname, "src/Url/index.ts"),
				Send: resolve(__dirname, "src/Send/index.ts"),
				functions: resolve(__dirname, "src/functions/index.ts"),
			},
			name: 'index',
			fileName: (format, entryName) => {
				return `${entryName ? `${entryName}/` : ""}index.${format}.js`;
			},
			formats: ["cjs", "es"],
		},
		rollupOptions: {
			output: {
				sourcemap: true
			}
		}
	},
});