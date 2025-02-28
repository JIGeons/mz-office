import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import * as authActions from "../../redux/modules/AuthSlice";
import * as chatActions from "../../redux/modules/ChatSlice";
import * as constantActions from "../../redux/modules/ConstantSlice";

// Image
import sidebarToggle from "../../assets/images/sidebar/ico_leftmenu.png"
import deleteIcon from "../../assets/images/sidebar/delete.png"
import logoutIcon from "../../assets/images/sidebar/Logout.png"

// CSS
import "../../styles/components/sidebar.css"

// Utils
import {getTodayDate} from "../../utils/Utils";


const Sidebar = ({ toggleSidebar, isCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Component State
    const [chatFolder, setChatFolder] = useState([]);

    // Redux State
    const chatState = useSelector((state) => state.chat);
    const { todayChatList, recentChatList } = useSelector((state) => state.chat);

    // 오늘 날짜를 불러온다.
    const todayDate = getTodayDate();

    // componentDidMount
    useEffect( () => {
        let chatList = [];

        const todayChat = todayChatList?.code == "SUCCESS" && (todayChatList?.content?.length > 0) ? todayChatList?.content : null;

        // 오늘 채팅한 내역이 존재하지 않는 경우 오늘의 chatList를 생성한다.
        if (!todayChat) {
            console.log("채팅 내역이 존재하지 않음!");
            // 현재 날짜를 받아온다.
            const today = getTodayDate();
            const todayObj = {
                chatId: todayChatList?.content?.chatId || "today",
                date: today
            };

            chatList = [todayObj];
        } else {
            const todayChat = todayChatList?.content;
            chatList = [{
                chatId: todayChat.chatId,
                date: todayChat.date
            }];
        }

        // 최근 채팅 리스트가 존재하는 경우
        if (recentChatList?.code == "SUCCESS" && recentChatList?.content?.length > 0) {
            console.log("최근 챗 리스트 삽입!!");
            // chatList에 최근 채팅 리스트를 삽입한다.
            chatList = [...chatList, ...recentChatList?.content.slice().reverse()];
        } else {
            console.log("최근 챗 리스트가 존재하지 않음");
        }

        setChatFolder(chatList);
    }, [ todayChatList, recentChatList ]);

    // // 오늘 날짜의 채팅이 생기면 chatId를 변경하기 위함
    // useEffect(() => {
    //     const todayChatList = chatState.todayChatList?.content;
    //     const newChatFolder = chatFolder;
    //
    //     // ChatState의 todayChatList가 변경이 된 경우. 오늘의 chatFolder의 chatId를 설정한다.
    //     if (chatState.todayChatList?.code == "SUCCESS" && chatState.todayChatList?.content?.chatId) {
    //         newChatFolder[0].chatId = todayChatList?.chatId;
    //         setChatFolder(newChatFolder);
    //     }
    //
    // }, [ todayChatList. recentChatList ]);

    const handleNaverLogout = () => {
        try {
            console.log("logout");
            const userData = JSON.parse(localStorage.getItem("userData"));
            const accessToken = userData?.accessToken;

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            dispatch(authActions.clearAuthState());
            dispatch(chatActions.clearChatState());

            // 토큰 삭제 & 로그인 상태 변경
            localStorage.removeItem("userData");
            console.log("logout!");

            dispatch(constantActions.onHideDialog());
            // navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error("네이버 로그아웃 실패: ", error);
        }
    };

    const handleChatRoomDelete = (chatId) => {
        console.log("Delete chat: ", chatId);
        if (chatId !== "today") {
            dispatch(chatActions.deleteChatRoom({chatId}));
        }
    }

    const navigateToChat = (chatId, date) => {
        console.log("chatId: ", chatId, " date: ", date);

        // 채팅 페이지로 이동
        navigate(`/chat?chatId=${chatId}&date=${date}`);
    }

    console.log("chatFolder", chatFolder);

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* 사이드바 닫기 버튼 */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <img src={sidebarToggle} alt={"sidebar-toggle.png"} />
            </button>
            { !isCollapsed &&
                <nav className="navigation-bar">
                    {/* 네비게이션 내용 */}
                    <ul>
                        <h1>MZ오피스 챗봇</h1>
                        <h2>최근일자 채팅 내역</h2>
                        {
                            chatFolder.map((chatFolderDate, index) => {
                                return (
                                    <li key={index}>
                                        <h3 style={{cursor: "pointer"}}
                                            onClick={() => navigateToChat(chatFolderDate.chatId, chatFolderDate.date)}
                                        >
                                            {chatFolderDate.date}
                                        </h3>
                                        <img
                                            src={deleteIcon}
                                            alt={"delete-icon.png"}
                                            onClick={() => handleChatRoomDelete(chatFolderDate.chatId)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <ul>
                        <h1>MZ오피스 단어장</h1>
                    </ul>

                    <div className="naver-logout">
                        <div className="naver-logout-button"
                             onClick={() => dispatch(constantActions.onShowDialog({ dialogType: "CONFIRM", dialogTitle: "로그아웃", dialogContent: "로그아웃을 하시겠습니까?", positiveFunction: handleNaverLogout }))}
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