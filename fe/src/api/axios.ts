// src/api/axios.ts
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: baseUrl, // 여기는 공통 prefix까지만
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
