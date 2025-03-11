import React, {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch, shallowEqual} from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";

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
    MobileVocabulary,
    Mobile,
    AccountDelete,
    PrivacyPolicy,
    TermsAndConditions,
    ServiceDescription
} from "./pages/Paths";

// Custom Hooks

// Components
import {
    SideBar,
    Footer,
    NotFound,
    MobileHeader
} from "./components/ComponentsPath";

// Dialog
import {
    DialogConfirmCancel,
    DialogConfirm
} from "./components//ComponentsPath";

// CSS
import "./styles/common.css";

// Utils
import { getTodayDate } from "./utils/Utils";

const Root = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 관리 (useState)
    const [isMain, setIsMain] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isNonFooter, setIsNonFooter] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);   // 사이드바 최소 너비 상태
    const [dialogContent, setDialogContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [todayChatId, setTodayChatId] = useState("today");
    const [chatFolder, setChatFolder] = useState([]);

    // 🚀 초기 경로 설정 (sessionStorage에서 가져오기)
    const [redirectPath, setRedirectPath] = useState(sessionStorage.getItem("redirectPath"));

    // Redux 상태 가져오기
    const { userData } = useSelector((state) => state.auth);
    const { todayChatList, recentChatList, chatDetil } = useSelector((state) => state.chat);
    const constant = useSelector((state) => state.constant);
    const { modal } = useSelector((state) => state.constant, shallowEqual);

    // 오늘 날짜 불러오기
    const todayDate = getTodayDate();

    // 컴포넌트 마운트 시 실행 (componentDidMount)
    useEffect(() => {
        console.log("!--- Root ComponentDidMount ---!");

        if (redirectPath) {
            sessionStorage.removeItem("redirectPath"); // ✅ 한 번만 실행되도록 삭제
        }

        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
        const iosRegex = /iPhone|iPad|iPod/i;

        // ✅ 모바일 기기 확인 후 강제 리디렉트
        if (mobileRegex.test(userAgent)) {
            setIsMobile(true);
        }

        if (iosRegex.test(userAgent)) {
            // ios 스크롤 바운스 방지
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.inset = '0px';
        }

        let setProperty;

        function setFullHeight() {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }

        window.addEventListener('resize', setFullHeight);
        setFullHeight();

        const userAccessData = JSON.parse(localStorage.getItem("userData"));
        const accessToken = userAccessData?.accessToken;

        // chatFolder 세팅
        settingChatFolder();

        // ✅ 1. postMessage를 이용해 로그인 상태 감지
        const handleLoginMessage = (event) => {
            if (event.origin !== window.location.origin) return ;

            if (event.data.type == "LOGIN_SUCCESS") {
                console.log("✅ 로그인 성공: ", event.data.user);

                localStorage.setItem("userData", JSON.stringify(event.data.user));
                localStorage.setItem("login", String(Date.now()));

                // ✅ 중복 이동 방지를 위해 sessionStorage에 로그인 성공 플래그 추가
                sessionStorage.setItem("login_success", "true");

                // ✅ 로그인 성공 후 채팅 목록 가져오기
                dispatch(chatActions.getTodayChatList());
                dispatch(chatActions.getRecentChatList());
            }
        };

        // ✅ 2. storage 이벤트 감지를 이용해 로그인 상태 변경 감지
        const handleStorageChange = async (event) => {
            if (event.key == "login") {
                console.log("🚀 localStorage 변경 감지! 로그인 상태 업데이트");

                const loginStatus = JSON.parse(localStorage.getItem("userData"));

                if (loginStatus?.accessToken) {
                    // ✅ 다른 창에서 로그인했을 경우에도 채팅 목록 가져오기
                    dispatch(chatActions.getTodayChatList());
                    dispatch(chatActions.getRecentChatList());
                }
            }
        };

        window.addEventListener("message", handleLoginMessage);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("message", handleLoginMessage);
            window.removeEventListener("resize", setProperty);
        };
    }, []);

    // // Redux 상태나 localStorage 변경 시 로그인 상태 업데이트
    useEffect(() => {
        const userAccessData = JSON.parse(localStorage.getItem("userData"));
        const loginData = userAccessData?.accessToken && userData?.code == "SUCCESS" ? true : false;
        console.log("loginData", loginData);

    }, [ userData ]);

    // chat List API의 응답을 받은 경우
    useEffect(() => {
        console.log("todayChatList, recentChatList 변경 useEffect 실행")

        if (todayChatList?.code == "SUCCESS" && recentChatList?.code == "SUCCESS") {
            // chatFoder 생성
            const todayChat = {chatId: "today", date: getTodayDate()}
            let recentChat = [];

            // 최근 채팅 내역을 추가한다.
            if (recentChatList?.code == "SUCCESS" && recentChatList?.content?.length > 0) {
                recentChat = [...recentChatList?.content];
                // 응답 받은 최근 내역을 내림 차순으로 정렬한다.
                recentChat.sort((a, b) => new Date(a.date) - new Date(b.date));
            }

            setChatFolder([todayChat, ...recentChat]);

            const loginKey = localStorage.getItem("login");
            // 오늘 대화, 최근 대화 요청에 성공한 경우
            if (loginKey) {
                const chatId = todayChatList?.content?.chatId || "today";
                setTodayChatId(chatId);

                localStorage.removeItem("login");
            }
        }
        // 둘 다 호출에 실패한 경우
        else if (recentChatList?.code == "ERROR" || todayChatList?.code == "ERROR") {
            console.error("API 호출에 실패함");
        }
    }, [ todayChatList, recentChatList ]);

    // url 변동 감지
    useEffect(() => {
        const path = location.pathname;

        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
        const userData = JSON.parse(localStorage.getItem("userData"));
        const accessToken = userData?.accessToken;

        console.log("\n\n@@@ 현재 url: ", path);

        // 해당 경로에서는 footer 안보이도록 설정
        if (["/chat", "/login"].includes(path)) {
            setIsNonFooter(false);
        } else if (["/account-delete"].includes(path)){
            if (isMobile) setIsNonFooter(true);
            else setIsNonFooter(false);
        } else {
            setIsNonFooter(true);
        }

        // 로그인&모바일 페이지에서는 sidebar 안보이도록 설정
        if (path == "/login" || path == "/mobile") {
            setIsMain(true);
            setIsCollapsed(false);
        }
        else {
            setIsMain(false);
            setIsCollapsed(true);
        }



        // ========== AccessToken이 존재하지 않는 경우 ==========
        // 예외) "/naver-callback", "/mobile"
        if (!accessToken && !["/naver-callback"].includes(path)) {
            // 로그인 페이지에 접근 시 accessToken이 존재하지 않은 경우
            if (path == "/login") {
                // setHasLoginData(false); // hasLoginData를 false로 설정
                return ;
            }
            console.log("여기서 로그인 페이지로 이동을 하는건가?");
            // window.location.href = "/login";
            return ;
        }

        // chat page로 이동하는 메서드
        // if ((hasLoginData && path == "/login") // 로그인 데이터가 존재하는데 로그인 페이지로 이동 시
        //     || path == "/chat") {
        //     const params = new URLSearchParams(location.search);
        //
        //     if (!params.get("chatId")) {
        //         const storeChatId = localStorage.getItem("chatId") || "today";
        //         const date = params.get("date");
        //         if (storeChatId) navigate(`/chat?chatId=${storeChatId}&date=${getTodayDate()}`);
        //     }
        // }

        // ========== AccessToken이 존재하는 경우 ==========
        // 로그인 데이터가 존재하는 경우
        if (path == "/login") {
            navigate(`/chat?chatId=today`);
            return ;
        }

        if (path == "/chat") {
            const params = new URLSearchParams(location.search);
            const chatId = params.get("chatId");
            const date = params.get("date");
            console.log("~~ chatId: ", chatId, " date: ", date);

            // 오늘 날짜의 채팅방으로 이동
            if (chatId == "today" && !date) {
                navigate(`/chat?chatId=today&date=${getTodayDate()}`);
                return ;
            }

            // 3️⃣ chatFolder에서 chatId와 date가 유효한지 확인
            const isValidChat = chatFolder.some(chat => chat.chatId === chatId && chat.date === date);
            console.log("### chatFolder: ", chatFolder);

            if (!isValidChat) {
                console.log("❌ 유효하지 않은 chatId, today로 리디렉트");
                navigate(`/chat?chatId=today`);
                return ;
            }
        }

    }, [location])

    // Dialog
    useEffect(() => {
        if (constant.dialog?.isShowingDialog &&
            (constant.dialog?.dialogType.includes("CONFIRM"))) {
            setDialogContent(constant?.dialog);
        }
        else if (!constant.dialog?.isShowingDialog) {
            setDialogContent(null);
        }
    }, [constant?.dialog]);

    // modal
    useEffect(() => {
        setShowModal(modal?.isShowingModal);
    }, [modal]);

    const settingChatFolder = () => {
        if (todayChatList?.code == "SUCCESS") {
            const todayChatData = {
                chatId: "today",
                date: todayChatList?.content?.date || getTodayDate(),
            }

            let recentChat = [];
            if (recentChatList?.code == "SUCCESS") {
                recentChat = [...recentChatList?.content];
                // 응답 받은 최근 내역을 내림 차순으로 정렬한다.
                recentChat.sort((a, b) => new Date(a.date) - new Date(b.date));
            }

            setChatFolder([todayChatData, ...recentChat]);
        }
    }

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
            <div className={`container ${(!isMain && isCollapsed) ? "sidebar-collapsed" : ""}`}>
                { /* 로그인 이후에 sidebar 표시 */
                    !isMain && <SideBar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                }
                {   !isMain && isMobile &&
                    <MobileHeader toggleSidebar={toggleSidebar} />
                }

                <div className={`content ${!isMain ? "content-with-sidebar" : "content-full"} ${ !isNonFooter ? "none-footer" : ""}`}>
                    <Routes>
                        {/* 🚀 처음 진입 시, sessionStorage에 저장된 경로가 있다면 해당 경로로 리디렉트 */}
                        {redirectPath && <Route path="*" element={<Navigate to={redirectPath} replace />} />}

                        {/* 로그인 정보가 없는 경우 /login 페이지로 이동 */}
                        <Route path="/" element={ isMain && <Navigate to={"/login"} replace /> } />
                        <Route path="*" element={ <NotFound /> } />

                        {/* ✅ 로그인 페이지 (비로그인 상태에서도 접근 가능) */}
                        <Route path="/login" element={ <Login /> } />
                        { /* 네이버 로그인 콜백 수행 */
                             <Route path="/naver-callback" element={ <NaverCallback /> } />
                        }

                        {/* ✅ 일반 사용자가 접근 가능한 페이지 */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/chat" element={ <ChatMain /> } />
                            <Route path="/vocabulary" element={ isMobile ? <MobileVocabulary /> : <Vocabulary /> } />

                        </Route>
                        <Route path="/account-delete" element={ <AccountDelete /> } />

                        <Route path="/privacy-policy" element={ <PrivacyPolicy /> } />
                        <Route path="/terms-and-conditions" element={ <TermsAndConditions /> } />
                    </Routes>

                    { /* 🏆 모든 페이지에서 Footer 표시 (로그인 페이지에선 출력 X)*/
                        (!isMain && isNonFooter)
                        && <Footer />
                    }
                </div>

                { (dialogContent?.isShowingDialog && dialogContent.dialogType == "CONFIRM_CANCEL") &&
                    <DialogConfirmCancel
                        title={dialogContent.dialogTitle}
                        content={dialogContent.dialogContent}
                        onClickPositiveBtn={dialogContent.positiveFunction}
                        onClickNegativeBtn={hideDialog}
                        positiveBtnContent={"예"}
                        negativeBtnContent={"아니오"}
                    />
                }

                { (dialogContent?.isShowingDialog && dialogContent.dialogType == "CONFIRM") &&
                    <DialogConfirm
                        title={dialogContent.dialogTitle}
                        content={dialogContent.dialogContent}
                        onClickPositiveBtn={dialogContent.positiveFunction}
                        positiveBtnContent={dialogContent.positiveButtonText}
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