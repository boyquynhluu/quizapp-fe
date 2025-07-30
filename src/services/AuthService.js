import axios from "../api/AxiosInstance";
import { navigateTo } from "../utils/navigation";

const login = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(
            "/api/auth/login",
            { usernameOrEmail, password },
            { withCredentials: true }
        );

        const tokenType = (response.data.tokenType || "").trim();
        const accessToken = (response.data.accessToken || "").trim();

        // Chỉ lưu token khi có giá trị hợp lệ
        if (tokenType && accessToken) {
            localStorage.setItem("accessToken", `${tokenType} ${accessToken}`);
            return { success: true };
        }

        return { success: false };
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error(error.response.data?.error || "Unauthorized");
        }
        throw error;
    }
};

const logout = async () => {
    try {
        await axios.post("/api/auth/logout", null, {
            withCredentials: true,
        });
    } catch (error) {
        console.error("Lỗi logout:", error);
    } finally {
        localStorage.removeItem("accessToken");
        navigateTo("/login");
    }
};

const register = async (username, firstName, lastName, email, password) => {
    return await axios.post('/api/auth/register', {
        username,
        firstName,
        lastName,
        email,
        password
    });
};

const verify = async (token) => {
    try {
        return await axios.get(`/api/auth/verify?token=${token}`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error("Lỗi verify:", error);
        throw error;
    } finally {
        localStorage.removeItem("accessToken");
    }
};

const AuthService = {
    login,
    logout,
    register,
    verify
};

export default AuthService;