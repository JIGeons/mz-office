import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {persistor} from "../../redux/Store";

// Actions
import * as authActions from "../../redux/modules/AuthSlice";
import * as chatActions from "../../redux/modules/ChatSlice";
import * as constantActions from "../../redux/modules/ConstantSlice";

// Image
import sidebarToggle from "../../assets/images/sidebar/ico_leftmenu.png";
import deleteIcon from "../../assets/images/sidebar/delete.png";
import mobilDeleteIcon from "../../assets/images/sidebar/mobile_delete.png";
import logoutIcon from "../../assets/images/sidebar/Logout.png";
import closedIcon from "../../assets/images/sidebar/ico_closed.png";

// CSS
import "../../styles/components/sidebar.css"

// Utils
import {getTodayDate} from "../../utils/Utils";


const Sidebar = ({ toggleSidebar, isCollapsed, isMain }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;

    // Component State
    const [chatFolder, setChatFolder] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    // component Ref
    const chatId = useRef(null);

    // Redux State
    const { chatDetail } = useSelector((state) => state.chat);
    const { todayChatList, recentChatList, deleteChatRoom } = useSelector((state) => state.chat);

    // const chatState = useSelector((state) => state.chat);

    // 오늘 날짜를 불러온다.
    const todayDate = getTodayDate();

    useEffect(() => {
        // ✅ 모바일 기기 확인 후 강제 리디렉트
        if (mobileRegex.test(userAgent)) {
            setIsMobile(true);
        }
    }, []);

    useEffect( () => {
        if (todayChatList?.code == "SUCCESS") {
            const response = todayChatList?.content;
            const foundTodayChat = chatFolder.find(chat => chat.chatId == "today");

            // 저장돼 있던 오늘의 날짜와 오늘 챗 날짜의 날짜가 다르면 하루가 넘어간 것이므로 최근 대화 내역을 다시 불러온다.
            if (!response && response?.date != foundTodayChat?.date) {
                // console.log("\n\n\n\n\n### foundeTodayChat: ", foundTodayChat);
                // console.log("response: ", response);
                dispatch(chatActions.getRecentChatList());
                return ;
            }

            const todayChat = {chatId: "today", date: getTodayDate()}
            let recentChat = [];

            // 최근 채팅 내역을 추가한다.
            if (recentChatList?.code == "SUCCESS" && recentChatList?.content?.length > 0) {
                // console.log("\n\n\n\n### recentChatList: ", recentChatList.content);
                recentChat = [...recentChatList?.content];
                // 응답 받은 최근 내역을 내림 차순으로 정렬한다.
                recentChat.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            setChatFolder([todayChat, ...recentChat]);
        }
    }, [ todayChatList, recentChatList ]);

    useEffect(() => {
        // 삭제에 성공한 경우 오늘&최근 chatList를 다시 호출한다.
        if (deleteChatRoom?.code == "SUCCESS") {
           dispatch(chatActions.getTodayChatList());
           dispatch(chatActions.getRecentChatList());
           dispatch(chatActions.clearDeleteChatRoom);

           dispatch(constantActions.onHideDialog());
        }
    }, [deleteChatRoom]);

    // 로그아웃 핸들러
    const handleNaverLogout = () => {
        try {
            // console.log("logout");
            const userData = JSON.parse(localStorage.getItem("userData"));
            const accessToken = userData?.accessToken;

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            persistor.purge();

            // 토큰 삭제 & 로그인 상태 변경
            localStorage.clear();

            // dialog 숨김
            dispatch(constantActions.onHideDialog());

            // 🚀 직접 로그인 페이지로 이동 (useNavigate 대신 사용)
            window.location.href = "/login";

            // console.log("### logout!");
        } catch (error) {

            console.error("네이버 로그아웃 실패: ", error);
        }
    };

    // 채팅방 삭제
    const handleChatRoomDelete = (chatId) => {
        // console.log("Delete chat: ", chatId);
        if (chatId !== "today") {
            dispatch(chatActions.deleteChatRoom({chatId}));
        } else {
            const storedChatData = JSON.parse(localStorage.getItem("chatData"));
            const chatId = storedChatData?.chatId || todayChatList?.content?.chatId;
            dispatch(chatActions.deleteChatRoom({ chatId }));
        }
    }

    // 채팅방 및 단어장으로 이동
    const navigateToType = (type, chatId, date) => {
        if (type == "voca") {
            navigate("/vocabulary");
        } else {
            // chatId가 존재하는 경우 히스토리가 존재하는 채팅방으로 입장
            if (chatId) {
                navigate(`/chat?chatId=${chatId}&date=${date}`);
            }
            // chatId가 존재하지 않는 경우 오늘 채팅방으로 입장.
            else {
                navigate("/chat");
            }
        }
    }

    function openPopup() {
        window.open("https://dahye-backend-developer.my.canva.site/mz-office", "popupWindow", "width=600,height=400");
    }

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* 사이드바 닫기 버튼 */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <img src={ (isMobile && !isCollapsed) ? closedIcon : sidebarToggle} alt={"sidebar-toggle.png"} />
            </button>
            { !isCollapsed &&
                <nav className="navigation-bar">
                    {/* 네비게이션 내용 */}
                    <ul className="chat-ul">
                        <h1
                            style={{cursor: "pointer"}}
                            onClick={() => navigateToType("chat", "today")}
                        >
                            MZ오피스 챗봇
                        </h1>
                        <h2>최근일자 채팅 내역</h2>
                        {
                            chatFolder
                              .filter(chatFolderDate => chatFolderDate?.date !== todayDate) // 오늘 날짜 제외
                              .map((chatFolderDate, index) => {
                                return (
                                    <li key={index}>
                                        <h3 style={{cursor: "pointer"}}
                                            onClick={() => navigateToType("chat", chatFolderDate.chatId, chatFolderDate.date)}
                                        >
                                            {chatFolderDate.date}
                                        </h3>
                                        <img
                                            src={isMobile ? mobilDeleteIcon : deleteIcon}
                                            alt={"delete-icon.png"}
                                            onClick={() => dispatch(constantActions.onShowDialog({
                                                dialogType: "CONFIRM_CANCEL",
                                                dialogTitle: "채팅 삭제",
                                                dialogContent: `'${chatFolderDate.date}'의 채팅을 정말 삭제 하시겠습니까?\n(삭제 후, 채팅 내역은 복구가 불가합니다.)`,
                                                positiveFunction: () => handleChatRoomDelete(chatFolderDate.chatId) }
                                            ))}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <ul>
                        <h1
                            style={{cursor: "pointer"}}
                            onClick={() => { navigateToType("voca") }}
                        >
                            MZ오피스 단어장
                        </h1>

                    </ul>

                    <ul>
                        <h1
                            style={{cursor: "pointer"}}
                            onClick={() => {
                                // dispatch(constantActions.onShowModal())
                                openPopup()
                            }}
                        >
                            서비스 소개서
                        </h1>
                    </ul>

                    {/* 로그아웃 & 회원탈퇴 버튼 */}
                    <div className="naver-logout">
                        <div className="naver-logout-button"
                             onClick={() => dispatch(constantActions.onShowDialog({ dialogType: "CONFIRM_CANCEL", dialogTitle: "로그아웃", dialogContent: "로그아웃을 하시겠습니까?", positiveFunction: handleNaverLogout }))}
                        >
                            <img src={logoutIcon} alt={"logout-icon.png"} />
                            <span>로그아웃</span>
                        </div>
                        <div className="naver-account-delete" onClick={() => navigate("/account-delete")}>
                            <span>회원탈퇴</span>
                        </div>
                    </div>
                </nav>

            }
        </div>
    );
}

export default Sidebar;