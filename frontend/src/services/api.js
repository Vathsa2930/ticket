import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use(
    (config) => {
        const authTokens = localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null;

        if (authTokens) {
            config.headers['Authorization'] = `Bearer ${authTokens.access}`;
        }

        // Do not set Content-Type for multipart/form-data
        if (config.data instanceof FormData) {
            // Let the browser set the Content-Type
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
