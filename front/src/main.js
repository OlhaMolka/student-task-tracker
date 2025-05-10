import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' 

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'earthyPalette', 
    themes: {
      light: { 
        colors: {
          primary: '#1976D2', 
          secondary: '#424242', 
        },
      },
      gentleGreenYellow: {
        dark: false,
        colors: {
           
            primary: '#A5D6A7', 
            secondary: '#FFF9C4', 
            accent: '#FFEE58', 
            error: '#F44336',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            surface: '#F1F8E9',
          },
    },
    earthyPalette: {
        dark: false, 
        colors: {
          primary: '#657C6A', 
          secondary: '#F7AD45', 
          accent: '#A2B9A7',    
          error: '#BB3E00',    
          info: '#2196F3',     
          success: '#4CAF50',  
          warning: '#FF9800',  
          surface: '#A2B9A7', 
          background: '#ECEFF1', 
        },
     },
  },
},
});

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
