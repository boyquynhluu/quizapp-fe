import React from 'react';
import './TaskbarHeader.css';
import { FiLogOut } from "react-icons/fi";
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const TaskbarHeader = (props) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await AuthService.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            navigate("/login", { replace: true });
        }
    };

    return (
        <header className="taskbar">
            <div className="taskbar-logo">🌟 My App</div>
            <div className='floatRight'>
                <div className="taskbar-nav-div">
                    <nav className="taskbar-nav">
                        <Link to="/create">Tạo Quiz</Link>
                    </nav>
                </div>
                <div className="taskbar-nav-div">
                    <nav className="taskbar-nav">
                        <Link to="/quiz">Quiz</Link>
                    </nav>
                </div>
                <div className="taskbar-nav-div">
                    <nav className="taskbar-nav">
                        <Link to="/diem">Điểm</Link>
                    </nav>
                </div>
                <div className="taskbar-user">Xin chào, {props.fullName}
                    {token &&
                        <FiLogOut className="text-xl text-red-600 ml-5 logout" style={{ marginLeft: "20px" }}
                            onClick={(e) => handleLogout(e)}
                        />
                    }
                </div>
            </div>
        </header >
    );
};

export default TaskbarHeader;