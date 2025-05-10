<template>
  <v-app>
    <v-app-bar dark app height="100">
      <v-container class="fill-height d-flex align-center">
      <v-icon left size="3rem" >mdi-clipboard-list-outline</v-icon>
      <v-app-bar-title class="text-h4 font-weight-bold text-white ml-6"> 
        Task Manager
      </v-app-bar-title>
      <v-spacer></v-spacer> 
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
      <v-btn text to="/users" v-if="isAdmin">
        <v-icon left>mdi-account-group</v-icon>
        Користувачі
      </v-btn>


      <v-btn @click="toggleTheme" text>
        <v-icon left>mdi-theme-light-dark</v-icon> 
        Змінити тему
      </v-btn>
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
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { computed } from 'vue';

const theme = useTheme();
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin');


function toggleTheme() {
  const themeNames = Object.keys(theme.themes.value);

  const currentThemeName = theme.global.name.value;
  const currentThemeIndex = themeNames.indexOf(currentThemeName);
  const nextThemeIndex = (currentThemeIndex + 1) % themeNames.length;
  const nextThemeName = themeNames[nextThemeIndex];
  theme.global.name.value = nextThemeName;
}
</script>


