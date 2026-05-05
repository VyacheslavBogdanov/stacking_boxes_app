import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.e2e.ts',
	fullyParallel: false,
	workers: 1,
	reporter: 'html',

	use: {
		baseURL: 'http://127.0.0.1:5173',
		testIdAttribute: 'data-test',
		trace: 'on-first-retry',
	},

	webServer: [
		{
			command: 'npm run server:e2e',
			url: 'http://127.0.0.1:5011/grades',
			reuseExistingServer: false,
			timeout: 120_000,
		},
		{
			command: 'npm run dev -- --host 127.0.0.1',
			url: 'http://127.0.0.1:5173',
			reuseExistingServer: false,
			timeout: 120_000,
		},
	],

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
