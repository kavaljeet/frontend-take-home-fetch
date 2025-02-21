import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { baseName } from './src/router'

export default defineConfig({
  plugins: [react()],
  base: `/${baseName}/`
})