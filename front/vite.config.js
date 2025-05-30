import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'


export default defineConfig({
  plugins: [vue(),
            vuetify({ autoImport: true })
  ],
  optimizeDeps: {
    exclude: ['vuetify'],
  },
  build: { 
    rollupOptions: {
      output: {
        manualChunks(id, { getModuleInfo }) {

          if (id.includes('node_modules/vuetify')) {
            return 'vuetify';
          }
         
          if (id.includes('node_modules') && !id.includes('node_modules/vue')) { 
            
            const packageNameMatch = /node_modules\/([^/]+)/.exec(id);
            if (packageNameMatch) {
              const packageName = packageNameMatch[1];
              
              if (['@mdi', 'date-fns'].includes(packageName)) { 
                 return `vendor-${packageName.replace('@', '').replace('/', '-')}`;
              }
                        }
            return 'vendor'; 
          }
        }
      }
    }
  }
})
