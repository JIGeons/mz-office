import React, {useEffect, useState} from "react";

// Actions
import authActions from "../redux/modules/AuthSlice";
import chatActions from "../redux/modules/ChatSlice";

// Components
import ChatGuide from "../components/Chat/ChatGuide";

// Image
import MZLogoWhite from "../assets/images/MZ_logo_white.png";
import SearchIcon from "../assets/images/chat/search_icon.png";

// CSS
import "../styles/chatMain.css";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ChatResponse from "../components/Chat/ChatResponse";
import ChatRequest from "../components/Chat/ChatRequest";

const ChatMain = () => {
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

    const setRequestType = (requestType) => {
        console.log("requestType: ", requestType);
    }

    return (
        <div className="chat-main">
            <section className="mz-logo-white">
                <img src={MZLogoWhite} alt="MZ-logo-white.png" />
                <div className="mz-logo-text">
                    <h1>안녕하세요.</h1>
                    <div className="mz-logo-text-description">
                        <p>MZ오피스를 이용하여, 사내에서의 문제를 해결해보세요!</p>
                    </div>
                </div>
            </section>
            <section className="chatting_main">
                <div className="chatting_content_scroll">
                    <ChatRequest setRequestType={setRequestType} />
                    <ChatResponse guide={<ChatGuide />} />
                    {
                        (chatList?.response == "FAIL") && <ChatGuide />
                    }
                </div>
            </section>
            <section className="chat_input">
                <input typeof={"text"} placeholder={"MZ오피스에게 물어보기"}></input>
                <button className={"chat_sending"}>
                    <img src={SearchIcon} alt={"search-icon.png"} />
                </button>
            </section>
        </div>
    );
};

export default ChatMain;