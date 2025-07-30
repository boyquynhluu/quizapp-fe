import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './pages/Quiz/Quiz';
import LoginPage from './pages/Login/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import Diems from './pages/Diem/Diems';
import QuizForm from './pages/Quiz/QuizForm';
import NotFoundPage from './pages/Error/NotFoundPage';
import NavigationSetter from './utils/NavigationSetter';
import VerifyPage from './pages/Login/VerifyPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./scss/main.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <NavigationSetter />
      <Routes>
        {/* Nếu mở root "/", chuyển về /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <QuizForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/diem"
          element={
            <PrivateRoute>
              <Diems />
            </PrivateRoute>
          }
        />

        <Route path="/verify" element={<VerifyPage />} />

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
