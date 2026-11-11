import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages(https://<user>.github.io/task-board/)のサブパスでも動くよう相対パスで出力
  base: './',
})
