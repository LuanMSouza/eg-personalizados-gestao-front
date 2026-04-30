import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@eg-personalizados:token');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    if (error.response && error.response.status === 401) {

        localStorage.removeItem('@eg-personalizados:token');
        window.location.href = '/';
    }

    return Promise.reject(error);
});