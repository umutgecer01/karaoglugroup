import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from 'node:process';
import { SITE_IMAGE_URL, SITE_URL } from "./site.config.mjs";

export default defineConfig({
  define: {
    __DEPLOY_PREVIEW__: JSON.stringify(['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)),
  },
  server: {
    // Audit artifacts are not application inputs. On Windows an actively written
    // report can be locked and crash the filesystem watcher with EBUSY.
    watch: { ignored: ['**/.audit/**', '**/reports/**'] },
  },
  plugins: [
    react(),
    {
      name: "karaoglu-site-url-html",
      transformIndexHtml(html) {
        return html
          .replaceAll("%SITE_URL%", SITE_URL)
          .replaceAll("%SITE_IMAGE_URL%", SITE_IMAGE_URL);
      },
    },
  ],
});
