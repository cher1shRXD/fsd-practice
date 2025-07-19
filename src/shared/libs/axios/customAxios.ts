import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosHeaders,
} from "axios";

interface AuthConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AuthConfig;

    const isUnauthorized = error.response?.status === 401;

    const refreshToken = originalRequest.headers?.refreshToken;

    if (isUnauthorized && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/reissue`,
          {
            refreshToken,
          }
        );

        const newAccessToken = refreshRes.data.accessToken;

        originalRequest.headers = AxiosHeaders.from({
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        });

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
