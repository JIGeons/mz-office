import React from 'react';
import ReactMarkdown from "react-markdown";

// Image
import chatAiIcon from "../../assets/images/chat/chat_ai_icon.png";
import ChatGuide from "./ChatGuide";

const ChatResponse = ({isGuide, content} ) => {
    // console.log("isGuide: ", isGuide, ", content: ", content);

    return (
      <div className="chat-response">
          <img className={"chat-ai-icon"} src={ chatAiIcon } alt="content.png" />
          { isGuide && <ChatGuide /> }
          { content  &&
              <div className="chat-response-content">
                  <ReactMarkdown>{ content }</ReactMarkdown>
              </div>
          }
      </div>
    );
}

export default ChatResponse;