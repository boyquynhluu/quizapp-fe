import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import AuthService from '../../services/AuthService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import RegisterModal from './RegisterModal';

function LoginPage() {
    const [usernameOrPassword, setUsernameOrPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorFlg, setErrorFlag] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        await delay(500);

        try {
            const result = await AuthService.login(usernameOrPassword, password);
            if (result.success) {
                navigate("/quiz");
            } else {
                setErrorFlag(true);
            }
        } catch (err) {
            console.error("Login error:", err);
            setErrorFlag(true);
        }

        setLoading(false);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    }

    const handleSetUserName = (e) => {
        setUsernameOrPassword(e.target.value);
        setErrorFlag(false);
    }

    const handleGoToRegister = () => {
        setShowRegisterModal(true);
    }

    return (
        <div className="page-login">
            <div className="login-form-wrapper">
                <div className="login-form">
                    <h1 className="login-form-title">
                        Đăng Nhập
                    </h1>
                    <div className="login-form-body">
                        {errorFlg &&
                            <div className="login-options">
                                <div className="checkbox">
                                    <label>
                                        <span style={{ color: 'red', 'fontStyle': 'italic', 'fontSize': '10px' }}>
                                            Tài Khoản Không Hợp Lệ!
                                        </span>
                                    </label>
                                </div>
                            </div>
                        }

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-user"></i>
                            </span>
                            <input type="text" className="form-control" placeholder="username or email" ref={inputRef}
                                value={usernameOrPassword} onChange={handleSetUserName} onKeyDown={onKeyDown}
                                required
                            />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input className="form-control" placeholder="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKeyDown}
                                required
                            />

                            <span
                                className="position-absolute end-0 translate-middle-y me-3"
                                style={{ cursor: 'pointer', zIndex: 10, top: "20px" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>

                        </div>

                        <div className="login-options">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" className="styled" defaultChecked="checked" /> Remember me
                                </label>
                            </div>
                        </div>
                        <button id="btnLogin" className="btn btn-info btn-block" disabled={(usernameOrPassword && password) ? false : true}
                            onClick={handleLogin}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>

                        <div className="text-center mt-3">
                            <span>Chưa có tài khoản? </span>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm ms-2"
                                onClick={handleGoToRegister}
                            >
                                <FaUserPlus className="me-1" /> Đăng ký ngay
                            </button>
                        </div>

                        {showRegisterModal && (
                            <RegisterModal onClose={() => setShowRegisterModal(false)} />
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoginPage;