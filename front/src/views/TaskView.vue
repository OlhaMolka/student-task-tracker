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

        <v-card v-else>
            <v-card-title class="text-h5 bg-surface-variant">
                Список Завдань
            </v-card-title>
            <v-list v-if="displayedTasks && displayedTasks.length">
                <template v-for="task in displayedTasks" :key="task._id">
                    <task-item :task="task" @edit-task="editTask" @delete-task="deleteTask"></task-item>
                    <v-divider></v-divider>
                </template>
            </v-list>
            <v-card-text v-else class="text-center text-grey">
                Немає завдань
            </v-card-text>
        </v-card>

        <v-dialog v-model="isModalOpen" persistent max-width="600">
            <v-card>
                <v-card-title class="text-h6 bg-primary text-white">
                    {{ selectedTask ? 'Редагувати Завдання' : 'Створити Завдання' }}
                </v-card-title>
                <v-card-text class="py-4">
                    <TaskForm :task="selectedTask" @save-task="handleTaskFormSave" @cancel-task="closeModal" />
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
import TaskForm from '../components/TaskForm.vue';
import TaskItem from '../components/TaskItem.vue'; 
import { useAuthFetch } from '../composables/useAuthFetch';

const isModalOpen = ref(false);
const selectedTask = ref(null);

const isConfirmModalOpen = ref(false);
const taskToDeleteId = ref(null);

const displayedTasks = ref([]); 

const { isFetching, error, data } = useAuthFetch('/tasks').json();

watch(data, (newData) => {
    displayedTasks.value = newData ? [...newData] : [];
},
    { immediate: true }
);

const scrollToAndHighlightTask = (taskId) => {
    if (!taskId) return;

    nextTick(() => {
        setTimeout(() => {
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: "nearest" });
                taskElement.classList.add('highlight-blink');
                const animationDuration = 1.5 * 3 * 1000; 
                setTimeout(() => {
                    taskElement.classList.remove('highlight-blink');
                }, animationDuration);
            }
        }, 100); 
    });
};

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedTask.value = null;
};

const createTask = async (taskData) => {
    const { error: createError, statusCode, data: newTaskData } = await useAuthFetch('/tasks').post(taskData).json();

    if (!createError.value && newTaskData.value) {
        data.value = [...data.value, newTaskData.value];
        closeModal(); 
        scrollToAndHighlightTask(newTaskData.value._id); 
    } else {
        console.error('Помилка при створенні завдання. Статус:', statusCode.value, 'Помилка:', createError.value);
        // TODO: Show user error message
    }
};

const updateTask = async (taskData) => {
    if (!taskData._id) {
        console.error('Помилка: спроба оновити завдання без ID.');
        return;
    }
    const { error: updateError, statusCode, data: updatedTaskData } = await useAuthFetch(`/tasks/${taskData._id}`).put(taskData).json();

    if (!updateError.value && updatedTaskData.value) {
        data.value = data.value.map(task =>
            task._id === updatedTaskData.value._id ? updatedTaskData.value : task
        );
        closeModal(); 
        scrollToAndHighlightTask(updatedTaskData.value._id); // Scroll and highlight
    } else {
        console.error('Помилка при оновленні завдання. Статус:', statusCode.value, 'Помилка:', updateError.value);
        // TODO: Show user error message
    }
};

const deleteTaskConfirmed = async () => {
    if (!taskToDeleteId.value) {
        console.error('Помилка: ID завдання для видалення не встановлено.');
        return;
    }
    const { error: deleteError, statusCode } = await useAuthFetch(`/tasks/${taskToDeleteId.value}`).delete();

    if (!deleteError.value) {
        data.value = data.value.filter(task => task._id !== taskToDeleteId.value);
    } else {
        console.error('Помилка при видаленні завдання. Статус:', statusCode.value, 'Помилка:', deleteError.value);
        // TODO: Show user error message
    }
    isConfirmModalOpen.value = false;
    taskToDeleteId.value = null;
};

const editTask = (taskId) => {
    const taskToEdit = data.value?.find(task => task._id === taskId);
    if (taskToEdit) {
        selectedTask.value = { ...taskToEdit }; 
        openModal();
    }
};

const deleteTask = (taskId) => {
    taskToDeleteId.value = taskId;
    isConfirmModalOpen.value = true;
};

const confirmDelete = () => {
    deleteTaskConfirmed();
};

const cancelDelete = () => {
    isConfirmModalOpen.value = false;
    taskToDeleteId.value = null;
};

const handleTaskFormSave = async (taskData) => {
    if (taskData._id) {
        await updateTask(taskData);
    } else {
        await createTask(taskData);
    }
 
};

</script>

