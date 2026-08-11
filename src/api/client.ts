import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.a2zmochiparadise.sg";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("a2z_staff_access_token");
  // SECURITY NOTE: localStorage is used here to keep the scaffold simple.
  // Before production, prefer an httpOnly, Secure cookie set by the backend
  // on login so the access token is never reachable from JS (mitigates XSS
  // token theft) — see architecture doc section 6.1/9.2.
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("a2z_staff_access_token");
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);
