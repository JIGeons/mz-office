import React, {useEffect, useState} from "react";
import { SocketUrl } from "../utils/ServerUrl";

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
    const [socket, setSocket] = useState(null);
    const [button, setButton] = useState(null);

    // Redux State
    const chat = useSelector((state) => state.chat);

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        userInfo.name = userData?.name || "ㅇㅇ";

        console.log("URL: ", SocketUrl);
        const ws = new WebSocket(`${SocketUrl}?token=Bearer ${userData?.accessToken}`);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
        }

        ws.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            console.log("서버에서 받은 메시지: ", receivedMessage);
            setMessages((prevMessage) => [...messages, receivedMessage]);
        }

        ws.onclose = () => {
            console.log("Websocket 연결 종료");
        }

        ws.onerror = (error) => {
            console.log('WebSocket 오류: ', error);;
        };

        setSocket(ws);  // WebSocket 객체를 상태로 관리

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        }
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
        setButton(requestType);
    }

    const [message, setMessage] = useState({
        chatId: null,
        chatSessionId: null,
        inquiryType: null,
        content: null,
    });
    const [messages, setMessages] = useState([]);

    // 메시지 전송 함수
    const sendMessage = (inquiryType, content) => {
        if (socket) {
            const sendMessageRequest = {
                chatId: null,
                chatSessionId: null,
                inquiryType: inquiryType,
                content,
            }

            console.log("보낸 메시지: ", JSON.stringify(sendMessageRequest));
            socket.send(JSON.stringify(sendMessageRequest));  // 서버로 메시지 전송
            setMessage({
                chatId: null,
                chatSessionId: null,
                inquiryType: null,
                content: null,
            });  // 메시지 입력 필드 초기화
        }
    };

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
                    <ChatResponse guide={<ChatGuide />} />
                    <ChatRequest setRequestType={setRequestType} />
                </div>
            </section>
            <section className="chat_input">
                <input typeof={"text"} placeholder={"MZ오피스에게 물어보기"}></input>
                <img src={SearchIcon} alt={"search-icon.png"} onClick={() => sendMessage('REQUEST_TYPE', 'PARSE')} />
                <button className={"chat_sending"}>
                    { !button ?
                        <img src={SearchIcon} alt={"search-icon.png"} style={{cursor: "no-drop"}}/>
                        : <img src={SearchIcon} alt={"search-icon.png"} onClick={() => sendMessage('PARSE', '애자일 뜻이 뭐야?')} />
                    }
                </button>
            </section>
        </div>
    );
};

export default ChatMain;