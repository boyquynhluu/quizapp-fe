import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./VerifyPage.css";

export default function VerifyPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("Đang xác minh...");

    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        if (!token) {
            setStatus("❌ Token không tồn tại!");
            return;
        }

        AuthService.verify(token)
            .then((res) => setStatus("✅ " + res.data))
            .catch((error) => {
                if (error.response && error.response.data) {
                    setStatus("❌ " + (error.response.data.message || error.response.data));
                } else {
                    setStatus("❌ Lỗi kết nối server!");
                }
            });
    }, [token]);

    return (
        <div className="verify-container d-flex justify-content-center align-items-center verify-token">
            <div className="card verify-card text-center p-4">
                <h6
                    className={`mb-3 ${status.startsWith("✅") ? "text-success" : "text-danger"
                        }`}
                >
                    {status}
                </h6>
                <p className="text-muted">
                    Bạn có thể quay lại trang đăng nhập để tiếp tục.
                </p>
                <a href="/login" className="btn btn-success mt-3 back-login">
                    🔑 Quay lại đăng nhập
                </a>
            </div>
        </div>
    );
}
