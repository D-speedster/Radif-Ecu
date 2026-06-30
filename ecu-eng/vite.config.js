import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // serve from root so BrowserRouter works during dev
  server: { port: 5173 },
})
