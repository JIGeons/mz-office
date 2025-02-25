import React, {useEffect, useState} from "react";

// Actions
import authActions from "../redux/modules/AuthSlice";
import chatActions from "../redux/modules/ChatSlice";

// Components
import ChatGuide from "../components/Chat/ChatGuide";

// Image
import MZLogoWhite from "../assets/images/MZ_logo_white.png";

// CSS
import "../styles/chatMain.css";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const ChatMain = (() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({});
    const [chatList, setChatList] = useState([]);

    // Redux State
    const chat = useSelector((state) => state.chat);

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        userInfo.name = userData?.name || "ㅇㅇ";

        // chatDetailList 호출. (API 연동 안함)
        // dispatch(chatActions.getChatDetailList());
    }, []);

    // chatDetailList를 받아온 경우
    useEffect(() => {
        if (chat.chatDetailList?.code == "SUCCESS") {
            setChatList(chat.chatDetailList?.content);
        }
    }, [chat.chatDetailList]);

    return (
        <div className="chat-main">
            <section className="mz-logo-white">
                <img src={MZLogoWhite} alt="MZ-logo-white.png" />
                <h1>{userInfo?.name}님, 안녕하세요.</h1>
                <p>MZ오피스를 이용하여, 사내에서 문제를 해결해보세요!</p>
            </section>
            <section className="chatting_main">
                {
                    (chatList?.response == "FAIL") && <ChatGuide />
                }
            </section>
            <section className="chat_input">

            </section>
        </div>
    );
});

export default ChatMain;