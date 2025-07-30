import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const token = (localStorage.getItem("accessToken") || "").trim();

    if (!token || token === "Bearer") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
