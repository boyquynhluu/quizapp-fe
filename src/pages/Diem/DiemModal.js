import React, { useState, useEffect } from 'react';
import DiemService from '../../services/DiemService';
import { useNavigate } from 'react-router-dom';
import './DiemModal.css';

function DiemModal({ onClose, userId }) {
    const [details, setDetails] = useState([]);
    const [fullname, setFullname] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiemDetails = async () => {
            try {
                const res = await DiemService.getDiemDetails(userId);
                setDetails(res ?? []);
                setFullname(res?.[0]?.fullName ?? "");
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                } else {
                    alert("Đã xảy ra lỗi khi tải điểm.");
                }
            }
        };
        if (userId) fetchDiemDetails();
    }, [userId]);

    const totalPages = Math.ceil(details.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = details.slice(startIndex, startIndex + pageSize);

    return (
        <div className="modal-diem-overlay">
            <div className="modal-diem-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3 className="text-center">{fullname}</h3>

                <div className="diem-modal-container">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Lần Thi</th>
                                <th>Điểm Thi</th>
                                <th>Ngày Thi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((diem, index) => (
                                    <tr key={diem.id || `${diem.lanThi}-${index}`}>
                                        <td>{diem.lanThi}</td>
                                        <td>{diem.diemThi}%</td>
                                        <td>{new Date(diem.ngayThi).toISOString().split('T')[0]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-outline-secondary"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                ⬅️ Trước
                            </button>

                            <span className="fw-bold">
                                Trang {page}/{totalPages}
                            </span>

                            <button
                                className="btn btn-outline-secondary"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Tiếp ➡️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DiemModal;
