import axios from 'axios';
import { useAuthStore } from '../stores/auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

const publicApi = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

const responseErrorHandler = (error: any) => {
    const status = error.response?.status;
    if (status === 401) {
        const authStore = useAuthStore();
        authStore.clearAuth();
    }
    return Promise.reject(error);
};


api.interceptors.response.use(r => r, responseErrorHandler);
publicApi.interceptors.response.use(r => r, responseErrorHandler);


export default {
     api,
     publicApi}