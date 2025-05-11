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
          class="mr-2" 
        >
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
// import { useVuelidate } from '@vuelidate/core'; // Опціонально: для розширеної валідації
// import { required, maxLength } from '@vuelidate/validators'; // Опціонально: правила валідації
// import { format, parseISO } from 'date-fns'; // Може знадобитися для роботи з датами


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
    // TODO: Якщо дедлайн зберігається в іншому форматі (наприклад, ISO string),
    //  потрібно його відформатувати для відображення у полі введення.
    // if (newTask.deadline) {
    //   taskData.value.deadline = format(parseISO(newTask.deadline), 'yyyy-MM-dd'); // Приклад форматування дати
    // }
  } else {
   
    taskData.value = {
      id: null,
      title: '',
      description: '',
      deadline: '',
    };
  }
}, { immediate: true }); // immediate: true - watcher запускається одразу при монтуванні компонента

// !!! Опціонально: Налаштування Vuelidate для валідації !!!
// const rules = {
//   taskData: {
//     title: { required }, // Заголовок обов'язковий
//     deadline: { required }, // Дедлайн обов'язковий
//     // TODO: Додати правило для перевірки формату дати дедлайну
//   },
// };
// const v$ = useVuelidate(rules, { taskData }); // Створюємо екземпляр Vuelidate

// Реф для доступу до компонента v-form (потрібен для виклику його методів, наприклад, validate)
const taskForm = ref(null);

// Асинхронна функція для збереження завдання
async function saveTask() {
  // !!! Опціонально: Запускаємо валідацію форми, якщо використовуємо v-form ref та rules !!!
  // const { valid } = await taskForm.value.validate(); // Викликаємо метод validate на v-form
  // if (!valid) {
  //   return; // Якщо форма невалідна, зупиняємо виконання
  // }

  // TODO: Якщо дедлайн був введений користувачем як рядок в певному форматі,
  //  можливо, потрібно його перетворити назад до формату, який очікує API, перед випромінюванням.
  // if (taskData.value.deadline) {
  //   taskData.value.deadline = parseISO(taskData.value.deadline); // Приклад: перетворення рядка на Date об'єкт
  // }

  emit('save-task', taskData.value);
}

function cancel() {
  emit('cancel-task');
}
</script>
