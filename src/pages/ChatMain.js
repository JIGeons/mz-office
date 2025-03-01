import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SocketUrl } from "../utils/ServerUrl";

// Actions
import * as authActions from "../redux/modules/AuthSlice";
import * as chatActions from "../redux/modules/ChatSlice";

// Components
import ScrollToBottom from "react-scroll-to-bottom";
import {
    ChatGuide,
    ChatResponse,
    ChatRequest,
    Request,
    RequestButton,
} from "../components/ComponentsPath";

// Image
import MZLogoWhite from "../assets/images/MZ_logo_white.png";
import SearchIcon from "../assets/images/chat/search_icon.png";
import DisabledSearchIcon from "../assets/images/chat/disabled_search_icon.png";

// CSS
import "../styles/chatMain.css";

// Utils
import { getTodayDate } from "../utils/Utils";
import { GenerateType} from "../utils/Enums";

const initialMessage = {
    sender: "USER",
    inquiryType: null,
    content: null,
    sendAt: null,
}

const initialSession = {
    chatSessionId: null,
    createdAt: null,
    messages: [initialMessage],
}

const ChatMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 현재 날짜, URL에서 chatId와 date 가져오기
    const todayDate = getTodayDate();
    const [params] = useSearchParams();
    const paramChatId = params.get("chatId") || null;
    const paramDate = params.get("date") || null;    // date가 today가 아닌 경우 chatting 비활성화
    const isToday = paramDate == todayDate;

    // socketMessage 객체 정의
    const initialSocketMessage = {
        chatId: paramChatId == "today" ? null : paramChatId,
        chatSessionId: null,
        inquiryType: null,
        content: null,
    }

    // useState 정의
    const [userInfo, setUserInfo] = useState({});
    const [chatList, setChatList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [disabledButton, setDisAbledButton] = useState(true);
    const [chatId, setChatId] = useState(null);
    // const [sessionList, setSessionList] = useState([]);
    const [showRequestButton, setShowRequestButton] = useState(false);

    // Redux State
    const chatState = useSelector((state) => state.chat);
    const { todayChatList, chatDetail } = useSelector((state) => state.chat);

    // useRef로 sessionList, socketMessage Ref 정의
    const sessionListRef = useRef([initialSession]);
    const socketMessageRef = useRef(initialSocketMessage);

    const [_, setRender] = useState(0);    // 강제 리렌더링용 state

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));

        // TODO:: 활성화 할 것
        if (!userData) {
            console.error("❌ User data not found! 페이지를 새로고침합니다.");
            window.location.reload();   // 🔄 새로고침
            return ;
        }

        // TODO:: 활성화 할 것
        if (!paramChatId && !paramDate) {
            console.error("❌ paramChatId, Date data not found! 페이지를 새로고침합니다.");
            window.location.reload();   // 🔄 새로고침
            return ;
        }

        // date가 오늘인 경우 API 호출 및 소캣 연결
        if (paramDate === todayDate) {
            setShowRequestButton(true);
            dispatch(chatActions.getTodayChatList())

            // 웹 소켓 연결 실행
            const ws = connectWebSocket(userData.accessToken);
            setSocket(ws);

            // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
            return () => {
                ws.close();
            }
        }

        // date가 오늘이 아닌 경우 chatData request API만 호출
        else {
            dispatch(chatActions.getChatDetail({chatId: paramChatId}));
            setShowRequestButton(false);
        }
    }, [ paramChatId, paramDate, dispatch ]);

    // API 응답 시 처리
    useEffect(() => {
        // date가 오늘인 경우
        if (paramDate === todayDate) {
            if (todayChatList?.code == "SUCCESS") {
                const chatSessionList = todayChatList?.content?.chatSessionList || null;

                // 오늘 채팅 목록이 있는 경우, 마지막에 비어있는 질문 추가
                if (chatSessionList) {
                    setChatId(todayChatList?.content?.chatId);
                    sessionListRef.current = [...chatSessionList, initialSession];
                }
                // 오늘 채팅 목록이 없는 경우, 비어있는 질문으로 sessionListRef 초기화
                else {
                    sessionListRef.current = [initialSession];
                }

                // socketMessage 초기화
                socketMessageRef.current = initialSocketMessage;
            }
        } else {
            if (chatDetail.code == "SUCCESS") {
                console.log("chatDetail: ", chatDetail.content.chatSessionList);
                // date가 오늘이 아닌경우 chatDetail에서 채팅 목록 조회
                setChatId(chatDetail.content.chatId);
                sessionListRef.current = chatDetail.content.chatSessionList;
                console.log("Updated sessionList: ", sessionListRef.current);

                // socketMessage 초기화
                socketMessageRef.current = initialSocketMessage;
            } else {
                console.error("### chatDetail 응답 오류. (error: ", chatDetail);
                return;
            }
        }

    }, [ todayChatList, chatDetail, paramDate ]);


    // ✅ 1. 웹 소켓 연결을 처리하는 함수
    const connectWebSocket = (token) => {
        console.log("URL: ", SocketUrl);
        const ws = new WebSocket(`${SocketUrl}?token=Bearer ${token}`);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
        };

        ws.onmessage = (event) => {
            handleWebSocketMessage(event);
        };

        ws.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        ws.onerror = (error) => {
            console.log("WebSocket 오류: ", error);
        };

        return ws;
    };

    // ✅ 2. WebSocket 메시지 처리 함수
    const handleWebSocketMessage = (event) => {
        console.log("서버에서 받은 메시지: ", JSON.parse(event.data));
        console.log("### sessionList: ", sessionListRef.current);
        const receivedMessage = JSON.parse(event.data);

        // 새로운 chat은 저장하기 위해 newChatList생성
        const newSessionList = sessionListRef.current.length > 0 ? sessionListRef.current.slice(0,-1) : [];
        const deepSessionList = JSON.parse(JSON.stringify(sessionListRef.current));
        console.log("### deepSessionList: ", deepSessionList);
        const lastSession = deepSessionList.length == 0 ? initialSession : deepSessionList[deepSessionList.length - 1];
        // const lastSession = deepSessionList[deepSessionList.length - 1];

        // 채팅으로 질문을 해야하는 과정에서는 버튼 비활성화
        if (socketMessageRef.current.content == "PARSE"
            || (socketMessageRef.current.inquiryType == "INPUT_METHOD" && socketMessageRef.current.content == "WITH_PREVIOUS")) {
            setShowRequestButton(false);
        }

        // content == "" 인 경우, 버튼 클릭에 대한 응답
        if (!receivedMessage.content || receivedMessage.content === "") {

            // chatSessionId가 존재하지 않는 경우, 처음 버튼을 누른 경우 -> initSessionMessage를 생성
            // InquiryType == REQUEST_TYPE
            if (!socketMessageRef.current?.chatSessionId) {
                // chatId, chatSessionId 업데이트
                socketMessageRef.current.chatId = receivedMessage.chatId;
                socketMessageRef.current.chatSessionId = receivedMessage.chatSessionId;

                // 신규 메세지 추가
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }

                console.log("### lastSession: ", lastSession);
                lastSession.chatSessionId = receivedMessage.chatSessionId;
                lastSession.createdAt = new Date();
                lastSession.messages = [newMessage];

                sessionListRef.current = [...newSessionList, lastSession];   // 응답을 추가한 Session을 추가한다.
            } else {
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }
                lastSession.messages = [...lastSession.messages, newMessage];

                sessionListRef.current = [...newSessionList, lastSession];   // 응답을 추가한 Session을 추가한다.
            }
        }
        // content가 존재하는 경우 질문에 대한 응답.
        else {
            const lastMessage = lastSession.messages[lastSession.messages.length - 1];
            let newMessage = null;
            if (lastMessage.inquiryType == "INPUT_METHOD" && lastMessage.content == "WITH_PREVIOUS") {
                newMessage = {
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }
            }
            else {
                newMessage = {
                    // 새로운 message 추가
                    sender: "AI",
                    inquiryType: sessionListRef.current.inquiryType,
                    content: receivedMessage.content,
                    sendAt: new Date(),
                }
            }

            const lastSessionChat = {
                ...sessionListRef.current[sessionListRef.current.length - 1],
                messages:[
                    ...sessionListRef.current[sessionListRef.current.length - 1].messages,
                    newMessage
                ]
            }

            sessionListRef.current = [...newSessionList, lastSessionChat];   // 응답을 추가한 Session을 추가한다.
            setShowRequestButton(true); // AI 응답을 받으면 버튼 활성화
        }

        console.log("~~~~ 강제 렌더링: ");
        setRender(prev => prev + 1);
    };

    // 텍스트를 입력한 경우 제출 버튼이 활성화되도록 설정
    const handlerOnChangeInput = (e) => {
        // socketMessage.content가 PARSE 이거나 inquiryType이 SENTENCE_GENERATION_TYPE인 경우
        // text를 전송해야 하므로 button을 활성화
        if (socketMessageRef.current.content == "PARSE"
            || (socketMessageRef.current.inquiryType == "INPUT_METHOD" && socketMessageRef.current.content == "WITH_PREVIOUS")
            || (socketMessageRef.current.inquiryType == "SENTENCE_GENERATION_TYPE")
        ) {
            if (e.target.value.trim() != "") {
                setDisAbledButton(false);
            } else {
                setDisAbledButton(true);
            }
        }
    }


    const setRequestType = (requestType, content) => {
        console.log("requestType: ", requestType);

        if (requestType == "RESET") {
            socketMessageRef.current = initialSocketMessage;
            // 강제 렌더링
            setRender(prev => prev + 1);
            return;
        } else if (requestType == "MORE_REQUEST") {
            socketMessageRef.current.chatSessionId = null;
            sessionListRef.current = [...sessionListRef.current, initialSession];

            if (!content) {
                sendMessage("REQUEST_TYPE", "PARSE");
            } else {
                sendMessage("MESSAGE_TYPE", content);
            }
        } else {
            sendMessage(requestType, content);
        }
    }

    // 메시지 전송 함수
    const sendMessage = (inquiryType, content) => {
        if (socket) {
            let newChatId = false;
            // sessionId가 없는 경우 -> 챗이 시작하기 전
            if (!socketMessageRef.current?.chatSessionId) {
                const todayDate = getTodayDate();
                // 질문을 시작하는 날짜가 오늘이 아니면 새로운 채팅방을 생성
                if (paramDate != todayDate) {
                    newChatId = true;
                }
            }

            console.log("inquiryType: ", inquiryType, " content: ", content);

            // 소캣 메세지 set
            socketMessageRef.current.inquiryType = inquiryType;
            socketMessageRef.current.content = content;

            if (inquiryType == "AI_REQUEST") {
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }
                sessionListRef.current[sessionListRef.current.length - 1].messages.push(newMessage);
                setRender(prev => prev + 1);    // 강제 렌더링
            }

            console.log("### socketMessageRef.current: ", JSON.stringify(socketMessageRef.current));
            socket.send(JSON.stringify(socketMessageRef.current));  // 서버로 메시지 전송
        }
    };

    const sendRequest = () => {
        setDisAbledButton(true);

        // 이전 작업이 문장 해석 버튼 클릭이 경우
        if (socketMessageRef.current.content == "PARSE"
            || (socketMessageRef.current.content == "WITH_PREVIOUS" && socketMessageRef.current.inquiryType == "INPUT_METHOD")
            || socketMessageRef.current.inquiryType == "SENTENCE_GENERATION_TYPE"
        ) {
            console.log("메세지 전송");
            const chatContent = document.getElementById("chat-input-content").value;
            document.getElementById("chat-input-content").value = "";

            sendMessage("AI_REQUEST", chatContent);
        }
    }

    const sessionList = sessionListRef.current;
    console.log("=== Session List: ", sessionList);
    console.log("=== showRequestButton: ", showRequestButton, " socketMessageRef.current: ", socketMessageRef.current);
    let messageType = null;

    let user = "";
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
                    <ChatResponse isGuide={true} />
                    {
                        sessionList && sessionList.length > 0
                        && sessionList.flatMap((messages, index) => {
                            messageType = null;
                            user = null;
                            return messages.messages.flatMap((msg, depth) => {
                                const msgComponent = [];

                                if (msg?.sender == "USER") {
                                    if (msg?.inquiryType == "REQUEST_TYPE") {
                                        if (msg?.content == "PARSE") {
                                            msgComponent.push(<ChatRequest content={"문구 해석"} key={`request-parse-${index}-${depth}`} />)
                                            msgComponent.push(<Request type={"INPUT_TEXT"} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        } else {
                                            msgComponent.push(<ChatRequest content={"문장 작성"} key={`request-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_1"} type={msg?.inquiryType} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        }
                                    }

                                    else if (msg?.inquiryType == "MESSAGE_TYPE") {
                                        messageType = msg?.content;
                                        if (msg?.content == "MESSAGE") {
                                            msgComponent.push(<ChatRequest content={"문자 작성"} key={`request-parse-${index}-${depth}`} />)
                                        } else {
                                            msgComponent.push(<ChatRequest content={"메일 작성"} key={`request-parse-${index}-${depth}`} />)
                                        }
                                        msgComponent.push(<Request step={"step_2"} type={msg?.inquiryType} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                    }

                                    else if (msg?.inquiryType == "INPUT_METHOD") {
                                        if (msg?.content == "WITH_PREVIOUS") {
                                            msgComponent.push(<ChatRequest content={`이전에 받은 ${messageType == "MESSAGE" ? "문자" : "메일"} 입력`} key={`request-parse-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_3"} type={msg?.content} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        } else {
                                            msgComponent.push(<ChatRequest content={`이전에 받은 ${messageType == "MESSAGE" ? "문자" : "메일"} 없이 입력`} key={`request-parse-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_3"} type={msg?.content} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        }
                                    }

                                    else if (msg?.inquiryType == "SENTENCE_GENERATION_TYPE") {
                                        msgComponent.push(<ChatRequest content={ GenerateType(msg?.content)} key={`request-parse-${index}-${depth}`} />);
                                        msgComponent.push(<Request type={"INPUT_TEXT"} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                    }

                                    else if (msg?.inquiryType == "AI_REQUEST") {
                                        msgComponent.push(<ChatRequest content={ GenerateType(msg?.content)} key={`request-parse-${index}-${depth}`} />);
                                    }
                                } else if (msg?.sender == "AI") {
                                    user = "AI";
                                    msgComponent.push(<ChatResponse content={msg?.content} key={`response-${index}-${depth}`} />);
                                    msgComponent.push(<Request type={msg?.inquiryType} messageType={messageType} />);
                                }

                                // 메세지 컴포넌트 출력
                                return msgComponent;
                            });
                        })
                    }
                    {
                        // SocketMessage에 따라 버튼 출력
                        (showRequestButton && socketMessageRef.current) &&
                            <RequestButton inquiryType={socketMessageRef.current.inquiryType} content={socketMessageRef.current.content} user={user} messageType={messageType} setRequestType={setRequestType} />
                    }
                </ScrollToBottom>
            </section>
            <section className="chat_input">
                <input
                    id="chat-input-content"
                    typeof={"text"}
                    onChange={(e) => handlerOnChangeInput(e)}
                    placeholder={"MZ오피스에게 물어보기"}
                ></input>
                <button className={"chat_sending"}>
                    { disabledButton ?
                        <img src={DisabledSearchIcon} alt={"search-icon.png"} style={{cursor: "no-drop"}}/>
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