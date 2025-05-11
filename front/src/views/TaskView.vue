<template>

    <v-container class="mt-8">
        <h1 class="text-h3 font-weight-bold mb-6">Мої Завдання</h1>
        <v-btn color="success" class="mb-4" @click="openModal">
            <v-icon left>mdi-plus-circle</v-icon>
            Створити Завдання
        </v-btn>
        <div v-if="isFetching" class="d-flex justify-center align-center" style="height: 200px;">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <span class="ml-4 text-grey">Завантаження...</span>
        </div>
        <v-alert v-else-if="error" type="error" class="mb-4" density="compact" variant="tonal">
            Помилка: {{ error }}
        </v-alert>
        <TaskList v-else-if="data && data.length > 0" :tasks="data" @edit-task="editTask" @delete-task="deleteTask">
        </TaskList>
        <div v-else class="p-4 text-center text-grey">Немає завдань</div>
        <v-dialog v-model="isModalOpen" persistent max-width="600">
            <v-card>
                <v-card-title class="text-h6 bg-primary text-white">
                    {{ selectedTask ? 'Редагувати Завдання' : 'Створити Завдання' }}
                </v-card-title>
                <v-card-text class="py-4">
                    <TaskForm :task="selectedTask" @save-task="saveTask" @cancel-task="closeModal" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>

import { ref } from 'vue';

import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
// import { useFetch } from '@vueuse/core';
import { useAuthFetch } from '../composables/useAuthFetch';

const isModalOpen = ref(false);
const selectedTask = ref(null);

const API_URL = import.meta.env.VITE_APP_API_URL;

const { isFetching, error, data, execute: fetchTasks } = useAuthFetch(`${API_URL}/tasks`, { immediate: true }).json();

const openModal = () => {
    isModalOpen.value = true;
    // selectedTask.value = null;
};

// Функція для закриття модального вікна
const closeModal = () => {
    isModalOpen.value = false;
    selectedTask.value = null;
};

const editTask = (taskId) => {
    const taskToEdit = data.value?.find(task => task.id === taskId); 
    if (taskToEdit) {
        selectedTask.value = { ...taskToEdit }; 
        openModal(); 
    }
};

const deleteTask = async (taskId) => {
    if (confirm('Ви впевнені, що хочете видалити це завдання?')) {
        const { error: deleteError, execute: deleteRequest } = useAuthFetch(`${API_URL}/tasks/${taskId}`).delete(); 


        await deleteRequest();
        if (!deleteError.value) {
            fetchTasks();
        } else {
            console.error('Помилка при видаленні завдання:', deleteError.value);
            // TODO: У реальному додатку варто показати користувачу повідомлення про помилку (наприклад, за допомогою v-snackbar)
        }
    }
};

const saveTask = async (taskData) => {
    const url = taskData.id ? `${API_URL}/tasks/${taskData.id}` : `${API_URL}/tasks/`;

    let request;

    if (taskData.id) {
      
       request = useAuthFetch(url).put(JSON.stringify(taskData), 'application/json');
    } else {
      
       request = useAuthFetch(url).post(JSON.stringify(taskData), 'application/json');
    }

    const { error: saveError, execute: saveRequest } = request; 

    await saveRequest();

    if (!saveError.value) {

        fetchTasks();

        closeModal();
    } else {

        console.error('Помилка при збереженні завдання:', saveError.value);
        // TODO: У реальному додатку варто показати користувачу повідомлення про помилку
    }
};
</script>
