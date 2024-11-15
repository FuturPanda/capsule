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
  console.log("in interceptors before request");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

CapsuleAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("in interceptors with response with an error : ", error);

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
        useBoundStore((state) => state.login)(
          newToken,
          refreshToken,
          response.user,
        );
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return CapsuleAxios(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        useBoundStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
