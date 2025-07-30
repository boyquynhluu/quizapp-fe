// tokenUtils.js
import { jwtDecode } from 'jwt-decode'; // ✅ Named import đúng cách

export const decodeToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const jwt = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;
        return jwtDecode(jwt);
    } catch (e) {
        console.error("Lỗi khi decode token:", e);
        return null;
    }
};

export const isTokenExpired = () => {
    const decoded = decodeToken();
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
};