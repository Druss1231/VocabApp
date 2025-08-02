import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // ←これを追加
    port: 5174, // ←任意のポート番号（デフォルト5173）
  },
})
