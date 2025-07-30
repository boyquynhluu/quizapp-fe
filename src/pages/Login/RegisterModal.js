import React, { useState, useRef, useEffect } from "react";
import AuthService from "../../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterModal.css";

function RegisterModal({ onClose }) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await AuthService.register(username, firstName, lastName, email, password);
            alert("✅ " + res.data);
            onClose();
        } catch (err) {
            console.error("Đăng ký lỗi:", err);

            if (err.response) {
                if (err.response.status === 400) {
                    setError("⚠ " + JSON.stringify(err.response.data, null, 2));
                } else {
                    setError("❌ " + (err.response.data?.message || "Lỗi không xác định!"));
                }
            } else if (err.code === "ECONNABORTED") {
                setError("❌ Request timeout! Server không phản hồi kịp.");
            } else {
                setError("❌ Lỗi không xác định!");
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-dialog-centered">
                <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
                    <h3 className="text-center mb-3 fw-bold text-primary">Đăng ký tài khoản</h3>

                    {error && <div className="alert alert-danger p-2">{error}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                ref={inputRef}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Họ và tên đệm"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3 position-relative">
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control pe-5"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="input-group-text bg-white"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-3">
                            <button type="submit" className="btn btn-primary w-50 me-2">
                                ✅ Đăng ký
                            </button>
                            <button type="button" className="btn btn-outline-secondary w-50" onClick={onClose}>
                                ❌ Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;