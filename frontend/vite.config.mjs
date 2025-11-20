import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Create a small, conservative manualChunks split to keep the main
        // bundle smaller. This splits common React-related libs into
        // a separate chunk and groups the rest of node_modules into `vendor`.
        manualChunks(id) {
          if (!id) return null;
          if (id.includes('node_modules')) {
            // react-related libs
            if (id.match(/node_modules\/(react|react-dom|@reduxjs|redux|@reduxjs\/toolkit|recharts|framer-motion|d3|lucide-react)\//)) {
              return 'vendor_react';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: true
  }
});