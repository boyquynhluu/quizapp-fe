import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigate } from "./navigation";

export default function NavigationSetter() {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return null;
}
