import type { NextConfig } from "next";
import { DEMO_NOINDEX_HEADERS } from "./lib/demo/headers";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 82, 85, 88, 90, 92, 95, 100],
    localPatterns: [
      { pathname: "/**" },
    ],
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/demo-shot": ["./node_modules/@sparticuz/chromium/**"],
  },
  async headers() {
    return DEMO_NOINDEX_HEADERS;
  },
};

export default nextConfig;
