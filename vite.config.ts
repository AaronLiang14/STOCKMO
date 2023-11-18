import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), Icons({ compiler: "jsx", jsx: "react" })],
    server: {
      proxy: {
        "/api": {
          target: "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
