import userRequests from "@/stores/tinybase(backup)/users/user.request";
import axios, { AxiosInstance } from "axios";

export const CapsuleAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export const setupInterceptors = (
  instance: AxiosInstance,
  getAccessToken: () => string | null,
  setAccessToken: (token: string) => void,
  getRefreshToken: () => string | null,
  onLogout: () => void,
) => {
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    console.log("in interceptors before request");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
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
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          const response = await userRequests.refreshToken(refreshToken);
          const newToken = response.access_token;
          setAccessToken(newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          onLogout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );
};
