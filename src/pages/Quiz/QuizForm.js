import React, { useState, useEffect } from 'react';
import QuizService from '../../services/QuizService';
import TaskbarHeader from '../Home/TaskbarHeader';
import { decodeToken, isTokenExpired } from '../../utils/TokenUtils';
import { useNavigate } from 'react-router-dom';

const MAX_QUIZZES = 10;

const QuizForm = () => {
    const [quizzes, setQuizzes] = useState([
        {
            question: '',
            options: ['', '', '', ''],
            type: 'radio',
            answer: [],
            image: null, // thêm trường image
        },
    ]);
    const [error, setError] = useState('');
    const [countOptions, setCountOptions] = useState(1);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        quizzes.map(q => q.options.length);
    }, [quizzes]);

    useEffect(() => {
        const decoded = decodeToken();
        if (!decoded || isTokenExpired()) {
            navigate('/login');
        } else {
            setUsername(decoded.fullName);
        }
    }, [navigate]);

    const handleAddQuiz = () => {
        if (quizzes.length >= MAX_QUIZZES) {
            setError(`🚫 Tối đa ${MAX_QUIZZES} câu hỏi.`);
            return;
        }
        setError('');
        setQuizzes([
            ...quizzes,
            { question: '', options: ['', '', '', ''], type: 'radio', answer: [] },
        ]);
    };

    const handleRemoveQuiz = (index) => {
        const updated = [...quizzes];
        updated.splice(index, 1);
        setQuizzes(updated);
    };

    const handleQuizChange = (index, field, value) => {
        const updated = [...quizzes];
        updated[index][field] = value;
        setQuizzes(updated);
    };

    const handleOptionChange = (quizIndex, optionIndex, value) => {
        const updated = [...quizzes];
        updated[quizIndex].options[optionIndex] = value;
        setQuizzes(updated);
    };

    const handleAddOption = (quizIndex) => {
        setCountOptions(countOptions + 1);
        const updated = [...quizzes];
        updated[quizIndex].options.push('');
        setQuizzes(updated);
    };

    const handleRemoveOption = (quizIndex, optionIndex) => {
        const updated = [...quizzes];
        updated[quizIndex].options.splice(optionIndex, 1);
        setQuizzes(updated);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes.splice(index, 1); // xóa phần tử tại index
        setQuizzes(updatedQuizzes);
    };

    const handleAnswerChange = (quizIndex, optionIndex, checked) => {
        const updated = [...quizzes];
        const question = updated[quizIndex];

        if (question.type === 'radio') {
            question.answer = [optionIndex];
        } else {
            if (checked) {
                question.answer.push(optionIndex);
            } else {
                question.answer = question.answer.filter((i) => i !== optionIndex);
            }
        }

        setQuizzes(updated);
    };

    const handleImageChange = (idx, file) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[idx].image = file;
        setQuizzes(updatedQuizzes);
    };

    const handleSubmit = async () => {
        const isValid = quizzes.every(
            (q) => q.question.trim() && q.options.filter(Boolean).length >= 2 && q.answer.length > 0
        );

        if (!isValid) {
            setError('❗Vui lòng điền đầy đủ thông tin cho mỗi câu hỏi.');
            return;
        }

        const formData = new FormData();

        // Gửi JSON chứa các quiz (không có image)
        const quizData = quizzes.map((q, index) => ({
            question: q.question,
            type: q.type,
            options: q.options,
            answer: q.answer,
            imageIndex: q.image ? index : null // lưu index để match file
        }));
        formData.append("quizzes", JSON.stringify(quizData));

        // Gửi file ảnh (nếu có)
        quizzes.forEach((q, index) => {
            if (q.image instanceof File) {
                formData.append("images", q.image); // append nhiều file với cùng key "images"
            }
        });

        await QuizService.submitCreateQuiz(formData,);
        // chuyển đến trang test quiz vừa tạo
        navigate("/quiz");
        setError('');
        alert('✅ Gửi thành công!');
    };

    return (
        <>
            <TaskbarHeader fullName={username} />
            <div className="container py-5">
                <h1 className="text-center mb-4">🧠 Trình Tạo Câu Hỏi Quiz</h1>

                {error && (
                    <div className="alert alert-danger text-center">{error}</div>
                )}

                {quizzes.map((quiz, idx) => (
                    <div key={idx} className="card shadow-sm mb-4">
                        <div className="card-body position-relative">
                            <button
                                type="button"
                                className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                                onClick={() => handleRemoveQuiz(idx)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                            <div className="mb-3">
                                <label className="form-label fw-bold">📝 Câu hỏi {idx + 1}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập câu hỏi..."
                                    value={quiz.question}
                                    onChange={(e) =>
                                        handleQuizChange(idx, "question", e.target.value)
                                    }
                                />
                            </div>

                            {/* Thêm đoạn upload ảnh ngay dưới đây */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">🖼 Ảnh cho câu hỏi</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => handleImageChange(idx, e.target.files[0])}
                                />

                                {quiz.image && (
                                    <img
                                        src={URL.createObjectURL(quiz.image)}
                                        alt="Quiz"
                                        className="mt-2 img-fluid rounded"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            display: "block",
                                            marginTop: "8px"
                                        }}
                                    />
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">🎯 Loại câu hỏi</label>
                                <select
                                    className="form-select"
                                    value={quiz.type}
                                    onChange={(e) =>
                                        handleQuizChange(idx, "type", e.target.value)
                                    }
                                >
                                    <option value="radio">Chọn 1 đáp án</option>
                                    <option value="checkbox">Chọn nhiều đáp án</option>
                                </select>
                            </div>

                            <label className="form-label fw-bold mb-2">🔢 Các lựa chọn</label>

                            {quiz.options.map((option, optIdx) => (
                                <div
                                    key={optIdx}
                                    className="d-flex align-items-center gap-2 mb-2"
                                >
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type={quiz.type}
                                            name={`quiz - ${idx}`}
                                            checked={quiz.answer.includes(optIdx)}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    idx,
                                                    optIdx,
                                                    quiz.type === "radio" ? true : e.target.checked
                                                )
                                            }
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        className="form-control flex-grow-1"
                                        placeholder={`Đáp án ${optIdx + 1}`}
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(idx, optIdx, e.target.value)
                                        }
                                    />

                                    {quiz.options.length > 2 && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleRemoveOption(idx, optIdx)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div className="d-flex justify-content-center gap-3 mt-3">
                                {quiz.options.length < 4 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleAddOption(idx)}
                                    >
                                        <i className="bi bi-plus-lg"></i> Thêm đáp án
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteQuestion(idx)}
                                >
                                    <i className="bi bi-trash"></i> Xóa Câu Hỏi
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="d-flex justify-content-center gap-3 mt-4 bg-light p-3 rounded">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddQuiz}
                    >
                        ➕ Thêm câu hỏi
                    </button>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSubmit}
                    >
                        ✅ Gửi câu hỏi
                    </button>
                </div>

            </div>
        </>
    );
};

export default QuizForm;
