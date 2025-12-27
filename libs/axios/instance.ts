import environtment from "@/config/environtment";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const axiosInstance = axios.create({
  baseURL: environtment.API_URL,
  headers,
  timeout: 60 * 1000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
