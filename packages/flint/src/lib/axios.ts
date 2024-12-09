import axios, { AxiosInstance } from "axios";

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: any) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
    });
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      },
    );
  }
}
