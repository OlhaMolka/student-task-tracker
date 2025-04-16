<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center">Вхід</h2>
        <AuthForm @login="login"  v-model:user="user"/>
        <p class="text-center text-gray-600 text-sm">
          Не маєте акаунта? 
          <router-link to="/register" class="text-blue-500 hover:text-blue-700">Зареєструватись</router-link>
        </p>
        <p class="text-center text-gray-600 text-sm">
          <router-link to="/" class="text-blue-500 hover:text-blue-700">На головну</router-link>
        </p>
      </div>
    </div>
    <Teleport to="body">
    <modal :show="showModal" @close="closeModal">
      <template #header>
        <h3>{{ modal_text.title }}</h3>
      </template>
      <template #body>
        <h3>{{ modal_text.message }}</h3>
      </template>
    </modal>
  </Teleport>
  </template>
  <script setup>
import { useFetch } from '@vueuse/core';
import AuthForm from '../components/AuthForm.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import Modal from '../components/UI/ModalInfo.vue';

const router = useRouter();
const user = ref({
  email: '',
  password: ''
});
const showModal = ref(false)
const modal_text = ref({
  title: '',
  message: ''
}); 
const token = ref(null);

const API_URL = import.meta.env.VITE_APP_API_URL;
const {execute, error, statusCode, data} = useFetch(`${API_URL}/auth/login`, {immediate:false, 
  updateDataOnError: true
}
).post(user.value).json();
  
  async function login() {
  
    await execute();

    if (statusCode.value === 200) {
        token.value = data.value.token;
        console.log(token.value);
        router.push('/');
    } else if (data.value && data.value.msg) {
      modal_text.value.title = 'Помилка';
      modal_text.value.message = data.value.msg;
      showModal.value = true;
    }
    
}
const closeModal = () => {
  showModal.value = false; 
  
}

  </script>
