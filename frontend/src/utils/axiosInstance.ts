import axios from "axios";

import { useGlobalStore } from "../store/useStore";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useGlobalStore.getState().clearUser();
    }
    return Promise.reject(error);
  }
);
