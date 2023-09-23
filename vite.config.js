import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				"": resolve(__dirname, "src/index.ts"),
				Model: resolve(__dirname, "src/Model/index.ts"),
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