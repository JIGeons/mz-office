import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

// Redux
import { persistor } from "./redux/Store";
import * as authActions from "./redux/modules/AuthSlice";

// 페이지 import
import {
    Login
} from "./pages/paths";

// Custom Hooks

// CSS
// import "./styles/root.css";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 관리 (useState)
    const [hasLoginData, setHasLoginData] = useState(false);

    // Redux 상태 가져오기
    const { errorCode } = useSelector((state) => state.constant);
    const { userData } = useSelector((state) => state.auth);
    

    // 컴포넌트 마운트 시 실행 (componentDidMount)
    useEffect(() => {
        console.log("!--- Root ComponentDidMount ---!");

        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            setHasLoginData(true);
        }
    }, []);

    // Redux state 변경 시 처리 (componentDidUpdate 역할)
    useEffect(() => {
        const loginData = localStorage.getItem("accessToken");
        if ((loginData && !hasLoginData)) {
            setHasLoginData(true);
        } else if (!loginData && hasLoginData) {
            setHasLoginData(false);

            navigate("/login");
        }
    }, [userData]);

    return (
        <Routes>
            <Route path="/" element={
                /* 로그인 정보가 없는 경우 /login 페이지로 이동 */
                !hasLoginData ? <Navigate to="/login" replace />
                    : <h1>Login Success</h1> } />
            <Route path="/login" element={ <Login /> } />
        </Routes>
    );
}

export default Root;