import axios from "../api/AxiosInstance";
import { navigateTo } from "../utils/navigation";

const getAllQuiz = async () => {
    try {
        const rawToken = localStorage.getItem("accessToken");
        if (!rawToken || rawToken.trim() === '') {
            alert("Token is null or empty!");
            return;
        }

        const response = await axios.get("/api/v1/quiz",
            {
                headers: { Authorization: `Bearer ${rawToken}` }
            },
            {
                withCredentials: true,
            }
        );

        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("error.response: ", error.response);
            localStorage.removeItem("accessToken");
            navigateTo("/login");
        }
        throw error;
    }
};

const submitQuiz = async (payload) => {
    try {
        const rawToken = localStorage.getItem("accessToken");
        if (!rawToken || rawToken.trim() === '') {
            alert("Token is null or empty!");
            return;
        }
        const response = await axios.post("/api/v1/quiz", payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${rawToken}`
            },
            withCredentials: true
        });
        return response; // 🔥 QUAN TRỌNG: trả về response cho caller
    } catch (error) {
        console.error("Error:", error);
        throw error; // nếu muốn bắt lỗi ở caller
    }
}

const submitCreateQuiz = async (formData) => {
    try {
        const rawToken = localStorage.getItem("accessToken");
        if (!rawToken || rawToken.trim() === '') {
            alert("Token is null or empty!");
            return;
        }

        const response = await axios.post("/api/v1/quiz/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
            timeout: 10000, // tăng timeout lên 10s
        });
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error; // nếu muốn bắt lỗi ở caller
    }
}

const QuizService = {
    getAllQuiz,
    submitQuiz,
    submitCreateQuiz
}

export default QuizService;