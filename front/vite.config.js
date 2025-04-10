import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    tailwindcss({
      config: {
        content: [
          './index.html',
          './src/**/*.{vue,js,ts,jsx,tsx}',
        ],
        theme: {
          extend: {
            colors: {
              primary: '#1DA1F2',
              secondary: '#14171A',
            },
          },
        },
      },
    })
  ],
})
