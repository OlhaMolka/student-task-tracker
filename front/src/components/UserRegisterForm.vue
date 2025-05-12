<template>
    <v-form ref="registrationForm" @submit.prevent="emit('register')">
        <v-container class="pa-0">
            <v-text-field
                v-model="new_user.firstName"
                label="Ім'я"
                placeholder="Ваше ім'я"
                density="compact"
                variant="outlined"
                required
                class="mb-4"
                :rules="[v => !!v || 'Ім\'я є обов\'язковим']"
             ></v-text-field>

            <v-text-field
                v-model="new_user.lastName"
                label="Прізвище"
                placeholder="Ваше прізвище"
                density="compact"
                variant="outlined"
                required
                class="mb-4"
                :rules="[v => !!v || 'Прізвище є обов\'язковим']"
            ></v-text-field>

            <v-text-field
                v-model="new_user.email"
                label="Email (буде вашим логіном)"
                placeholder="Ваш email"
                density="compact"
                variant="outlined"
                required
                class="mb-4"
                type="email"
                :rules="[
                    v => !!v || 'Email є обов\'язковим',
                    v => /.+@.+\..+/.test(v) || 'Введіть коректний Email'
                ]"
            ></v-text-field>

            <v-text-field
                v-model="new_user.password"
                label="Пароль"
                placeholder="Ваш пароль"
                density="compact"
                variant="outlined"
                required
                class="mb-6"
                type="password"
                 :rules="[
                    v => !!v || 'Пароль є обов\'язковим',
                    v => (v && v.length >= 6) || 'Пароль має бути не менше 6 символів'
                ]"
            ></v-text-field>

        </v-container>

        <div class="text-center">
            <v-btn
                color="primary"
                type="submit"
                size="large"
                elevation="2"
                :disabled="isLoading" :loading="isLoading" >
                Зареєструватися
            </v-btn>
        </div>
    </v-form>
</template>

<script setup>
import { defineModel, defineEmits, ref, defineExpose, defineProps } from 'vue'; 



const props = defineProps({
    isLoading: { 
        type: Boolean,
        default: false
    }
});

const registrationForm = ref(null);

const new_user = defineModel('new_user', {
    type: Object,
    default: () => ({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
});

const emit = defineEmits(['register']);


defineExpose({
  validate: async () => {
      const { valid } = await registrationForm.value?.validate();
      return valid;
  },
  reset: () => registrationForm.value?.reset(),
  resetValidation: () => registrationForm.value?.resetValidation(),
});

</script>

<style scoped>
/* ... */
</style>