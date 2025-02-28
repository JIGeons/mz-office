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
    const [sessionList, setSessionList] = useState([]);
    const [socketMessage, setSocketMessage] = useState(isToday ? initialSocketMessage : null);
    const [showRequestButton, setShowRequestButton] = useState(true);

    // Redux State
    const chatState = useSelector((state) => state.chat);
    const { todayChatList, chatDetail } = useSelector((state) => state.chat);

    // useRef로 message Ref 정의
    const socketMessageRef = useRef(initialSocketMessage);

    const [_, setRender] = useState(0);    // 강제 리렌더링용 state

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (!userData) {
            console.error("❌ User data not found! 페이지를 새로고침합니다.");
            window.location.reload();   // 🔄 새로고침
            return ;
        }

        if (!paramChatId && !paramDate) {
            console.error("❌ paramChatId, Date data not found! 페이지를 새로고침합니다.");
            window.location.reload();   // 🔄 새로고침
            return ;
        }

        // API 호출 전 SessionList 초기화
        setSessionList([]);

        // date가 오늘인 경우 API 호출 및 소캣 연결
        if (paramDate === todayDate) {
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
        }

    /*
        // 오늘 메세지 조회
        if (chatId == "today") {
            // chatId가 today인 경우 오늘 채팅 내역이 없는 것이므로 initialSessionChat 으로 초기화
            if (chatState.todayChatList?.code == "SUCCESS") {
                setSessionList = initialMessage;
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
                            setSessionList = [...chatSessionList, initialSession];
                        } else {
                            // 오늘이 아닌 경우 그냥 출력한다.
                            setSessionList = chatSessionList;
                        }
                    } else {
                        console.log("리스트 조회 실패: ", response?.content);
                    }
                })
                .catch(err => console.log(err));
        }
    */
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
                    setSessionList([...chatSessionList, initialSession]);
                }
                // 오늘 채팅 목록이 없는 경우, 비어있는 질문으로 sessionListRef 초기화
                else {
                    setSessionList([initialSession]);
                }
            }
        } else {
            if (chatDetail.code == "SUCCESS") {
                console.log("chatDetail: ", chatDetail.content.chatSessionList);
                // date가 오늘이 아닌경우 chatDetail에서 채팅 목록 조회
                setChatId(chatDetail.content.chatId);
                setSessionList(chatDetail.content.chatSessionList);
                console.log("Updated sessionList: ", sessionList);
            } else {
                console.error("### chatDetail 응답 오류. (error: ", chatDetail);
                return;
            }
        }

    }, [ todayChatList, chatDetail, paramDate ]);




    // Chat Date를 불러오는 API 호출
    // useEffect(() => {
    //     if (!chatId || !date) return;
    //
    //     if (date === todayDate) {
    //         dispatch(chatActions.getTodayChatList())
    //     } else {
    //         dispatch(chatActions.getChatDetail({ chatId }));
    //     }
    // }, [chatId, date, dispatch, todayDate]);

    // Redux state가 변경되면 useRef에 저장


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
        const receivedMessage = JSON.parse(event.data);

        // 새로운 chat은 저장하기 위해 newChatList생성
        const newSessionList = sessionList.length > 0 ? sessionList.slice(0,-1) : [];
        const deepSessionList = JSON.parse(JSON.stringify(sessionList));
        const lastSession = deepSessionList[deepSessionList.length - 1];

        // 채팅으로 질문을 해야하는 과정에서는 버튼 비활성화
        if (socketMessage.content == "PARSE"
            || socketMessage.inquiryType == "SENTENCE_GENERATION_TYPE") {
            setShowRequestButton(false);
        }

        // content == "" 인 경우, 버튼 클릭에 대한 응답
        if (!receivedMessage.content || receivedMessage.content === "") {

            // chatSessionId가 존재하지 않는 경우, 처음 버튼을 누른 경우 -> initSessionMessage를 생성
            // InquiryType == REQUEST_TYPE
            if (!socketMessage.chatSessionId) {
                // chatId, chatSessionId 업데이트
                setSocketMessage(prev => ({
                    ...prev,
                    chatId: receivedMessage.chatId,
                    chatSessionId: receivedMessage.chatSessionId,
                }));

                // 신규 메세지 추가
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessage.inquiryType,
                    content: socketMessage.content,
                    sendAt: new Date(),
                }
                lastSession.chatSessionId = receivedMessage.chatSessionId;
                lastSession.createdAt = new Date();
                lastSession.messages = [newMessage];
            } else {
                const newMessage = {
                    sender: "USER",
                    inquiryType: socketMessage.inquiryType,
                    content: socketMessage.content,
                    sendAt: new Date(),
                }
                lastSession.messages = [...lastSession.messages, newMessage];
            }

            /*console.log("\n\n message: ", socketMessageRef.current);

            if (sessionList.length > 0) {
                const renewSessionMessage = sessionList[sessionList.length - 1];
                renewSessionMessage.chatSessionId = receivedMessage.chatSessionId;
                renewSessionMessage.createdAt = new Date();
                renewSessionMessage.messages = [{
                    sender: "USER",
                    inquiryType: socketMessageRef.current.inquiryType,
                    content: socketMessageRef.current.content,
                    sendAt: new Date(),
                }];
                sessionList[sessionList.length - 1] = renewSessionMessage;
            } else {
                setSessionList([initSessionMessage]);  // 빈 배열일 경우 추가
            }

            socketMessageRef.current.chatId = receivedMessage.chatId;
            socketMessageRef.current.chatSessionId = receivedMessage.chatSessionId;

            setSessionList([...sessionList, initSessionMessage]);
            setRender((prev) => prev + 1);  // 강제 리렌더링*/
        }
        // content가 존재하는 경우 질문에 대한 응답.
        else {
            const lastSessionChat = {
                ...sessionList[sessionList.length - 1],
                messages:[
                    ...sessionList[sessionList.length - 1].messages,
                    {   // 새로운 message 추가
                        sender: "AI",
                        inquiryType: receivedMessage.inquiryType,
                        content: receivedMessage.content,
                        sendAt: new Date(),
                    }
                ]
            }
            setSessionList([...newSessionList, lastSessionChat]);   // 응답을 추가한 Session을 추가한다.
            setSocketMessage(initialSocketMessage);
            setShowRequestButton(true); // AI 응답을 받으면 버튼 활성화
        }
    };

    // ✅ 3. 채팅 데이터를 불러오는 함수
    // const fetchChatData = async (chatId, date) => {
    //     try {
    //         const res = await dispatch(chatActions.getChatDetail({ chatId }));
    //         const response = res?.payload;
    //
    //         if (response?.code === "SUCCESS") {
    //             console.log("리스트 조회 성공: ", response?.content);
    //             const chatSessionList = response?.content?.chatSessionList;
    //
    //             sessionList = date === "today"
    //                 ? [...chatSessionList, initialSession] // 오늘인 경우
    //                 : chatSessionList; // 과거 데이터
    //         } else {
    //             console.log("리스트 조회 실패: ", response?.content);
    //         }
    //     } catch (error) {
    //         console.log("API 호출 오류: ", error);
    //     }
    // };



    // 텍스트를 입력한 경우 제출 버튼이 활성화되도록 설정
    const handlerOnChangeInput = (e) => {
        console.log("input: ", e.target.value);
        // socketMessage.content가 PARSE 이거나 inquiryType이 SENTENCE_GENERATION_TYPE인 경우
        // text를 전송해야 하므로 button을 활성화
        if (socketMessage.content == "PARSE"
            || socketMessage.inquiryType == "SENTENCE_GENERATION_TYPE") {
            if (e.target.value.trim() != "") {
                setDisAbledButton(false);
            } else {
                setDisAbledButton(true);
            }
        }
    }


    const setRequestType = (requestType, content) => {
        console.log("requestType: ", requestType);
        sendMessage(requestType, content);
    }

    // 메시지 전송 함수
    const sendMessage = (inquiryType, content) => {
        if (socket) {
            let newChatId = false;
            // sessionId가 없는 경우 -> 챗이 시작하기 전
            if (!socketMessage.chatSessionId) {
                const todayDate = getTodayDate();
                // 질문을 시작하는 날짜가 오늘이 아니면 새로운 채팅방을 생성
                if (paramDate != todayDate) {
                    newChatId = true;
                }
            }

            // 소캣 메세지 set
            setSocketMessage(prev => ({
                ...prev,
                chatId: newChatId ? null : socketMessage.chatId,
                chatSessionId: socketMessage.chatSessionId,
                inquiryType: inquiryType,
                content: content,
            }));

            console.log("\n\n\n\n보낸 메시지: ", JSON.stringify(socketMessage));
            socket.send(JSON.stringify(socketMessage));  // 서버로 메시지 전송
        }
    };

    const sendRequest = () => {
        // 이전 작업이 문장 해석 버튼 클릭이 경우
        if (socketMessageRef.current.content == "PARSE") {
            console.log("메세지 전송");
            const chatContent = document.getElementById("chat-input-content").value;
            document.getElementById("chat-input-content").value = "";

            sendMessage("AI_REQUEST", chatContent);
        }
    }

    console.log("=== Session List: ", sessionList);

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
                            return messages.messages.flatMap((msg, depth) => {
                                let messageType = null;
                                const msgComponent = [];

                                if (msg?.sender == "USER") {
                                    if (msg?.inquiryType == "REQUEST_TYPE") {
                                        if (msg?.content == "PARSE") {
                                            msgComponent.push(<ChatRequest content={"문구 해석"} key={`request-parse-${index}-${depth}`} />)
                                        } else {
                                            msgComponent.push(<ChatRequest content={"문장 작성"} key={`request-${index}-${depth}`} />);
                                        }
                                    }

                                    else if (msg?.inquiryType == "MESSAGE_TYPE") {
                                        messageType = msg?.content;
                                        return [
                                            <h1 key={`message-type-title-${index}-${depth}`}>문자와 메일 중에 유형을 작성해주세요!</h1>,
                                            msg?.content == "MESSAGE" ? (
                                                <ChatRequest content={"문자 작성"} key={`request-parse-${index}-${depth}`} />
                                            ) : (
                                                <ChatRequest content={"메일 작성"} key={`request-parse-${index}-${depth}`} />
                                            )
                                        ];
                                    }

                                    else if (msg?.inquiryType == "INPUT_METHOD") {
                                        if (msg?.content == "WITH_PREVIOUS_EMAIL") {
                                            return [<ChatRequest content={"메일 작성"} key={`request-parse-${index}-${depth}`} />];
                                        } else {
                                            return [<ChatRequest content={"메일 작성"} key={`request-parse-${index}-${depth}`} />];
                                        }
                                    }

                                    else if (msg?.inquiryType == "SENTENCE_GENERATION_TYPE") {
                                        // 문자 타입의 경우
                                        if (msg?.content == "CONGRATULATION") {
                                            return [<ChatRequest content={"경사"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "INQUIRY") {
                                            return [<ChatRequest content={"조사"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "APPRECIATION") {
                                            return [<ChatRequest content={"감사"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "APOLOGY") {
                                            return [<ChatRequest content={"사과"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "SCHEDULE_CONFIRMATION") {
                                            return [<ChatRequest content={"일정 확인"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "ANNOUNCEMENT") {
                                            return [<ChatRequest content={"공지"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "WORK_REQUEST") {
                                            return [<ChatRequest content={"업무 요청"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "FOLLOW_UP") {
                                            return [<ChatRequest content={"팔로우업"} key={`request-parse-${index}-${depth}`} />];
                                        }
                                        // 메일 작성의 경우
                                        else if (msg?.content == "FEEDBACK_REQUEST") {
                                            return [<ChatRequest content={"피드백 요청"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "REMINDER") {
                                            return [<ChatRequest content={"리마인딩 알림"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "THANK_YOU") {
                                            return [<ChatRequest content={"감사"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "APOLOGY") {
                                            return [<ChatRequest content={"사과"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "GREETING") {
                                            return [<ChatRequest content={"인사"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "SUGGESTION") {
                                            return [<ChatRequest content={"제안"} key={`request-parse-${index}-${depth}`} />];
                                        } else if (msg?.content == "FOLLOW_UP") {
                                            return [<ChatRequest content={"팔로업"} key={`request-parse-${index}-${depth}`} />];
                                        }
                                    }
                                } else if (msg?.sender == "AI") {
                                    return [<ChatResponse message={msg} key={`response-${index}-${depth}`} />];
                                }

                                msgComponent.push(<Request type={"MESSAGE_TYPE"} messageType={messageType} />);
                                // 질문 컴포넌트 없이 출력
                                if (msg?.content == "PARSE") {
                                    return msgComponent;
                                }
                                // 질문 컴포넌트 추가 후 출력
                                msgComponent.push(<Request type={msg?.inquiryType} messageType={messageType} />);
                                return msgComponent;
                            });

                            // SocketMessage에 따라 버튼 출력
                            if (showRequestButton && socketMessage) {
                                return [<RequestButton inquiryType={socketMessage.inquiryType} setRequestType={setRequestType} key={`request-${index}`} />];
                            }
                        })
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