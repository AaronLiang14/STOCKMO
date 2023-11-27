import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), Icons({ compiler: "jsx", jsx: "react" })],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "#root": resolve(__dirname),
      },
    },
  };
});
