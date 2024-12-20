import { userRequests } from "@/stores/users/user.request";
import axios from "axios";
import { useBoundStore } from "@/stores/global.store.ts";

export const CapsuleAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

CapsuleAxios.interceptors.request.use((config) => {
  const token = useBoundStore.getState().access_token;
  const baseUrl = useBoundStore.getState().base_url;
  const clientId = useBoundStore.getState().client_id;
  if (baseUrl) {
    config.baseURL = baseUrl;
  }
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  if (clientId) {
    config.headers["Client-Id"] = `${clientId}`;
  }
  return config;
});

CapsuleAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = useBoundStore((state) => state.refresh_token);
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await userRequests.refreshToken(refreshToken);
        const newToken = response.access_token;
        useBoundStore((state) => state.login)(newToken, refreshToken, null);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return CapsuleAxios(originalRequest);
      } catch (refreshError) {
        useBoundStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
