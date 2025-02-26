import React, {useEffect, useRef, useState} from "react";
import { SocketUrl } from "../utils/ServerUrl";
import ScrollToBottom from "react-scroll-to-bottom";

// Actions
import * as authActions from "../redux/modules/AuthSlice";
import * as chatActions from "../redux/modules/ChatSlice";

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
import Request from "../components/Chat/Request";

const initialMessage = {
    chatId: null,
    chatSessionId: null,
    inquiryType: null,
    content: null,
}

const initialSessionChat = {
    sender: null,
    inquiryType: null,
    content: null,
    sendAt: null,
}
const initialSessionMessage = {
    chatSessionId: null,
    createdAt: null,
    messages: [initialMessage],
}

const ChatMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({});
    const [chatList, setChatList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [button, setButton] = useState(null);

    // message Ref 정의
    const messageRef = useRef({
        chatId: null,
        chatSessionId: null,
        inquiryType: null,
        content: null,
    });

    const sessionListRef = useRef([]);
    const [_, setRender] = useState(0);    // 강제 리렌더링용 state

    // Redux State
    const chatState = useSelector((state) => state.chat);

    const params = new URLSearchParams(window.location.search);
    const chatId = params.get("chatId");
    const date = params.get("date");    // date가 today가 아닌 경우 chatting 비활성화

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        userInfo.name = userData?.name || "ㅇㅇ";

        // 오늘 메세지 조회
        if (chatId == "today") {
            // chatId가 today인 경우 오늘 채팅 내역이 없는 것이므로 initialSessionChat 으로 초기화
            if (chatState.todayChatList?.code == "SUCCESS") {
                sessionListRef.current = initialSessionChat;
            }
        } else {
            console.log("chatId 챗 리스트 조회: " + chatId);
            dispatch(chatActions.getChatDetail({chatId}))
                .then(res => {
                    const response = res?.payload;
                    // chatId 리스트 조회의 성공 한 경우
                    if (response?.code == "SUCCESS") {
                        console.log("리스트 조회 성공: ", response?.content);
                        // chatSessionList 배열에 initialSessionMessage 을 추가한다.
                        const chatSessionList = response?.content?.chatSessionList;

                        if (date == "today") {
                            // 오늘인 경우 다음 질문을 위해 비어있는 chat 객체를 추가한다.
                            sessionListRef.current = [...chatSessionList, initialSessionMessage];
                        } else {
                            // 오늘이 아닌 경우 그냥 출력한다.
                            sessionListRef.current = chatSessionList;
                        }
                    } else {
                        console.log("리스트 조회 실패: ", response?.content);
                    }
                })
                .catch(err => console.log(err));
        }

        console.log("URL: ", SocketUrl);
        const ws = new WebSocket(`${SocketUrl}?token=Bearer ${userData?.accessToken}`);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
        }

        ws.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            console.log("서버에서 받은 메시지: ", receivedMessage);

            if (!receivedMessage.content || receivedMessage.content === "") {
                const initSessionMessage = {
                    chatSessionId: receivedMessage.chatSessionId,
                    createdAt: new Date(),
                    messages: [{
                        sender: "USER",
                        inquiryType: messageRef.inquiryType,
                        content: messageRef.content,
                        sendAt: new Date(),
                    }]
                }

                console.log("\n\n message: ", messageRef.current);

                // ✅ 마지막 요소를 새로운 값으로 변경
                if (sessionListRef.current.length > 0) {
                    const renewSessionMessage = sessionListRef.current[sessionListRef.current.length - 1];
                    renewSessionMessage.chatSessionId = receivedMessage.chatSessionId;
                    renewSessionMessage.createdAt = new Date();
                    renewSessionMessage.messages = [{
                        sender: "USER",
                        inquiryType: messageRef.current.inquiryType,
                        content: messageRef.current.content,
                        sendAt: new Date(),
                    }]

                    sessionListRef.current[sessionListRef.current.length - 1] = renewSessionMessage;
                } else {
                    sessionListRef.current = initSessionMessage;  // ✅ 만약 배열이 비어 있으면 그냥 추가
                }

                // messageRef update
                messageRef.current.chatId = receivedMessage.chatId;
                messageRef.current.chatSessionId = receivedMessage.chatSessionId;

                sessionListRef.current = [...sessionListRef.current, initSessionMessage];
                setRender(prev => prev + 1)   // 강제 리렌더링
            }
        }

        ws.onclose = () => {
            console.log("Websocket 연결 종료");
        }

        ws.onerror = (error) => {
            console.log('WebSocket 오류: ', error);
        };

        setSocket(ws);  // WebSocket 객체를 상태로 관리

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        }
        // chatDetailList 호출. (API 연동 안함)
        // dispatch(chatActions.getChatDetailList());
    }, []);

    const setRequestType = (requestType, content) => {
        console.log("requestType: ", requestType);
        setButton(requestType);
        sendMessage(requestType, content);
    }

    // 메시지 전송 함수
    const sendMessage = (inquiryType, content) => {
        if (socket) {
            messageRef.current.inquiryType = inquiryType;
            messageRef.current.content = content;

            const sendMsg = messageRef.current;
            console.log("\n\n\n\n보낸 메시지: ", JSON.stringify(sendMsg));
            socket.send(JSON.stringify(sendMsg));  // 서버로 메시지 전송
        }
    };

    const sendRequest = () => {
        // 이전 작업이 문장 해석 버튼 클릭이 경우
        if (messageRef.current.content == "PARSE") {

            const chatContent = document.getElementById("chat-input-content").value;
            document.getElementById("chat-input-content").value = "";

            sendMessage("PARSE", chatContent);
        }
    }

    const sessionList = sessionListRef.current;
    return (
        <div className="chat-main">
            <section className="mz-logo-white">
                <img src={MZLogoWhite} alt="MZ-logo-white.png" />
                <div className="mz-logo-text">
                    { chatId == "today" &&
                        <h1>안녕하세요.</h1>
                    }
                    <div className="mz-logo-text-description">
                        <p>MZ오피스를 이용하여, 사내에서의 문제를 해결해보세요!</p>
                    </div>
                </div>
            </section>
            <section className="chatting_main">
                <ScrollToBottom className="chatting_content_scroll" scrollBehavior={"auto"}>
                    <ChatResponse guide={<ChatGuide />} />
                    {
                        sessionList && sessionList.length > 0
                        && sessionList.flatMap((messages, index) => {
                            console.log(`${index + 1}- Messages: `, messages);

                            // chatSessionId가 존재하지 않으면 질문 버튼을 출력한다.
                            if (!messages?.chatSessionId || messages?.chatSessionId == null) {
                                return [<Request setRequestType={setRequestType} key={`request-${index}`} />];
                            }

                            return messages.messages.flatMap((msg, depth) => {
                                // console.log(`${indes+1}= `, msg);
                                if (msg?.sender == "USER") {
                                    if (msg?.inquiryType == "REQUEST_TYPE") {
                                        if (msg?.content == "PARSE") {
                                            // console.log("여기 나와야 하는거 아냐?");
                                            return [<ChatRequest content={"문구 해석"} key={`request-parse-${index}-${depth}`} />];
                                        } else {
                                            return [<ChatRequest content={"문장 작성"} key={`request-${index}-${depth}`} />];
                                        }
                                    }
                                } else if (msg?.sender == "AI") {
                                    return [<ChatResponse message={msg} key={`response-${index}-${depth}`} />];
                                }
                                return [];
                            });
                        })
                    }
                </ScrollToBottom>
            </section>
            <section className="chat_input">
                <input id="chat-input-content" typeof={"text"} placeholder={"MZ오피스에게 물어보기"}></input>
                <button className={"chat_sending"}>
                    { !messageRef.current.inquiryType ?
                        <img src={SearchIcon} alt={"search-icon.png"} style={{cursor: "no-drop"}}/>
                        : <img src={SearchIcon} alt={"search-icon.png"} onClick={() => sendRequest()} />
                    }
                </button>
            </section>
            <section className="privacy-policy">
                <p>개인정보 이용 처리 방침 확인하기</p>
            </section>
        </div>
    );
};

export default ChatMain;