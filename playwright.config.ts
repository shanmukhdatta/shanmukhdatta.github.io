import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser',
  testMatch: '**/*.e2e.ts',
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4390',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], reducedMotion: 'reduce' } },
  ],
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 4390',
    url: 'http://127.0.0.1:4390',
    reuseExistingServer: false,
    env: {
      SUPABASE_URL: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      ADMIN_EMAIL: '',
      SESSION_SECRET: '',
      GROQ_API_KEY: '',
      RESEND_API_KEY: '',
    },
  },
});
