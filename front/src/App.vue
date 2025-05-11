<template>
  <v-app>
    <v-app-bar dark app height="100">
      <v-container class="fill-height d-flex align-center">
        <v-icon left size="40" >mdi-clipboard-list-outline</v-icon>
        <v-app-bar-title class="text-h4 font-weight-bold text-white ml-6">
          Task Manager
        </v-app-bar-title>
        <v-spacer></v-spacer>

        <div class="d-flex align-center">
          <template v-if="!isLoggedIn"> 

            <v-btn text to="/">
              <v-icon left>mdi-home</v-icon>
              Головна
            </v-btn>
            
            <v-btn text to="/tasks">
              <v-icon left>mdi-calendar-check</v-icon>
              Завдання
            </v-btn>
            <v-btn text to="/login">
              <v-icon left>mdi-login</v-icon>
              Увійти
            </v-btn>
            <v-btn text to="/register">
              <v-icon left>mdi-account-plus</v-icon>
              Зареєструватися
            </v-btn>
          
            <!-- <v-btn text to="/users" v-if="isAdmin">
              <v-icon left>mdi-account-group</v-icon>
              Користувачі
            </v-btn> -->
          </template>
          <template v-else> 
           
            <span class="mr-4 text-white">{{ currentUser }}</span> 
            <v-btn text @click="logout">
              <v-icon left>mdi-logout</v-icon>
              Вийти
            </v-btn>
           
            <v-btn text to="/">
              <v-icon left>mdi-home</v-icon>
              Головна
            </v-btn>
            <v-btn text to="/tasks">
              <v-icon left>mdi-calendar-check</v-icon>
              Завдання
            </v-btn>
         
            <!-- <v-btn text to="/users" v-if="isAdmin">
              <v-icon left>mdi-account-group</v-icon>
              Користувачі
            </v-btn> -->
          </template>

          <v-btn @click="toggleTheme" text>
            <v-icon left>mdi-theme-light-dark</v-icon>
            Змінити тему
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <div class="d-flex justify-center align-center fill-height">
        <router-view />
      </div>
    </v-main>

    <v-footer color="primary" dark padless app>
      <v-container class="text-center white--text py-3">
        &copy; 2025 Task Manager
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify'; 
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';

const theme = useTheme();
const router = useRouter();
const authToken = useStorage('authToken', null);
const currentUser = useStorage('currentUser', 'Гість');

const isLoggedIn = computed(() => authToken.value !== null);

const logout = () => {
  authToken.value = null;
  router.push('/login');
};

function toggleTheme() {
  const themeNames = Object.keys(theme.themes.value);
  const currentThemeName = theme.global.name.value;
  const currentThemeIndex = themeNames.indexOf(currentThemeName);
  const nextThemeIndex = (currentThemeIndex + 1) % themeNames.length;
  const nextThemeName = themeNames[nextThemeIndex];
  theme.global.name.value = nextThemeName;
}

</script>
