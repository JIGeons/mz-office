import React from 'react';

// Image
import chatAiIcon from "../../assets/images/chat/chat_ai_icon.png";
import ChatGuide from "./ChatGuide";

const ChatResponse = ( isGuide ) => {
    return (
      <div className="chat-response">
          <img className={"chat-ai-icon"} src={ chatAiIcon } alt="content.png" />
          { isGuide && <ChatGuide /> }
      </div>
    );
}

export default ChatResponse;