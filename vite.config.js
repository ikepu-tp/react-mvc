import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				Model: resolve(__dirname, "src/Model/index.ts"),
			},
			name: 'index',
			fileName: (format, entryName) => {
				return `${entryName}/index.${format}.js`;
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