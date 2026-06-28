import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro()
  ],
  ssr: {
    external: ['@node-rs/argon2', '@node-rs/bcrypt', 'postgres']
  },
  build: {
    rollupOptions: {
      external: ['@node-rs/argon2', '@node-rs/bcrypt', 'postgres']
    }
  },
  optimizeDeps: {
    exclude: ['@node-rs/argon2', '@node-rs/bcrypt', 'postgres']
  }
});
