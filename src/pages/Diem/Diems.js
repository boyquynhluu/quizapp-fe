import React, { useState, useEffect, useRef } from 'react';
import DiemService from '../../services/DiemService';
import { useNavigate } from 'react-router-dom';
import TaskbarHeader from '../Home/TaskbarHeader';
import { decodeToken, isTokenExpired } from '../../utils/TokenUtils';
import DiemModal from './DiemModal';
import './Diem.css'

const Diems = () => {
    const navigate = useNavigate();
    const [diems, setDiems] = useState([]);
    const [username, setUsername] = useState('');
    const [isShowModal, setIsShowModal] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const decoded = decodeToken();
        if (!decoded || isTokenExpired()) {
            navigate('/login');
        } else {
            setUsername(decoded.fullName);
        }
    }, []);

    useEffect(() => {
        const fetchDiems = async () => {
            try {
                const res = await DiemService.getAllDiem();
                setDiems(res);
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log("Get All Quiz Has error: ", error);
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                } else {
                    alert("Đã xảy ra lỗi khi tải điểm.");
                }
            }
        };
        fetchDiems();
    }, [navigate]);

    const handleShowModelDetails = (userId) => {
        setIsShowModal(!isShowModal);
        setUserId(userId);
    }

    return (
        <>
            <TaskbarHeader fullName={username} />
            <div className="diem-container">
                <table className="diem-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Lần Thi</th>
                            <th>Điểm Thi</th>
                            <th>Ngày Thi</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diems.map(diem => (
                            <tr key={diem.userId}>
                                <td>{diem.userId}</td>
                                <td>{diem.username}</td>
                                <td>{diem.fullName}</td>
                                <td>{diem.lanThi}</td>
                                <td>{diem.diemThi}%</td>
                                <td>{new Date(diem.ngayThi).toISOString().split('T')[0]}</td>
                                <td>
                                    <button onClick={() => handleShowModelDetails(diem.userId)} type="button" className="btn btn-info">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isShowModal && (
                <DiemModal onClose={() => setIsShowModal(false)} userId={userId} />
            )}
        </>
    );
}

export default Diems;