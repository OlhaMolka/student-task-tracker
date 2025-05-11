<template>

  <v-list-item :data-task-id="task._id">

    <div class="d-flex justify-space-between align-center w-100"> 
  
      <div>

        <v-list-item-title class="text-h6">{{ task.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>

        <p class="text-caption text-grey-darken-1">Deadline: {{ formatDate(task.deadline) }}</p>
      </div>

   
      <div class="d-flex">

        <v-btn
          size="small"
          color="primary"
          class="mr-2"
          @click="emit('edit-task', task._id)"
        >
          Редагувати
        </v-btn>
        <v-btn
          size="small"
          color="error"
          @click="emit('delete-task', task._id)"
        >
          Видалити
        </v-btn>
      </div>
    </div>
  </v-list-item>
</template>

<script setup>
import { format } from 'date-fns'; // Переносимо функцію форматування сюди

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit-task', 'delete-task']);

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    // Переконайтесь, що date-fns встановлено: npm install date-fns або yarn add date-fns
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return '-';
  }
}
</script>
