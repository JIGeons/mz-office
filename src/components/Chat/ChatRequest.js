import React from 'react';

// Images
import userIcon from "../../assets/images/chat/user_icon.png";

const ChatRequest = ({ content }) => {

    return (
        <div className="chat-request">
            <img className={"chat-user-icon"} src={ userIcon } alt="userIcon.png" />
            <div className="chat-user-message">
                { content }
            </div>
        </div>
    );
};

export default ChatRequest;