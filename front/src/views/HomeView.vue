<template>
    <div class="container mx-auto mt-8">
      <h1 class="text-3xl font-bold mb-6">Мої Завдання</h1>
  
      <button @click="openModal" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        Створити Завдання
      </button>
  
      <TaskList
        v-if="!isFetching && data"
        :tasks="data"
        @edit-task="editTask"
        @delete-task="deleteTask"
      />
      <div v-else-if="isFetching" class="p-4 text-gray-500">Завантаження...</div>
      <div v-else-if="error" class="p-4 text-red-500">Помилка: {{ error }}</div>
      <div v-else class="p-4 text-gray-500">Немає завдань</div>
  
      <Modal :show="isModalOpen" @close="closeModal">
        <TaskForm
          :task="selectedTask"
          @save-task="saveTask"
          @cancel-task="closeModal"
        />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import TaskList from '../components/TaskList.vue';
  import TaskForm from '../components/TaskForm.vue';
  import Modal from '../components/UI/Modal.vue';
  import { useFetch } from '@vueuse/core'; // Потрібно встановити: npm install @vueuse/core
  
  const isModalOpen = ref(false);
  const selectedTask = ref(null);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const {isFetching, error, data} = useFetch(`${API_URL}/tasks`, {
    method: 'GET',
    immediate: true,
  }).json();
  
  const openModal = () => {
    isModalOpen.value = true;
    selectedTask.value = null;
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
    selectedTask.value = null;
  };
  
  const editTask = (taskId) => {
    const taskToEdit = data?.find(task => task.id === taskId);
    if (taskToEdit) {
      selectedTask.value = { ...taskToEdit };
      openModal();
    }
  };
  
  const deleteTask = async (taskId) => {
    if (confirm('Ви впевнені, що хочете видалити це завдання?')) {
      const { error: deleteError, execute: deleteRequest } = useFetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      await deleteRequest();
      if (!deleteError.value) {
        tasks.execute(); // Оновлюємо список завдань після видалення
      } else {
        console.error('Помилка при видаленні завдання:', deleteError.value);
        // Обробка помилок
      }
  
    }
  };
  
  const saveTask = async (taskData) => {
    const method = taskData.id ? 'PUT' : 'POST';
    const url = taskData.id ? `${API_URL}/tasks/${taskData.id}` : `${API_URL}/tasks`;
  
    const { error: saveError, execute: saveRequest } = useFetch(url, {
      method: method,
      body: JSON.stringify(taskData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    await saveRequest();
    if (!saveError.value) {
      tasks.execute(); // Оновлюємо список завдань після збереження
      closeModal();
    } else {
      console.error('Помилка при збереженні завдання:', saveError.value);
      // Обробка помилок
    }
  };
  </script>