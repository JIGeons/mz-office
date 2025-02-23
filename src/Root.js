import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

// Redux
import { persistor } from "./redux/Store";
import * as authActions from "./redux/modules/AuthSlice";

// 페이지 import
import {
    Login,
    NaverCallback
} from "./pages/paths";

// Custom Hooks

// Components
import Sidebar from "./components/Sidebar";

// CSS
import "./styles/common.css";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 관리 (useState)
    const [hasLoginData, setHasLoginData] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);   // 사이드바 표시 여부 관리 (기본값: true)

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

    // Redux 상태나 localStorage 변경 시 로그인 상태 업데이트
    useEffect(() => {
        const loginData = localStorage.getItem("accessToken");
        if ((loginData && !hasLoginData)) {
            setHasLoginData(true);
        } else if (!loginData && hasLoginData) {
            setHasLoginData(false);
            navigate("/login");
        }
    }, [userData]);

    //  사이드바 토글 기능
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div id="wrap">
            <div className="container">
                { /* 로그인 이후에 sidebar 표시 */
                    hasLoginData && showSidebar && <Sidebar toggleSidebar={toggleSidebar} />
                }

                <div className={`content ${hasLoginData && showSidebar ? "content-with-sidebar" : ""}`}>
                    <Routes>
                        {/* 네이버 로그인 콜백 수행 */}
                        { !hasLoginData &&
                            <Route path="/naver-callback" element={ <NaverCallback /> } />
                        }
                        <Route path="/" element={
                            /* 로그인 정보가 없는 경우 /login 페이지로 이동 */
                            !hasLoginData ? <Navigate to="/login" replace />
                                : <h1>Login Success</h1> } />
                        <Route path="/login" element={ <Login /> } />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Root;