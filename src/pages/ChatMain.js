import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { persistor } from "../redux/Store";
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
import MZLogoWhite from "../assets/images/mz_logo_white.png";
import SearchIcon from "../assets/images/chat/search_icon.png";
import DisabledSearchIcon from "../assets/images/chat/disabled_search_icon.png";
import calenderImg from "../assets/images/chat/calender.png";

// CSS
import "../styles/chatMain.css";

// Utils
import { getTodayDate, getTodayDateToString, transferDateToString } from "../utils/Utils";
import { GenerateType } from "../utils/Enums";
import ChatLoading from "../components/Chat/ChatLoading";
import * as constantActions from "../redux/modules/ConstantSlice";

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

// socketMessage 객체 정의
const initialSocketMessage = {
    chatId: null,
    chatSessionId: null,
    inquiryType: null,
    content: null,
}

const ChatMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;

    const reconnectTimeout = 5000; // 5초 후 재연결

    // 현재 날짜, URL에서 chatId와 date 가져오기
    const todayDate = getTodayDate();
    const todayDateToString = getTodayDateToString();
    const [params] = useSearchParams();
    const paramChatId = params.get("chatId") || null;
    const paramDate = params.get("date") || null;    // date가 today가 아닌 경우 chatting 비활성화
    const isToday = paramDate == todayDate;

    // useState 정의
    const [userInfo, setUserInfo] = useState({});
    const [chatList, setChatList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [disabledButton, setDisAbledButton] = useState(true);
    const [showRequestButton, setShowRequestButton] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [chatData, setChatData] = useState({chatId: null, date: null});
    const [sessionListState, setSessionListState] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    // const [chatId, setChatId] = useState(null);

    // useRef로 sessionList, socketMessage Ref 정의
    const sessionListRef = useRef([{...initialSession}]);
    const socketMessageRef = useRef({...initialSocketMessage});
    const chatIdRef = useRef(null);
    const chatContainerRef = useRef(null);
    const socketRef = useRef(null);

    // Redux State
    const chatState = useSelector((state) => state.chat);
    const { todayChatList, chatDetail } = useSelector((state) => state.chat);

    const [_, setRender] = useState(0);    // 강제 리렌더링용 state

    // component mount시 단 한번만 실행
    useEffect(() => {
        // ✅ 모바일 기기 확인 후 강제 리디렉트
        if (mobileRegex.test(userAgent)) {
            setIsMobile(true);
        }

        const queryPrams = new URLSearchParams(location.search);
        const paramDate = queryPrams.get("date");

        // 오늘 날짜의 채팅인 경우에만 웹 소캣 연결
        if (paramDate == todayDate) {
            // 웹 소켓 연결 실행
            let ws;

            const startWebSocket = async () => {
                try {
                    const ws = await connectWebSocket();
                    socketRef.current = ws;

                } catch (error) {
                    console.error("❌ WebSocket 재연결 실패: ", error);
                    dispatch(constantActions.onShowDialog({
                        dialogType: "ALERT",
                        dialogTitle: "서버 연결 실패",
                        dialogContent: "서버와의 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
                    }));
                }
            }

            startWebSocket();

            return () => {
                if (ws) ws.close();
            }
        }
    }, []);

    useEffect(() => {
        const queryPrams = new URLSearchParams(location.search);
        const paramChatId = queryPrams.get("chatId");
        const paramDate = queryPrams.get("date");

        setChatData({chatId: paramChatId || "today", date: paramDate || todayDate});
        setShowLoading(false);

        if (paramChatId) {
            // chatId가 today이면 오늘의 chatting을 불러온다.
            if (paramChatId == "today") {
                dispatch(chatActions.getTodayChatList());
            }
            // chat 히스토리를 불러온다.
            else {
                console.log("chat 히스토리 조회");
                chatIdRef.current = queryPrams.get("chatId");
                initialSocketMessage.chatId = queryPrams.get("chatId");
                dispatch(chatActions.getChatDetail({chatId: queryPrams.get("chatId")}));

                return ;
            }
        }
    }, [paramChatId, paramDate]);

    useEffect(() => {
        if (todayChatList?.code == "SUCCESS" && paramDate == todayDate) {
            const response = todayChatList?.content;

            initialSocketMessage.chatId = response?.chatId;
            socketMessageRef.current.chatId = response?.chatId;
            // 기존 데이터 삽입.
            sessionListRef.current = [...response.chatSessionList];
            // 채팅을 시작할 새로운 session 추가
            sessionListRef.current.push({...initialSession});

            // 강제 렌더링
            setRender(prev => prev + 1);
        }
    }, [todayChatList]);

    useEffect(() => {
        // chatDetail의 응답을 성공적으로 받은 경우
        if (chatDetail?.code == "SUCCESS" && paramDate != todayDate) {
            const response = chatDetail?.content;
            sessionListRef.current = chatDetail.content.chatSessionList;

            // 강제 렌더링
            setRender(prev => prev + 1);
        } else if (chatDetail?.code == "ERROR") {
            navigate("/chat");
        }
    }, [chatDetail]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [sessionListState]);  // sessionList가 변경될 때마다 실행



    // ✅ 1. 웹 소켓 연결을 처리하는 함수
    const connectWebSocket = () => {
        return new Promise((resolve, reject) => {
            const storageUserData = JSON.parse(localStorage.getItem("userData"));
            const ws = new WebSocket(`${SocketUrl}?token=Bearer ${storageUserData.accessToken}`);

            ws.onopen = () => {
                console.log("✅ WebSocket 연결 성공");
                dispatch(constantActions.onHideDialog());
                setSocket(ws);
                resolve(ws);
            };

            ws.onmessage = (event) => {
                handleWebSocketMessage(event);
            };

            ws.onclose = (event) => {
                console.log("🔴 WebSocket 연결 종료", event);

                if (event.code === 4001) {
                    localStorage.clear();
                    persistor.purge();
                    location.reload();
                }
            };

            ws.onerror = (error) => {
                console.log("❌ WebSocket 오류: ", error);
            };
        });
    };


    // ✅ 2. WebSocket 메시지 처리 함수
    const handleWebSocketMessage = (event) => {
        console.log("서버에서 받은 메시지: ", JSON.parse(event.data));
        console.log("### sessionList: ", sessionListRef.current);
        const receivedMessage = JSON.parse(event.data);

        // socketMessageRef.current에 chatId가 없는 경우 로컬 스토리지에 저장
        if (!socketMessageRef.current.chatId
            && receivedMessage.chatId) {
            const chatDataString = {
                chatId: receivedMessage.chatId,
                date: getTodayDate()
            }
            localStorage.setItem("chatData", JSON.stringify(chatDataString));
            initialSocketMessage.chatId = receivedMessage.chatId;
        }

        // 새로운 chat은 저장하기 위해 newChatList생성
        const newSessionList = sessionListRef.current.length > 0 ? sessionListRef.current.slice(0,-1) : [];
        const deepSessionList = JSON.parse(JSON.stringify(sessionListRef.current));
        console.log("### deepSessionList: ", deepSessionList);
        const lastSession = deepSessionList.length == 0 ? initialSession : deepSessionList[deepSessionList.length - 1];

        // 채팅으로 질문을 해야하는 과정에서는 버튼 비활성화
        if (socketMessageRef.current.content == "PARSE"
            || (socketMessageRef.current.inquiryType == "INPUT_METHOD" && socketMessageRef.current.content == "WITH_PREVIOUS")) {
            setShowRequestButton(false);
        }

        // content == "" 인 경우, 버튼 클릭에 대한 응답
        if (!receivedMessage.content || receivedMessage.content === "") {
            // chatId가 존재하지 않는 경우 chatId 업데이트
            if (!socketMessageRef.current?.chatId) {
                socketMessageRef.current.chatId = receivedMessage.chatId;
            }

            // chatSessionId가 존재하지 않는 경우, 처음 버튼을 누른 경우 -> initSessionMessage를 생성
            // InquiryType == REQUEST_TYPE
            if (!socketMessageRef.current?.chatSessionId) {
                // chatId, chatSessionId 업데이트
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
                setSessionListState(sessionListRef.current);
            } else {
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }
                lastSession.messages = [...lastSession.messages, newMessage];

                sessionListRef.current = [...newSessionList, lastSession];   // 응답을 추가한 Session을 추가한다.
                setSessionListState(sessionListRef.current);
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
                    inquiryType: "AI_RESPONSE",
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
            setShowLoading(false);
            setSessionListState(sessionListRef.current);
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

    const handlerReConnectWebSocket = async (inquiryType, content) => {
        try {
            // socket이 close되지 않은 상태인 경우 소캣을 닫고 재연결
            if (socket && socket.readyState !== WebSocket.CLOSED) {
                socket.close();
            }

            const ws = await connectWebSocket(); // 연결 성공까지 기다림
            socketRef.current = ws;

            sendMessage(inquiryType, content);   // 연결 성공 후 안전하게 메시지 전송
        } catch (error) {
            console.error("❌ WebSocket 재연결 실패: ", error);
            dispatch(constantActions.onShowDialog({
                dialogType: "ALERT",
                dialogTitle: "서버 연결 실패",
                dialogContent: "서버와의 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
            }));
        }
    };


    // 🔹 Enter 키 입력 이벤트 추가
    const handlerOnKeyDown = (e) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                // Shift + Enter: 줄 바꿈
                return;
            } else {
                // Enter: 메시지 전송
                if (!isMobile) {
                    e.preventDefault(); // 기본 Enter 동작(개행) 방지

                    // 전송 가능한 경우에 enter 처리
                    if (!disabledButton) sendRequest();
                }
            }
        }
    };


    const setRequestType = (requestType, content) => {
        console.log("requestType: ", requestType);

        if (requestType == "RESET") {
            console.log("initialSocketMessage: ", initialSocketMessage);
            socketMessageRef.current = {...initialSocketMessage};
            sessionListRef.current.push({...initialSession});
            // 강제 렌더링
            setRender(prev => prev + 1);
            return ;
        } else if (requestType == "MORE_REQUEST") {
            //
            // socketMessageRef.current.chatSessionId = null;
            // sessionListRef.current = [...sessionListRef.current, initialSession];

            if (!content) {
                sendMessage("REQUEST_TYPE", "PARSE");
            } else {
                sendMessage("MESSAGE_TYPE", content);
            }
        } else {
            // 문자/ 메일 유형 선택 후 요청 버튼 비활성화
            if (requestType == "SENTENCE_GENERATION_TYPE") setShowRequestButton(false);
            sendMessage(requestType, content);
        }
    }

    // 메시지 전송 함수
    const sendMessage = (inquiryType, content) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            handlerReConnectWebSocket(inquiryType, content);
            return;
        }

        if (socketRef.current) {
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
                setShowLoading(true);
            }

            console.log("### socketMessageRef.current: ", JSON.stringify(socketMessageRef.current));
            socketRef.current.send(JSON.stringify(socketMessageRef.current));  // 서버로 메시지 전송
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
    // console.log("=== Session List: ", sessionList);
    // console.log("=== showRequestButton: ", showRequestButton, " socketMessageRef.current: ", socketMessageRef.current);
    let messageType = null;

    let user = "";
    console.log("#### SessionList: ", sessionList);
    return (
        <div className="chat-main">
            <section className="mz-logo-white">
                <div className="mz-logo-text">
                    {   !isMobile &&
                        <>
                            {  !chatIdRef.current &&
                                <h1>사용자님, 안녕하세요.</h1>
                            }
                            <div className="mz-logo-text-description">
                                <p>MZ오피스를 이용하여, 사내에서의 문제를 해결해보세요!</p>
                            </div>
                        </>
                    }
                </div>
            </section>
            <section className="chatting_main">
                {   !isMobile &&
                    <div className="chatting_date">
                        <div className="chatting_date_content">
                            <img src={calenderImg} alt="calendar.png" />
                            {transferDateToString(chatData.date)}
                        </div>
                    </div>
                }
                <ScrollToBottom className="chatting_content_scroll" scrollBehavior={"auto"}>
                    {   isMobile &&
                        <>
                            <div className="mz-logo-text-description">
                                <h2>사용자님, 안녕하세요!<br /> MZ오피스를 이용하여,<br /><span>사내에서의 문제를 해결</span>해보세요!</h2>
                            </div>
                        </>
                    }
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
                                            msgComponent.push(<ChatRequest content={"문구 해석"} key={`request-${index}-${depth}`} />)
                                            msgComponent.push(<Request type={"INPUT_TEXT"} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        } else {
                                            msgComponent.push(<ChatRequest content={"문장 작성"} key={`request-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_1"} type={msg?.inquiryType} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        }
                                    }

                                    else if (msg?.inquiryType == "MESSAGE_TYPE") {
                                        messageType = msg?.content;
                                        if (msg?.content == "MESSAGE") {
                                            msgComponent.push(<ChatRequest content={"문자 작성"} key={`request-${index}-${depth}`} />)
                                        } else {
                                            msgComponent.push(<ChatRequest content={"메일 작성"} key={`request-${index}-${depth}`} />)
                                        }
                                        msgComponent.push(<Request step={"step_2"} type={msg?.inquiryType} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                    }

                                    else if (msg?.inquiryType == "INPUT_METHOD") {
                                        if (msg?.content == "WITH_PREVIOUS") {
                                            msgComponent.push(<ChatRequest content={`이전에 받은 ${messageType == "MESSAGE" ? "문자" : "메일"} 입력`} key={`request-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_3"} type={msg?.content} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        } else {
                                            msgComponent.push(<ChatRequest content={`이전에 받은 ${messageType == "MESSAGE" ? "문자" : "메일"} 없이 입력`} key={`request-${index}-${depth}`} />);
                                            msgComponent.push(<Request step={"step_3"} type={msg?.content} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                        }
                                    }

                                    else if (msg?.inquiryType == "SENTENCE_GENERATION_TYPE") {
                                        msgComponent.push(<ChatRequest content={ GenerateType(msg?.content)} key={`request-${index}-${depth}`} />);
                                        msgComponent.push(<Request type={msg?.inquiryType} contentType={msg?.content} messageType={messageType} key={`request-parse-${index}-${depth}`} />);
                                    }

                                    else if (msg?.inquiryType == "AI_REQUEST") {
                                        msgComponent.push(<ChatRequest content={ GenerateType(msg?.content)} key={`request-parse-${index}-${depth}`} />);
                                    }
                                } else if (msg?.sender == "AI") {
                                    user = "AI";
                                    msgComponent.push(<ChatResponse content={msg?.content} key={`response-${index}-${depth}`} />);
                                    msgComponent.push(<Request type={msg?.inquiryType} messageType={messageType} key={`response-parse-${index}-${depth}`} />);
                                }

                                // 메세지 컴포넌트 출력
                                return msgComponent;
                            });
                        })
                    }
                    {
                        // SocketMessage에 따라 버튼 출력
                        (showRequestButton && socketMessageRef.current && !showLoading)
                        && (chatData?.date == todayDate) &&
                            <RequestButton inquiryType={socketMessageRef.current.inquiryType} content={socketMessageRef.current.content} user={user} messageType={messageType} setRequestType={setRequestType} />
                    }
                    {   showLoading &&
                        <ChatLoading />
                    }
                </ScrollToBottom>
            </section>
            <section className={`chat_input ${showRequestButton ? "input-disabled" : ""}`}>
                <textarea
                    id="chat-input-content"
                    typeof={"textarea"}
                    onChange={(e) => handlerOnChangeInput(e)}
                    onKeyDown={handlerOnKeyDown} // ✅ 엔터 및 Shift + Enter 이벤트 처리
                    placeholder={"MZ오피스에게 물어보기"}
                    disabled={!(socketMessageRef.current?.inquiryType == "SENTENCE_GENERATION_TYPE" || socketMessageRef.current?.content == "PARSE" || socketMessageRef.current?.content == "WITH_PREVIOUS")} // 비활성화 적용
                ></textarea>
                <button className={"chat_sending"}>
                    { disabledButton ?
                        <img src={DisabledSearchIcon} alt={"search-icon.png"} style={{cursor: "no-drop"}}/>
                        : <img src={SearchIcon} alt={"search-icon.png"} onClick={() => sendRequest()} />
                    }
                </button>
            </section>
            <section className="privacy-policy">
                <p onClick={() => {navigate("/privacy-policy")}}>개인정보 처리 방침 확인하기</p>
            </section>
        </div>
    );
};

export default ChatMain;