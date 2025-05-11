<template>
    <v-container class="mt-8">
        <h1 class="text-h3 font-weight-bold mb-6">Мої Завдання</h1>
        <v-btn color="success" class="mb-4" @click="selectedTask = null; openModal()" >
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
        <TaskList v-else-if="displayedTasks && displayedTasks.length > 0" :tasks="displayedTasks" @edit-task="editTask"
            @delete-task="deleteTask">
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

        <v-dialog v-model="isConfirmModalOpen" persistent max-width="400">
            <v-card>
                <v-card-title class="text-h6">Підтвердження видалення</v-card-title>
                <v-card-text>Ви впевнені, що хочете видалити це завдання?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" text @click="cancelDelete">
                        Скасувати
                    </v-btn>
                    <v-btn color="error" text @click="confirmDelete">
                        Видалити
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
import { useAuthFetch } from '../composables/useAuthFetch';

const isModalOpen = ref(false);
const selectedTask = ref(null);

const isConfirmModalOpen = ref(false);
const taskToDeleteId = ref(null);

const displayedTasks = ref([]);

const { isFetching, error, data } = useAuthFetch('/tasks').json();

watch(data, (new_data) => {
    if (new_data) {
        const currentTasks = displayedTasks.value;
        const newTasks = new_data;
        const currentTasksMap = new Map(currentTasks.map(task => [task._id, task]));
        const updatedList = [];
        for (const newTask of newTasks) {
            const currentTask = currentTasksMap.get(newTask._id);
            if (currentTask) {
                if (currentTask !== newTask) {
                    updatedList.push(newTask);
                } else {
                    updatedList.push(currentTask);
                }
            } else {
                updatedList.push(newTask);
            }
        }
        displayedTasks.value = updatedList;
    } else {
        displayedTasks.value = [];
    }
},
    { immediate: true }
);

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
        const { error: deleteError } = await useAuthFetch(`/tasks/${taskToDeleteId.value}`).delete();

        if (!deleteError.value) {
            data.value = data.value.filter(task => task._id !== taskToDeleteId.value);
        } else {
            console.error('Помилка при видаленні завдання. Помилка:', deleteError.value);
            // TODO: Показати користувачу повідомлення про помилку видалення
        }
        isConfirmModalOpen.value = false;
        taskToDeleteId.value = null;
    }
};

const saveTask = async (taskData) => {
    const url = taskData._id ? `/tasks/${taskData._id}` : `/tasks`;
    const method = taskData._id ? 'PUT' : 'POST';
    let request;
    let savedTaskActual;
    if (method === 'PUT') {
        request = useAuthFetch(url).put(taskData).json();
    } else { // POST
        request = useAuthFetch(url).post(taskData).json();
    }
    const { error: saveError, statusCode, data: savedTaskData } = await request;
    if (!saveError.value) {
        if (method === 'POST' && savedTaskData.value) {
            data.value = [...data.value, savedTaskData.value];
            savedTaskActual = savedTaskData.value;
        } else if (method === 'PUT' && savedTaskData.value) {
            data.value = data.value.map(task =>
                task._id === savedTaskData.value._id ? savedTaskData.value : task
            );
            savedTaskActual = savedTaskData.value;
        }
        nextTick(() => {
            closeModal();
            setTimeout(() => { 
                if (savedTaskActual && savedTaskActual._id) {
                    const taskElement = document.querySelector(`[data-task-id="${savedTaskActual._id}"]`);
                  
                        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: "nearest" }); 
                        taskElement.classList.add('highlight-blink');

                    
                        const animationDuration = 1.5 * 3 * 1000; 
                        setTimeout(() => {
                            taskElement.classList.remove('highlight-blink');
                             }, animationDuration);
                }
            }, 100);
        });
    } else {
        console.error('Помилка при збереженні завдання. Статус:', statusCode.value, 'Помилка:', saveError.value);
        // TODO: У реальному додатку варто показати користувачу повідомлення про помилку
    }
};

const cancelDelete = () => {
    isConfirmModalOpen.value = false;
    taskToDeleteId.value = null;
};
</script>
