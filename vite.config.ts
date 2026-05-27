import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "githubWidget",
      filename: "remoteEntry.js",
      exposes: {
        "./Widget": "./src/components/GithubWidget.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  base: "https://github-widget-one.vercel.app/",
});
