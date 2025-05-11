import { createFetch, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const API_URL = import.meta.env.VITE_APP_API_URL;
const authToken = useStorage("authToken", null);

export const useAuthFetch = createFetch({
  baseUrl: API_URL, 
  options: {
    
    async beforeFetch({ url, options, cancel }) {
      const token = authToken.value; 

      if (token) {
        options.headers = {
          ...options.headers, 
          Authorization: `Bearer ${token}`,
        };
      }

      
      return { options };
    },
   
   
  },
  fetchOptions: {
    mode: 'cors',
  },
});