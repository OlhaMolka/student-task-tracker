<template>
    <v-container class="mt-8">
        <h1 class="text-h3 font-weight-bold mb-6">Мої Завдання</h1>
        <v-btn color="success" class="mb-4" @click="selectedTask = null; openModal()">
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
        <v-dialog
          v-model="isConfirmModalOpen" 
          persistent
          max-width="400" 
        >
          <v-card>
            <v-card-title class="text-h6">Підтвердження видалення</v-card-title> 
            <v-card-text>Ви впевнені, що хочете видалити це завдання?</v-card-text> 
            <v-card-actions>
              <v-spacer></v-spacer> 
 
              <v-btn
                color="grey-darken-1"
                text
                @click="cancelDelete"
              >
                Скасувати
              </v-btn>
             
              <v-btn
                color="error" 
                text
                @click="confirmDelete" 
              >
                Видалити
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
import { useAuthFetch } from '../composables/useAuthFetch';

const isConfirmModalOpen = ref(false);
const isModalOpen = ref(false);
const selectedTask = ref(null);

const taskToDeleteId = ref(null);

const tasksFetch = useAuthFetch('/tasks', { immediate: true }).json();
const { isFetching, error, data, execute: fetchTasks } = tasksFetch;

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedTask.value = null;
};

const editTask = (taskId) => {
    const taskToEdit = data.value?.find(task => task._id === taskId);
    if (taskToEdit) {
        selectedTask.value = { ...taskToEdit };
        openModal();
    }
};

const deleteTask = async (taskId) => {
   taskToDeleteId.value = taskId; 
    isConfirmModalOpen.value = true; 
};
const confirmDelete = async () => {
    if (taskToDeleteId.value) {
        const { error: deleteError, execute: deleteRequest } = useAuthFetch(`/tasks/${taskToDeleteId.value}`, { immediate: false }).delete();

        await deleteRequest(); 
        if (!deleteError.value) {
            fetchTasks(); 
        } else {
            console.error('Помилка при видаленні завдання:', saveError.value); // Помилка при видаленні
            // TODO: Показати користувачу повідомлення про помилку видалення
        }
        isConfirmModalOpen.value = false;
        taskToDeleteId.value = null;
    }
};

// !!! Нова функція для обробки скасування видалення !!!
const cancelDelete = () => {
    isConfirmModalOpen.value = false; // Закриваємо модальне вікно підтвердження
    taskToDeleteId.value = null; // Скидаємо ID завдання
};


const saveTask = async (taskData) => {
    const url = taskData._id ? `/tasks/${taskData._id}` : `/tasks`;
    let request;
    if (taskData._id) {
        request = useAuthFetch(url, { immediate: false }).put(taskData);
    } else {
        request = useAuthFetch(url, { immediate: false }).post(taskData);
    }
    const { error: saveError, execute: saveRequest, statusCode } = request;
    await saveRequest();
    if (statusCode.value >= 200 && statusCode.value < 300) {
        fetchTasks();
        closeModal();
    } else {
        console.error('Помилка при збереженні завдання. Статус:', statusCode.value, 'Помилка:', saveError.value);
        // TODO: У реальному додатку варто показати користувачу повідомлення про помилку
    }
};
</script>
