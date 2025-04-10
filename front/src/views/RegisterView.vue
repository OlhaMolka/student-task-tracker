<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
        <UserRegisterForm @register="execute" />
        <p class="text-center text-gray-600 text-sm">
          Вже маєте акаунт? 
          <router-link to="/login" class="text-blue-500 hover:text-blue-700">Увійти</router-link>
        </p>
        <p class="text-center text-gray-600 text-sm">
          <router-link to="/" class="text-blue-500 hover:text-blue-700">На головну</router-link>
        </p>
      </div>
      <p>{{ error }}</p>
    </div>
  </template>
  
  <script setup>
import { useFetch } from '@vueuse/core';
import UserRegisterForm from '../components/UserRegisterForm.vue';
  
  
  
const API_URL = import.meta.env.VITE_APP_API_URL;
const {execute, error} = useFetch(`${API_URL}/auth/register`, {
immediate: false
}).post().json();

//   const register = async () => {
//     try {
//       await axios.post('/api/auth/register', {
//         name: name.value,
//         email: email.value,
//         password: password.value
//       });
//       alert('Реєстрація успішна!');
//       router.push('/login');
//     } catch (error) {
//       alert('Помилка реєстрації: ' + error.response.data.msg);
//     }
//   };
  </script>