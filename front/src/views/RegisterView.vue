<template>

    <v-card
      class="mx-auto pa-6" 
      max-width="800"
      width="600"
      elevation="8" 
      rounded="lg" 
    >
      <v-card-title class="text-h4 font-weight-bold text-center">
        Реєстрація
      </v-card-title>

      <v-card-text> 
        <UserRegisterForm @register="register" v-model:new_user="new_user"/>
      </v-card-text>

      <v-card-actions class="d-flex justify-center flex-column"> 

        <p class="text-center text-caption mb-2"> 
          Вже маєте акаунт?
          <router-link to="/login" class="text-primary text-decoration-none"> 
            Увійти
          </router-link>
        </p>
         <p class="text-center text-caption">
          <router-link to="/" class="text-primary text-decoration-none">
            На головну
          </router-link>
        </p>
      </v-card-actions>
    </v-card>



  <v-dialog
    v-model="showModal" 
    persistent 
    max-width="500" 
  >
    <v-card>
      <v-card-title class="text-h6"> 
        {{ modal_text.title }}
      </v-card-title>

      <v-card-text> 
        {{ modal_text.message }}
      </v-card-text>

      <v-card-actions> 
        <v-spacer></v-spacer> 
        <v-btn
          color="primary"
          text
          @click="closeModal" 
        >
          Закрити
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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

}
const closeModal = () => {
  showModal.value = false;
  if(statusCode.value === 201) {
    router.push('/login');
  }
}
</script>
