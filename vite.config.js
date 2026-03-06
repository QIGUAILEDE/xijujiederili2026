import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/xijujiederili2026/', // 👉 这行极其重要！开头和结尾都必须有斜杠！
})