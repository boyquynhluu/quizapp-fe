import React, { useState, useEffect, useRef } from "react";
import QuizService from "../../services/QuizService";
import { useNavigate, useLocation } from "react-router-dom";
import { decodeToken, isTokenExpired } from "../../utils/TokenUtils";
import TaskbarHeader from "../Home/TaskbarHeader";
import QuizTimer from "./QuizTimer";
import "./Quiz.css";

function Quiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});
    const answersRef = useRef({});
    const [answerChecked, setAnswerChecked] = useState([]);
    const [percent, setPercent] = useState("");
    const [correctCount, setCorrectCount] = useState("");
    const [username, setUsername] = useState("");
    const [timer, setTimer] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Kiểm tra token
    useEffect(() => {
        const decoded = decodeToken();
        if (!decoded || isTokenExpired()) {
            navigate("/login");
        } else {
            setUsername(decoded.fullName);
        }
    }, [navigate]);

    useEffect(() => {
        console.log("answerChecked updated:", answerChecked);
    }, [answerChecked]);

    // ✅ Load danh sách quiz
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await QuizService.getAllQuiz();
                setQuizzes(res ?? []);
            } catch (error) {
                if (error.response?.status === 401) {
                    setQuizzes([]);
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                } else {
                    setQuizzes([]);
                }
            }
        };
        fetchQuiz();
    }, [location.pathname]);

    // ✅ Reset timer khi restart
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("restart")) {
            setTimer(20);
        }
    }, [location.search]);

    // ✅ Chọn đáp án radio
    const handleRadioChange = (quizId, value) => {
        setQuizzes((prev) =>
            prev.map((q) => (q.id === quizId ? { ...q, status: "" } : q))
        );
        const newAnswers = { ...answers, [quizId]: value };
        answersRef.current = newAnswers;
        setAnswers(newAnswers);
    };

    // ✅ Chọn đáp án checkbox
    const handleCheckboxChange = (quizId, value, checked) => {
        setQuizzes((prev) =>
            prev.map((q) =>
                q.id === quizId ? { ...q, status: checked ? "" : "notAsw" } : q
            )
        );

        const current = answers[quizId] || [];
        const updated = checked
            ? [...current, value]
            : current.filter((v) => v !== value);
        const newAnswers = { ...answers, [quizId]: updated };
        answersRef.current = newAnswers;
        setAnswers(newAnswers);
    };

    // ✅ Nộp bài
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (quizzes.length !== Object.keys(answers).length) {
            alert("❌ Vui lòng trả lời hết các câu hỏi!");
            const answeredIds = Object.keys(answers).map((id) => parseInt(id));
            setQuizzes((prev) =>
                prev.map((q) =>
                    answeredIds.includes(q.id) ? q : { ...q, status: "notAsw" }
                )
            );
            return;
        }

        try {
            const payload = Object.entries(answers).map(([quizId, answer]) => ({
                quizId: Number(quizId),
                answers: Array.isArray(answer) ? answer : [answer],
            }));
            const res = await QuizService.submitQuiz(payload);
            setAnswerChecked(Array.isArray(res.data.result) ? res.data.result : []);
            setCorrectCount(res.data.correctCount);
            setPercent(res.data.percent);
        } catch (error) {
            console.error("❌ Lỗi gửi bài:", error);
        }
    };

    // ✅ Nộp bài khi hết giờ
    const handleSubmitTimer = async () => {
        const unansweredIds = quizzes
            .filter((q) => !(q.id in answersRef.current))
            .map((q) => q.id);

        const updatedAnswers = { ...answersRef.current };
        unansweredIds.forEach((id) => (updatedAnswers[id] = ""));
        answersRef.current = updatedAnswers;
        setAnswers(updatedAnswers);

        try {
            const payload = Object.entries(updatedAnswers).map(([quizId, answer]) => ({
                quizId: Number(quizId),
                answers: Array.isArray(answer) ? answer : [answer],
            }));

            const res = await QuizService.submitQuiz(payload);
            setAnswerChecked(Array.isArray(res.data.answereResponses) ? res.data.answereResponses : []);
            setCorrectCount(res.data.correctCount);
            setPercent(res.data.percent);
        } catch (error) {
            console.error("❌ Lỗi gửi bài:", error);
        }
    };

    return (
        <>
            <TaskbarHeader fullName={username} />

            {/* Kết quả */}
            <div className="welcome-text-fixed flex justify-center items-center gap-6 text-lg mt-6 bg-gray-400/30 backdrop-blur-md shadow-md rounded-lg px-4 py-2 text-white">
                {percent !== "" && correctCount !== "" && !isNaN(Number(percent)) ? (
                    <div className="quiz-result text-green-600 font-medium">
                        ✅ Đúng: {correctCount} / {Object.keys(answers).length} –{" "}
                        {Number(percent)}%
                    </div>
                ) : (
                    <div className="quiz-result text-blue-600 font-medium">
                        📝 Trả Lời: {Object.keys(answers).length} / {quizzes.length} câu hỏi
                    </div>
                )}

                {timer === 0 ? (
                    <button
                        className="start-button bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow transition duration-300"
                        onClick={() => setTimer(10)}
                    >
                        Bắt Đầu
                    </button>
                ) : (
                    <div style={{ width: "30%", margin: "0 auto" }}>
                        <QuizTimer
                            totalTime={timer}
                            onQuizEnd={handleSubmitTimer}
                            onSetFlag={setIsDisabled}
                            answereChecked={answerChecked}
                        />
                    </div>
                )}
            </div>

            {/* Danh sách quiz */}
            {timer !== 0 && (
                <div className="quiz-container">
                    {quizzes.map((quiz, index) => (
                        <div
                            key={quiz.id}
                            className={`quiz-card ${quiz.status === "notAsw" ? "warning shake" : "success"}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}
                        >
                            <div style={{ flex: 1 }}>
                                {Object.keys(answerChecked).length > 0 ? (
                                    <h6 className="quiz-title font-semibold mb-2">
                                        {answerChecked.find(ans => ans.quizId === quiz.id)?.checked
                                            ? <span className="text-green-600 block">✅ Đúng</span>
                                            : <span className="text-red-600 block">❌ Sai</span>
                                        }
                                        Câu {index + 1}: {quiz.question}
                                    </h6>
                                ) : (
                                    <h6 className="quiz-title font-semibold mb-2">
                                        Câu {index + 1}: {quiz.question}
                                    </h6>
                                )}

                                <div className="quiz-options">
                                    {quiz.options.map((opt, i) => {
                                        const id = `quiz-${quiz.id}-opt-${i}`;
                                        return (
                                            <div key={id} className="quiz-option">
                                                <input
                                                    type={quiz.type}
                                                    id={id}
                                                    name={`quiz-${quiz.id}`}
                                                    value={opt}
                                                    onChange={(e) =>
                                                        quiz.type === "radio"
                                                            ? handleRadioChange(quiz.id, e.target.value)
                                                            : handleCheckboxChange(quiz.id, e.target.value, e.target.checked)
                                                    }
                                                    disabled={isDisabled}
                                                />
                                                <label className="quiz-pointer" htmlFor={id}>
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {quiz.imageName && (
                                <img
                                    src={quiz.imageName}
                                    alt="quiz"
                                    style={{
                                        width: 150,
                                        height: 150,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    {/* <button
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length === 0}
                    >
                        📝 Nộp bài
                    </button> */}
                </div>
            )}
        </>
    );
}

export default Quiz;
