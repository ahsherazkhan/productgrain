import { defineConfig, devices } from "@playwright/test";

const systemChrome =
  process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1"
    ? { channel: "chrome" as const }
    : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], ...systemChrome },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"], ...systemChrome },
    },
  ],
});
