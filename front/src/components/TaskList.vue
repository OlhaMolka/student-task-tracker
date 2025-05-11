<template>

  <v-card>

    <v-card-title class="text-h5 bg-surface-variant"> 
      Список Завдань
    </v-card-title>

 
    <v-list v-if="tasks && tasks.length">
    
      <template v-for="(task, index) in tasks" :key="task.id">
     
        <task-item
          :task="task"
          @edit-task="emit('edit-task', $event)" 
          @delete-task="emit('delete-task', $event)" 
        ></task-item>
       
        <v-divider v-if="index < tasks.length - 1"></v-divider>
      </template>
    </v-list>
    <v-card-text v-else class="text-center text-grey">
      Немає завдань
    </v-card-text>
  </v-card>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue';

import TaskItem from './TaskItem.vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => [] 
  },
});

const emit = defineEmits(['edit-task', 'delete-task']);

</script>
