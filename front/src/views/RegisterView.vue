<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
        <UserRegisterForm @register="register"  v-model:new_user="new_user"/>
        <p class="text-center text-gray-600 text-sm">
          Вже маєте акаунт? 
          <router-link to="/login" class="text-blue-500 hover:text-blue-700">Увійти</router-link>
        </p>
        <p class="text-center text-gray-600 text-sm">
          <router-link to="/" class="text-blue-500 hover:text-blue-700">На головну</router-link>
        </p>
        <p v-if="error" class="text-center text-red-600 text-sm">
          Помилка: {{ error }}, {{ data }}.
        </p>
        
      </div>
    </div>
  </template>
  
  <script setup>
import { useFetch } from '@vueuse/core';
import UserRegisterForm from '../components/UserRegisterForm.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const new_user = ref({
  name: '',
  email: '',
  password: ''
});

const API_URL = import.meta.env.VITE_APP_API_URL;
const {execute, error, statusCode, data, onFetchError} = useFetch(`${API_URL}/auth/register`, {immediate:false, 
  updateDataOnError: true
}
).post(new_user.value).json();
  
  async function register() {
  
    await execute(); // Виклик методів у правильному порядку

    if (statusCode.value === 201) {
      router.push('/login');
    } else if (statusCode.value === 400 && data.value && data.value.error) {
      // errorMessage.value = data.value.error;
      console.log("1", data.value, error.value, statusCode.value);
    } else {
      // errorMessage.value = 'Помилка реєстрації';
      console.log("2", data.value, error.value, statusCode.value);
    }
    
}

  </script>