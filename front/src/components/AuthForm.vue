<template>
  <v-form @submit.prevent="emit('login')">
    <v-container class="pa-0">
      <v-text-field
        v-model="user.email"
        label="Email"
        placeholder="Ваш email"
        density="compact"
        variant="outlined"
        required
        class="mb-4"
        type="email"
      ></v-text-field>

      <v-text-field
        v-model="user.password"
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
        size="default"
        elevation="2"
      >
        Увійти
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
const user = defineModel('user');
const emit = defineEmits(['login']);
</script>

