import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xijujiederili2026/', // 这里的名字必须和您的仓库名字一模一样
})