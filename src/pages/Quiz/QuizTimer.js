import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const QuizTimer = ({ totalTime, onQuizEnd, onSetFlag, answereChecked }) => {
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [isRunning, setIsRunning] = useState(false);
    const [answered, setAnswered] = answereChecked;
    const intervalRef = useRef(null);
    const hasEndedRef = useRef(false);
    const navigate = useNavigate();

    // Start hoặc resume timer
    const startTimer = () => {
        if (!isRunning && timeLeft > 0) {
            setIsRunning(true);
            onSetFlag(false);
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setIsRunning(false);
                        if (!hasEndedRef.current) {
                            hasEndedRef.current = true;
                            pauseTimer();
                            setTimeout(() => {
                                onSetFlag(true); // ✅ Tránh gọi trực tiếp
                                onQuizEnd();
                            }, 0);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    // Tạm dừng
    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
        }
        onSetFlag(true);
    };

    // Re-Test Quiz
    const handleReTest = (e) => {
        if (e) e.preventDefault();
        navigate(0);
        // Dừng interval nếu đang chạy
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsRunning(false);
        setTimeLeft(0); // ✅ set luôn về 0 khi submit
        hasEndedRef.current = true; // ✅ đánh dấu đã kết thúc
        onSetFlag(false); // ✅ disable input
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // cleanup
    }, []);

    const formatTime = (s) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <>
            <div style={{
                fontSize: '20px',
                color: 'blue',
                textAlign: 'center',  // ✅ thay vì float
                width: '100%',
                marginBottom: '12px'
            }}>
                🕒 Thời gian còn lại: {formatTime(timeLeft)}
            </div>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
                marginTop: "12px",
                width: '100%'
            }}>
                {!isRunning ? (
                    <button onClick={startTimer} style={{ minWidth: "100px", flex: "1 1 auto" }} className="button-timer">
                        <FaPlay /> Start
                    </button>
                ) : (
                    <button onClick={pauseTimer} style={{ minWidth: "100px", flex: "1 1 auto" }} className="button-timer">
                        <FaPause /> Pause
                    </button>
                )}
                <button onClick={handleReTest} style={{ minWidth: "100px", flex: "1 1 auto" }} className="button-timer"
                    disabled={answered ? false : true}
                >
                    <FaRedo color="red" /> Thi Lại
                </button>
            </div>
        </>
    );
};

export default QuizTimer;
