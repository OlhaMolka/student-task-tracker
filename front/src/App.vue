<template>
  <div id="app">
    <header class="bg-gray-800 text-white py-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">Task Manager</router-link>
        <nav class="space-x-4">
          <router-link to="/" class="hover:text-gray-300">Головна</router-link>
          <router-link to="/tasks" class="hover:text-gray-300">Завдання</router-link>
          <router-link to="/login" class="hover:text-gray-300">Увійти</router-link>
          <router-link to="/register" class="hover:text-gray-300">Зареєструватися</router-link>
          <router-link v-if="isAdmin" to="/users" class="hover:text-gray-300">Користувачі</router-link>
        </nav>
      </div>
    </header>

    <main class="container mx-auto py-8">
      <router-view /> </main>

    <footer class="bg-gray-800 text-white py-4 mt-8">
      <div class="container mx-auto text-center">
        &copy; 2025 Task Manager
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Приклад отримання інформації про користувача (адаптуйте під свою логіку авторизації)
// Якщо ви використовуєте Vuex або Pinia для управління станом користувача:
// const store = useStore();
// const isAdmin = computed(() => store.state.user.role === 'admin');

// Якщо ви використовуєте localStorage або інший спосіб:
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin');

const route = useRoute();

// Приклад: Автоматичний перехід на головну після входу
// (Цю логіку краще робити в компоненті LoginView, але для прикладу тут)
// if (route.name === 'login' && localStorage.getItem('token')) {
//   router.push('/');
// }
</script>

<style scoped>
/* Додаткові стилі, якщо потрібно */
</style>