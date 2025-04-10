<template>
    <div class="bg-white shadow-md rounded-md overflow-hidden">
      <h2 class="text-2xl font-bold p-4 bg-gray-100">Список Завдань</h2>
      <ul v-if="tasks.length" class="divide-y divide-gray-200">
        <li v-for="task in tasks" :key="task.id" class="p-4 hover:bg-gray-50 cursor-pointer">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ task.title }}</p>
              <p class="text-gray-600">{{ task.description }}</p>
              <p class="text-sm text-gray-500">Deadline: {{ formatDate(task.deadline) }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="emit('edit-task', task.id)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">Редагувати</button>
              <button @click="emit('delete-task', task.id)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Видалити</button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="p-4 text-gray-500">Немає завдань</div>
    </div>
  </template>
  
  <script setup>
  import { format } from 'date-fns'; // Потрібно встановити: npm install date-fns
  
  const props = defineProps({
    tasks: {
      type: Array,
      required: true,
    },
  });
  const emit = defineEmits(['edit-task', 'delete-task']);
  
  function formatDate(dateString) {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return '-';
    }
  }
  </script>