import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Force-enable nitro so `NITRO_PRESET=vercel npm run build`
  // produces `.vercel/output` on Vercel (outside the Lovable sandbox).
  nitro: true,
  tanstackStart: {
    server: { entry: "server" },
  },
});
