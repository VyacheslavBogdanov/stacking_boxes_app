import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	baseURL: 'http://localhost:5173',
	timeout: 30_000,
	use: {
		headless: true,
	},
});
