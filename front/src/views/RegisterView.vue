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
import UserRegisterForm from '../components/UserRegisterForm.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import Modal from '../components/UI/ModalInfo.vue';
import { Teleport } from 'vue';

const router = useRouter();
const new_user = ref({
  name: '',
  email: '',
  password: ''
});
const showModal = ref(false)
const modal_text = ref({
  title: '',
  message: ''
}); 

const API_URL = import.meta.env.VITE_APP_API_URL;
const {execute, error, statusCode, data} = useFetch(`${API_URL}/auth/register`, {immediate:false, 
  updateDataOnError: true
}
).post(new_user.value).json();
  
  async function register() {
  
    await execute();

    if (statusCode.value === 201) {
     modal_text.value.title = 'Успішно';
     modal_text.value.message = 'Реєстрація пройшла успішно';
     showModal.value = true;
    } else if (data.value && data.value.msg) {
      modal_text.value.title = 'Помилка';
      modal_text.value.message = data.value.msg;
      showModal.value = true;
    }
    
    // router.push('/login');
}
const closeModal = () => {
  showModal.value = false; 
  if(statusCode.value === 201) {
    router.push('/login');
  }
}

  </script>
