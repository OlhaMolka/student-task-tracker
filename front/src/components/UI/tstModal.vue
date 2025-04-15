<template>
    <Transition name="modal-fade">
      <div v-if="show" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="close"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <Transition name="modal-slide">
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" v-show="show">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      <slot name="header">
                        <p>Default header</p>
                      </slot>
                    </h3>
                    <div class="mt-2">
                      <slot name="body">
                        <p>Default body</p>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="$emit('close')"
                >
                  Закрити
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    show: Boolean
  });
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  /* Анімація згасання фону */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  /* Анімація ковзання модального вікна */
  .modal-slide-enter-active,
  .modal-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .modal-slide-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .modal-slide-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
  </style>