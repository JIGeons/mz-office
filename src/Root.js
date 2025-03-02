import React, {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch, shallowEqual} from "react-redux";
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
    NaverCallback,
    Vocabulary,
    Mobile,
    PrivacyPolicy,
    TermsAndConditions,
    ServiceDescription
} from "./pages/paths";

// Custom Hooks

// Components
import Sidebar from "./components/Common/Sidebar";
import Footer from "./components/Common/Footer";
import NotFound from "./components/Common/NotFound";

// Dialog
import DialogConfirmCancel from "./components/Dialog/DialogConfirmCancel";

// CSS
import "./styles/common.css";
import AccountDelete from "./pages/AccountDelete";

// Utils
import { getTodayDate } from "./utils/Utils";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 관리 (useState)
    const [isMain, setIsMain] = useState(true);
    const [isNonFooter, setIsNonFooter] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);   // 사이드바 최소 너비 상태
    const [dialogContent, setDialogContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // const [hasLoginData, setHasLoginData] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const [todayChatId, setTodayChatId] = useState("today");

    // 🚀 초기 경로 설정 (sessionStorage에서 가져오기)
    const [redirectPath, setRedirectPath] = useState(sessionStorage.getItem("redirectPath"));

    // Redux 상태 가져오기
    const { chatDetil } = useSelector((state) => state.chat);
    const constant = useSelector((state) => state.constant);
    const { modal } = useSelector((state) => state.constant, shallowEqual);
    // const { userData } = useSelector((state) => state.auth);
    // const chatState = useSelector((state) => state.chat);
    // const { todayChatList, recentChatList } = useSelector((state) => state.chat);

    // 오늘 날짜 불러오기
    const todayDate = getTodayDate();

    // 컴포넌트 마운트 시 실행 (componentDidMount)
    // useEffect(() => {
    //     console.log("!--- Root ComponentDidMount ---!");
    //
    //     if (redirectPath) {
    //         sessionStorage.removeItem("redirectPath"); // ✅ 한 번만 실행되도록 삭제
    //     }
    //
    //     const userAccessData = JSON.parse(localStorage.getItem("userData"));
    //     const accessToken = userAccessData?.accessToken;
    //
    //     if (accessToken) {
    //         setHasLoginData(true);
    //     } else {
    //         // accessToken이 존재하지 않고 "/naver-callback" 경로가 아닌 경우 /login으로 이동
    //         if (!(redirectPath && redirectPath.includes("/naver-callback"))) {
    //             navigate("/login");
    //         }
    //     }
    //
    //     const handleStorageChange = async (event) => {
    //         if (event.key == "login") {
    //             console.log("🚀 localStorage 변경 감지! 페이지 새로고침...");
    //             dispatch(chatActions.getTodayChatList());
    //             dispatch(chatActions.getRecentChatList());
    //         }
    //     };
    //
    //     window.addEventListener("storage", handleStorageChange);
    //
    //     return () => {
    //         window.removeEventListener("storage", handleStorageChange);
    //     };
    // }, []);

    // // Redux 상태나 localStorage 변경 시 로그인 상태 업데이트
    // useEffect(() => {
    //     const userAccessData = JSON.parse(localStorage.getItem("userData"));
    //     const loginData = userAccessData?.accessToken && userData?.code == "SUCCESS" ? true : false;
    //     console.log("loginData", loginData);
    //
    //     if ((loginData && !hasLoginData)) {
    //         setHasLoginData(true);
    //     } else if (!loginData && hasLoginData) {
    //         setHasLoginData(false);
    //         navigate("/login");
    //     }
    // }, [ userData ]);

    // chat List API의 응답을 받은 경우
    // useEffect(() => {
    //     console.log("todayChatList, recentChatList 변경 useEffect 실행")
    //     if (todayChatList?.code == "SUCCESS") {
    //         setTodayChatId(todayChatList?.content?.chatId || "today");
    //     }
    //
    //     // 둘 다 호출에 성공한 경우 -> 로그인 시 chatList API 호출 후 /chat 페이지로 이동하는 로직
    //     if (todayChatList?.code == "SUCCESS" && recentChatList?.code == "SUCCESS") {
    //         console.log("recentChatList 업데이트 실행")
    //         const loginKey = localStorage.getItem("login") || null;
    //
    //         console.log("loginKey", loginKey);
    //
    //         // 로그인 키가 존재하면 로그인 후 요청 한 API 이므로 login을 localStorage에서 제거한 후 chat 페이지로 navigate
    //         if (loginKey) {
    //             localStorage.removeItem("login");
    //             setHasLoginData(true);
    //             navigate("/chat?chatId=" + todayChatId + "&date=" + todayDate);
    //         }
    //     }
    //     // 둘 다 호출에 실패한 경우
    //     else {
    //         console.error("API 호출에 실패함")
    //     }
    // }, [ todayChatList, recentChatList, navigate, todayChatId, todayDate ]);

    // url 변동 감지
    // useEffect(() => {
    //     // accessToken이 localStorage에 저장되면 state를 변경
    //     console.log("url 변경!", location);
    //
    //     const loginData = localStorage.getItem("login");
    //     const userData = JSON.parse(localStorage.getItem("userData"));
    //
    //     if ((loginData && userData?.accessToken)) {
    //         setHasLoginData(true);
    //     }
    //
    // }, [location])

    // url 변동 감지
    useEffect(() => {
        // accessToken이 localStorage에 저장되면 state를 변경
        console.log("url 변경!", location);

        if (location.pathname == "/login") {
            setIsMain(true);
            setIsCollapsed(false);
        }
        else {
            setIsMain(false);
        }


        // 쿼리에 chatId가 없는데 로컬 스토리지에 chatId가 있는 경우 본래 사용하던 chat page로 이동
        if (location.pathname == "/chat") {
            const params = new URLSearchParams(location.search);

            if (!params.get("chatId")) {
                const storeChatId = localStorage.getItem("chatId");
                if (storeChatId) navigate(`/chat?chatId=${storeChatId}`);
            }
        }

        // /chat, /account-delete 경로에서는 footer를 보여주지 않는다.
        if (location.pathname == "/chat"
            || location.pathname == "/login"
            || location.pathname == "/account-delete") {
            setIsNonFooter(false);
        } else {
            setIsNonFooter(true);
        }

    }, [location])

    // Dialog
    useEffect(() => {
        if (constant.dialog?.isShowingDialog && constant.dialog?.dialogType == "CONFIRM") {
            setDialogContent(constant?.dialog);
        }
        else if (!constant.dialog?.isShowingDialog) {
            setDialogContent(null);
        }
    }, [constant?.dialog]);

    useEffect(() => {
        setShowModal(modal?.isShowingModal);
        console.log("여기 되는건 맞니?");
    }, [modal])

    // ✅ 모바일 기기 확인 후 강제 리디렉트
    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;

        if (mobileRegex.test(userAgent)) {
            navigate("/mobile"); // 모바일 기기면 /mobile로 이동
        }
    }, [navigate]);

    //  사이드바 토글 기능
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const hideDialog = () => {
        setDialogContent(null);
        dispatch(constantActions.onHideDialog());
    }

    return (
        <div id="wrap">
            <div className={`container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
                { /* 로그인 이후에 sidebar 표시 */
                    !isMain && <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                }

                <div className={`content ${!isMain ? "content-with-sidebar" : "content-full"} ${ !isNonFooter ? "none-footer" : ""}`}>
                    {/*<Routes>*/}
                    {/*    /!* 🚀 처음 진입 시, sessionStorage에 저장된 경로가 있다면 해당 경로로 리디렉트 *!/*/}
                    {/*    {redirectPath && <Route path="*" element={<Navigate to={redirectPath} replace />} />}*/}

                    {/*    /!* 로그인 정보가 없는 경우 /login 페이지로 이동 *!/*/}
                    {/*    <Route path="/" element={ hasLoginData ?*/}
                    {/*        <Navigate to={`/chat?chatId=${todayChatId}&date=${todayDate}`} replace /> : <Login /> }*/}
                    {/*    />*/}

                        { /* 로그인 상태에서 login 페이지 접근 시 /chat페이지로 리다이렉트 */ }
                    {/*    <Route path="/login" element={ <Login /> } />*/}

                    {/*    <Route path="/chat" element={ <ChatMain /> } />*/}
                    {/*    <Route path="/vocabulary" element={ <Vocabulary /> } />*/}
                    {/*    <Route path="/mobile" element={ <Mobile /> } />*/}

                    {/*    /!* 네이버 로그인 콜백 수행 *!/*/}
                    {/*    { !hasLoginData &&*/}
                    {/*        <Route path="/naver-callback" element={ <NaverCallback /> } />*/}
                    {/*    }*/}
                    {/*    <Route path="*" element={ <NotFound />} />*/}
                    {/*    <Route path="/account-delete" element={ <AccountDelete /> } />*/}
                    {/*    <Route path="/privacy-policy" element={ <PrivacyPolicy /> } />*/}
                    {/*    <Route path="/terms-and-conditions" element={ <TermsAndConditions /> } />*/}
                    {/*</Routes>*/}

                    { /* 🏆 모든 페이지에서 Footer 표시 (로그인 페이지에선 출력 X)*/}
                    {/*    (hasLoginData && isNonFooter) && <Footer />*/}


                    <Routes>
                        {/* 🚀 처음 진입 시, sessionStorage에 저장된 경로가 있다면 해당 경로로 리디렉트 */}
                        {redirectPath && <Route path="*" element={<Navigate to={redirectPath} replace />} />}

                        {/* 로그인 정보가 없는 경우 /login 페이지로 이동 */}
                        <Route path="/" element={ isMain && <Navigate to={"/login"} replace /> } />
                        <Route path="*" element={ <NotFound /> } />

                        <Route path="/login" element={ <Login /> } />
                        <Route path="/mobile" element={ <Mobile /> } />

                        <Route path="/chat" element={ <ChatMain /> } />
                        <Route path="/vocabulary" element={ <Vocabulary /> } />

                        <Route path="/account-delete" element={ <AccountDelete /> } />

                        <Route path="/privacy-policy" element={ <PrivacyPolicy /> } />
                        <Route path="/terms-and-conditions" element={ <TermsAndConditions /> } />
                    </Routes>

                    { /* 🏆 모든 페이지에서 Footer 표시 (로그인 페이지에선 출력 X)*/
                        (!isMain && isNonFooter) && <Footer />
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

                {   showModal &&
                    <ServiceDescription />
                }
            </div>
        </div>
    );
}

export default Root;