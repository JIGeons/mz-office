import React from 'react';

// CSS
import "../../styles/components/chat.css"
import chatAiIcon from "../../assets/images/chat/chat_ai_icon.png";
import ChatGuide from "./ChatGuide";
import ReactMarkdown from "react-markdown";

const ChatLoading = () => {
    return (
        <div className="chat-response">
            <div className="chat-loading">
                <div className="chat-ai-icon">
                    <div className="loading-spinner">
                        <div className="loading">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
                <div className="chat-response-content chat-loading-content">
                    AI의 응답을 기다리는 중입니다..!
                </div>
        </div>
    );
}

export default ChatLoading;