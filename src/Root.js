import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

// Redux
import { persistor } from "./redux/Store";
import * as authActions from "./redux/modules/AuthSlice";
import * as chatActions from "./redux/modules/ChatSlice";

// 페이지 import
import {
    Login,
    NaverCallback
} from "./pages/paths";

// Custom Hooks

// Components
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

// CSS
import "./styles/common.css";
import ChatMain from "./pages/ChatMain";
import {getChatList} from "./redux/modules/ChatSlice";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 상태 관리 (useState)
    const [hasLoginData, setHasLoginData] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);   // 사이드바 최소 너비 상태
    const [isLoading, setIsLoading] = useState(false);
    const [chatList, setChatList] = useState(null);
    // 🚀 초기 경로 설정 (sessionStorage에서 가져오기)
    const [redirectPath, setRedirectPath] = useState(sessionStorage.getItem("redirectPath"));

    // Redux 상태 가져오기
    const { errorCode } = useSelector((state) => state.constant);
    const { userData } = useSelector((state) => state.auth);
    const chatState = useSelector((state) => state.chat);

    // 컴포넌트 마운트 시 실행 (componentDidMount)
    useEffect(() => {
        console.log("!--- Root ComponentDidMount ---!");

        if (redirectPath) {
            sessionStorage.removeItem("redirectPath"); // ✅ 한 번만 실행되도록 삭제
        }

        const userData = JSON.parse(localStorage.getItem("userData"));
        const accessToken = userData?.accessToken;

        if (accessToken) {
            setHasLoginData(true);
        } else {
            // accessToken이 존재하지 않고 "/naver-callback" 경로가 아닌 경우 /login으로 이동
            if (!(redirectPath && redirectPath.includes("/naver-callback"))) {
                navigate("/login");
            }
        }

        const handleStorageChange = (event) => {
            if (event.key == "login") {
                console.log("🚀 localStorage 변경 감지! 페이지 새로고침...");
                // 로그인 성공 시 chatList API 호출
                dispatch(chatActions.getChatList());
                setIsLoading(true);
                // 화면 새로고침
                // window.location.reload();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Redux 상태나 localStorage 변경 시 로그인 상태 업데이트
    useEffect(() => {
        const loginData = userData?.code == "SUCCESS" ? userData.content : localStorage.getItem("accessToken");
        if ((loginData && !hasLoginData)) {
            setHasLoginData(true);
        } else if (!loginData && hasLoginData) {
            setHasLoginData(false);
            navigate("/login");
        }
    }, [userData]);

    // chat List API의 응답을 받은 경우
    useEffect(() => {
        if (chatState?.chatList?.code == "SUCCESS") {
            setIsLoading(false);
            setChatList(chatState?.chatList?.content);
        }
    }, [chatState?.chatList]);

    //  사이드바 토글 기능
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div id="wrap">
            <div className={`container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
                { /* 로그인 이후에 sidebar 표시 */
                    hasLoginData && <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} chatList={chatList} />
                }

                <div className={`content ${hasLoginData ? "content-with-sidebar" : "content-full"}`}>
                    <Routes>
                        {/* 🚀 처음 진입 시, sessionStorage에 저장된 경로가 있다면 해당 경로로 리디렉트 */}
                        {redirectPath && <Route path="*" element={<Navigate to={redirectPath} replace />} />}

                        {/* 로그인 정보가 없는 경우 /login 페이지로 이동 */}
                        <Route path="/" element={ !hasLoginData ?
                                <Navigate to="/login" replace /> : <Navigate to="/chat" replace /> }
                        />
                        { /* 로그인 상태에서 login 페이지 접근 시 /chat페이지로 리다이렉트 */ }
                        <Route path="/login" element={ <Login /> } />

                        <Route path="/chat" element={ <ChatMain /> } />

                        {/* 네이버 로그인 콜백 수행 */}
                        { !hasLoginData &&
                            <Route path="/naver-callback" element={ <NaverCallback /> } />
                        }
                        <Route path="*" element={ <NotFound />} />
                    </Routes>

                    { /* 🏆 모든 페이지에서 Footer 표시 (로그인 페이지에선 출력 X)*/
                        hasLoginData && <Footer />
                    }
                </div>
            </div>
        </div>
    );
}

export default Root;