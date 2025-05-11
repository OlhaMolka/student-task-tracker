<template>
  <v-card class="mx-auto pa-6" max-width="800" width="600" elevation="8" rounded="lg">
    <v-card-title class="text-h4 font-weight-bold text-center">
      Увійти
    </v-card-title>
    <v-card-text>
      <AuthForm @login="login" v-model:user="user" />
    </v-card-text>
    <v-card-actions class="d-flex justify-center flex-column">

      <p class="text-center text-caption mb-2">
        Не маєте акаунта?
        <router-link to="/register" class="text-primary text-decoration-none">
          Зареєструватись
        </router-link>
      </p>
      <p class="text-center text-caption">
        <router-link to="/" class="text-primary text-decoration-none">
          На головну
        </router-link>
      </p>
    </v-card-actions>
  </v-card>

  <v-dialog v-model="showModal" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        {{ modal_text.title }}
      </v-card-title>
      <v-card-text>
        {{ modal_text.message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeModal">
          Закрити
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useFetch, useStorage } from '@vueuse/core';
import AuthForm from '../components/AuthForm.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
  email: '',
  password: ''
});

const showModal = ref(false);
const modal_text = ref({
  title: '',
  message: ''
});

const authToken = useStorage('authToken', null);
const currentUser = useStorage('currentUser', null);
const API_URL = import.meta.env.VITE_APP_API_URL;
const { execute, error, statusCode, data } = useFetch(`${API_URL}/auth/login`, { immediate: false }).post(user.value).json();

async function login() {
  await execute();
  if (statusCode.value === 200) {
    console.log(statusCode.value)
    authToken.value = data.value.token;
    currentUser.value = user.value.email;
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
