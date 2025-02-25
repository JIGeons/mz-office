import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import * as authActions from "../redux/modules/AuthSlice";
import * as constantActions from "../redux/modules/ConstantSlice";

// Image
import sidebarToggle from "../assets/images/sidebar/ico_leftmenu.png"
import deleteIcon from "../assets/images/sidebar/delete.png"
import logoutIcon from "../assets/images/sidebar/Logout.png"

// CSS
import "../styles/components/sidebar.css"
import "../styles/fonts/paperlogy.css"


const Sidebar = ({ toggleSidebar, isCollapsed, chatList }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Component State
    const [chatFolder, setChatFolder] = useState([]);

    useEffect(() => {
        // chatList 가 존재하는 경우
        if (chatList && chatList.length > 0) {
            for (let chatInfo in chatList) {
                const chatDate = new Date(chatInfo?.date);
                const year = chatDate.getFullYear();
                const month = chatDate.getMonth() + 1;
                const date = chatDate.getDate();
                const chatFolderDate = `${year}-${month}-${date}`;
                setChatFolder([...chatFolder, chatFolderDate]);
            }
        }
        // chatList가 존재하지 않는 경우
        else {
            // 현재 날짜를 받아온다.
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const date = today.getDate();
            const todayDate = `${year}-${month}-${date}`;
            setChatFolder([todayDate]);
        }
    }, []);

    const handleNaverLogout = () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const accessToken = userData?.accessToken;

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            dispatch(authActions.clearAuthState());

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
                                        <h3>{chatFolderDate}</h3>
                                        <img src={deleteIcon} alt={"delete-icon.png"} />
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