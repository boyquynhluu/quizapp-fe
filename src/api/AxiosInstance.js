import axios from "axios";
import { navigateTo } from "../utils/navigation";

//const BASE_URL = "http://localhost:8080/";
const BASE_URL = process.env.REACT_APP_API_URL;
const URL_REFRESH_TOKEN = "/api/auth/refresh";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

// ✅ Tạo axios riêng để gọi refresh token, không interceptor
const axiosWithoutInterceptor = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    res => res,
    async err => {
        const originalConfig = err.config;

        // Tránh gọi lại nhiều lần
        if (err.response?.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            try {
                const response = await axiosWithoutInterceptor.post(`${BASE_URL}${URL_REFRESH_TOKEN}`, {}, {
                    withCredentials: true
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // Gắn lại token mới rồi gọi lại request cũ
                originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosInstance(originalConfig);
            } catch (refreshErr) {
                localStorage.removeItem("accessToken");
                navigateTo("/login");
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;
