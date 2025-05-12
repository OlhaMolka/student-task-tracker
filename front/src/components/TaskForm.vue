<template>
  <v-form ref="taskForm" @submit.prevent="saveTask">
    <v-container>
      <v-text-field
        v-model="taskData.title"
        label="Заголовок" 
        variant="outlined" 
        density="compact" 
        required
      ></v-text-field>
     
      <v-textarea
        v-model="taskData.description"
        label="Опис"
        variant="outlined"
        density="compact"
        rows="3"
      ></v-textarea>

      <v-text-field
        v-model="taskData.deadline"
        label="Дедлайн (ДД-ММ-РРРР)"
        variant="outlined"
        density="compact"
        placeholder="Наприклад, 31-12-2025"
        required
      ></v-text-field>

      <div class="d-flex justify-end">
        <v-btn
          color="grey-darken-1"
          text 
          @click="cancel" 
          class="mr-2">
          Скасувати
        </v-btn>
      
        <v-btn
          color="primary" 
          type="submit" >
          Зберегти
        </v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script setup>

import { ref, watch } from 'vue'; 

const props = defineProps({
  task: {
    type: Object,
    default: null, 
  },
});

const emit = defineEmits(['save-task', 'cancel-task']);

const taskData = ref({
  id: null, 
  title: '',
  description: '',
  deadline: '',
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    taskData.value = { ...newTask };
  } else {
    taskData.value = {
      id: null,
      title: '',
      description: '',
      deadline: '',
    };
  }
}, { immediate: true }); 
const taskForm = ref(null);
async function saveTask() {
  emit('save-task', taskData.value);
}
function cancel() {
  emit('cancel-task');
}
</script>
