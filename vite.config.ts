import * as path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), Icons({ autoInstall: true, compiler: "vue3" })],
    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(__dirname, "./src") },
            { find: "@v", replacement: path.resolve(__dirname, "./src/views") },
            { find: "@c", replacement: path.resolve(__dirname, "./src/components") },
            { find: "node-fetch", replacement: "isomorphic-fetch" },
        ],
    },
});
