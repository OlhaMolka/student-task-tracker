import { useFetch, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const authToken = useStorage("authToken", null);

export function useAuthFetch(url, options = {}) {
  return useFetch(url, {
    ...options,

    async beforeFetch({ url, options, cancel }) {
      const token = authToken.value;

      if (!token) {
        console.warn(
          `Request to ${url} cancelled: No authentication token found.`
        );
        cancel();

        useRouter().push("/login");
      } else {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { options };
    },

    async afterFetch({ data, response }) {
      if (response.status === 401 || response.status === 403) {
        console.error(
          `Authentication failed for ${response.url}. Status: ${response.status}`
        );

        const router = useRouter();
        authToken.value = null;
        router.push("/login");
      }
      return { data, response };
    },
  });
}
