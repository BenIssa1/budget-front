import axios from "axios";
import Cookies from "js-cookie";
import { decryptData } from "./crypto";

const TOKEN_NAME = process.env.NEXT_PUBLIC_NAME_TOKEN as string;

const axiosAuth = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken: string | null = null;

const getDecryptedToken = async (): Promise<string | null> => {
  const encryptedToken = Cookies.get(TOKEN_NAME);

  if (!encryptedToken) {
    return null;
  }

  // Sinon on décrypte et on retourne le token
  return await decryptData(encryptedToken);
};

axiosAuth.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      authToken = await getDecryptedToken();
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Manage token expiration
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authToken = null;

      authToken = await getDecryptedToken();

      if (authToken) {
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return axiosAuth(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;