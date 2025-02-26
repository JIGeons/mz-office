import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

// Redux
import { persistor } from "./redux/Store";
import * as authActions from "./redux/modules/AuthSlice";
import * as chatActions from "./redux/modules/ChatSlice";
import * as constantActions from "./redux/modules/ConstantSlice";

// 페이지 import
import {
    Login,
    ChatMain,
    NaverCallback
} from "./pages/paths";

// Custom Hooks

// Components
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

// Dialog
import DialogConfirmCancel from "./components/Dialog/DialogConfirmCancel";

// CSS
import "./styles/common.css";
import AccountDelete from "./components/AccountDelete";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 관리 (useState)
    const [hasLoginData, setHasLoginData] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);   // 사이드바 최소 너비 상태
    const [isLoading, setIsLoading] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [dialogContent, setDialogContent] = useState(null);
    // 🚀 초기 경로 설정 (sessionStorage에서 가져오기)
    const [redirectPath, setRedirectPath] = useState(sessionStorage.getItem("redirectPath"));

    // Redux 상태 가져오기
    const { userData } = useSelector((state) => state.auth);
    const chatState = useSelector((state) => state.chat);
    const constant = useSelector((state) => state.constant);

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
                getChatData();
                // 로그인 성공 시 chatList API 호출 (API 연결이 아직 안 됐기 때문에 주석 처리)
                // Promise.all([
                //     dispatch(chatActions.getTodayChatList()),
                //     dispatch(chatActions.getRecentChatList())
                // ]).then(() => {
                //     // 화면 새로고침
                //     navigate("/chat?chatId=today&date=today");
                // }).catch(error => {
                //     alert("API 요청 실패! logout");
                //     localStorage.removeItem("userData");
                //     authActions.clearAuthState();
                // })
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Redux 상태나 localStorage 변경 시 로그인 상태 업데이트
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const loginData = userData?.accessToken;
        console.log("loginData", loginData);

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

    // Dialog
    useEffect(() => {
        if (constant.dialog?.isShowingDialog && constant.dialog?.dialogType == "CONFIRM") {
            setDialogContent(constant?.dialog);
        }
        else if (!constant.dialog?.isShowingDialog) {
            setDialogContent(null);
        }
    }, [constant?.dialog]);

    //  사이드바 토글 기능
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const hideDialog = () => {
        setDialogContent(null);
        dispatch(constantActions.onHideDialog());
    }

    const getChatData = async () => {
        try {
            const [todayChatListResult, recentChatListResult] = await Promise.all([
                dispatch(chatActions.getTodayChatList()),
                dispatch(chatActions.getRecentChatList())
            ]);

            console.log("📌 getTodayChatList 결과:", todayChatListResult);
            console.log("📌 getRecentChatList 결과:", recentChatListResult);

            const todayChatResult = todayChatListResult?.payload;
            const recentChatResult = recentChatListResult?.payload;

            // 두개의 응답이 모두 성공한 경우
            if (todayChatResult?.code == "SUCCESS"
                && recentChatResult?.code == "SUCCESS") {

                // 오늘 진행된 chatId가 존재하지 않는 경우
                if (!todayChatResult?.content?.chatId) {
                    navigate("/chat?chatId=today&date=today");
                }
                // 오늘 진행된 chatId가 존재하는 경우
                else {
                    navigate(`/chat?chatId=${todayChatResult?.content?.chatId}&date=today`);
                }
            } else {
                console.error("채팅 리스트를 불러오는데 실패하였습니다. 로그아웃 합니다. failed: ");
                // localStorage.removeItem("userData");

            }
            // 페이지 이동
        } catch (error) {
            console.error("채팅 리스트를 불러오는데 실패하였습니다. 로그아웃 합니다. (error: ", error);
            localStorage.removeItem("userData");
        }
    }

    // url 변동 감지
    useEffect(() => {
        // accessToken이 localStorage에 저장되면 state를 변경
        console.log("url 변경!", location);

        const loginData = localStorage.getItem("login");
        const userData = JSON.parse(localStorage.getItem("userData"));

        if ((loginData && userData?.accessToken)) {
            setHasLoginData(true);
        }

    }, [location])

    const isNonFooter = !(window.location.href.includes("/chat") || window.location.href.includes("/account-delete"));
    return (
        <div id="wrap">
            <div className={`container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
                { /* 로그인 이후에 sidebar 표시 */
                    hasLoginData && <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                }

                <div className={`content ${hasLoginData ? "content-with-sidebar" : "content-full"} ${ !isNonFooter ? "none-footer" : ""}`}>
                    <Routes>
                        {/* 🚀 처음 진입 시, sessionStorage에 저장된 경로가 있다면 해당 경로로 리디렉트 */}
                        {redirectPath && <Route path="*" element={<Navigate to={redirectPath} replace />} />}

                        {/* 로그인 정보가 없는 경우 /login 페이지로 이동 */}
                        <Route path="/" element={ !hasLoginData ?
                                <Navigate to="/login" replace /> : <Navigate to="/chat?chatId=today&date=today" replace /> }
                        />
                        { /* 로그인 상태에서 login 페이지 접근 시 /chat페이지로 리다이렉트 */ }
                        <Route path="/login" element={ <Login /> } />

                        <Route path="/chat" element={ <ChatMain /> } />

                        {/* 네이버 로그인 콜백 수행 */}
                        { !hasLoginData &&
                            <Route path="/naver-callback" element={ <NaverCallback /> } />
                        }
                        <Route path="*" element={ <NotFound />} />
                        <Route path="/account-delete" element={ <AccountDelete /> } />
                    </Routes>

                    { /* 🏆 모든 페이지에서 Footer 표시 (로그인 페이지에선 출력 X)*/
                        (hasLoginData && isNonFooter) && <Footer />
                    }
                </div>

                {
                    (dialogContent?.isShowingDialog && dialogContent.dialogType == "CONFIRM") &&
                    <DialogConfirmCancel
                        title={dialogContent.dialogTitle}
                        content={dialogContent.dialogContent}
                        onClickPositiveBtn={dialogContent.positiveFunction}
                        onClickNegativeBtn={hideDialog}
                        positiveBtnContent={"예"}
                        negativeBtnContent={"아니오"}
                    />
                }
            </div>
        </div>
    );
}

export default Root;