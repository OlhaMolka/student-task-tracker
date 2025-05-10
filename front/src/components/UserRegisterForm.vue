<template>
  <v-form @submit.prevent="emit('register')">
    <v-container class="pa-0">
      <v-text-field
        v-model="new_user.name"
        label="Ім'я"
        placeholder="Ваше ім'я"
        density="compact"
        variant="outlined"
        required
        class="mb-4"
      ></v-text-field>

      <v-text-field
        v-model="new_user.email"
        label="Email"
        placeholder="Ваш email"
        density="compact"
        variant="outlined"
        required
        class="mb-4"
        type="email"
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
      ></v-text-field>
    </v-container>

    <div class="text-center">
      <v-btn
        color="primary"
        type="submit"
        size="large"
        elevation="2"
      >
        Зареєструватися
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
const new_user = defineModel('new_user');
const emit = defineEmits(['register']);
</script>
