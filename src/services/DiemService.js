import axios from "../api/AxiosInstance";

const getAllDiem = async () => {
    try {
        const rawToken = localStorage.getItem("accessToken");
        if (!rawToken || rawToken.trim() === '') {
            alert("Token is null or empty!");
            return;
        }
        const response = await axios.get("/api/v1/diem",
            {
                withCredentials: true,
            }
        );
        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        console.log("Error in get all diem:", error?.response?.data || error.message);
        localStorage.removeItem('rawToken');
    }
};

const getDiemDetails = async (userId) => {
    try {
        const rawToken = localStorage.getItem("accessToken");
        if (!rawToken || rawToken.trim() === '') {
            alert("Token is null or empty!");
            return;
        }

        const response = await axios.get("/api/v1/diem/details",
            { params: { userId } },
            { withCredentials: true, }
        );

        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        console.log("Error in get diem details:", error?.response?.data || error.message);
        localStorage.removeItem('rawToken');
    }
};

const DiemService = {
    getAllDiem,
    getDiemDetails
};

export default DiemService;