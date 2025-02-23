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
import Footer from "./components/Footer";

// CSS
import "./styles/common.css";
import ChatMain from "./pages/ChatMain";

const Root = () => {
    const navigate = useNavigate();

    // 상태 관리 (useState)
    const [hasLoginData, setHasLoginData] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);   // 사이드바 최소 너비 상태

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
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div id="wrap">
            <div className={`container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
                { /* 로그인 이후에 sidebar 표시 */
                    hasLoginData && <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                }

                <div className={`content ${hasLoginData ? "content-with-sidebar" : ""}`}>
                    <Routes>
                        {/* 로그인 정보가 없는 경우 /login 페이지로 이동 */}
                        <Route path="/" element={ !hasLoginData ?
                                <Navigate to="/login" replace /> : <Navigate to="/chat" replace /> }
                        />
                        { /* 로그인 상태에서 login 페이지 접근 시 /chat페이지로 리다이렉트 */
                            <Route path="/login" element={ <Login /> } />
                        }

                        <Route path="/chat" element={ <ChatMain /> } />

                        {/* 네이버 로그인 콜백 수행 */}
                        { !hasLoginData &&
                            <Route path="/naver-callback" element={ <NaverCallback /> } />
                        }
                    </Routes>

                    {/* 🏆 모든 페이지에서 Footer 표시 */}
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Root;