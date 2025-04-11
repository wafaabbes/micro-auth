import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Accès au serveur depuis n'importe quelle adresse IP.
    port: 8080, // Port du serveur de développement.
  },
  plugins: [
    react(), // Plugin React
    mode === 'development' && componentTagger(), // Plugin 'lovable-tagger' en mode dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias pour le dossier 'src'.
    },
  },
  build: {
    minify: 'terser', // Minification pour la production
    sourcemap: true,  // Sourcemaps pour le débogage
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://default-api-url.com'),
  },
}));
