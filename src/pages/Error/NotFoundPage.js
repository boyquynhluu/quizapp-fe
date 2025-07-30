import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        navigate('/login');
    }

    return (
        <div className="page-notfound">
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
                    <h1 className="text-danger fw-bold">404</h1>
                    <p className="mb-4 text-muted">Trang bạn tìm không tồn tại</p>

                    <button
                        type="button"
                        id="btnLogin"
                        className="btn btn-info btn-block"
                        onClick={(e) => handleLogin(e)}
                    >
                        🔑 Quay lại Login
                    </button>
                </div>
            </div>
        </div>
    );
}
