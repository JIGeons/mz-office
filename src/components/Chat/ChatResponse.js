import React from 'react';
import ReactMarkdown from "react-markdown";

// Image
import chatAiIcon from "../../assets/images/chat/chat_ai_icon.png";
import mobileChatAiIcon from "../../assets/images/chat/ico_mobile_chat_ai.png";

// Component
import ChatGuide from "./ChatGuide";

const ChatResponse = ({isGuide, content} ) => {
    // console.log("isGuide: ", isGuide, ", content: ", content);
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
    let isMobile = false;

    // ✅ 모바일 기기 확인 후 강제 리디렉트
    if (mobileRegex.test(userAgent)) {
        isMobile = true;
    }

    const replaceContent = (content) => {
      return content
        .replace(/\n\n/g, "\n\n&nbsp;\n") // 두 줄 띄우기
        .replace(/\n/g, "  \n"); // 한 줄 띄우기 (마크다운에서 공백 두 개 + 개행)
      return content;
    }

    return (
      <div className="chat-response">
          <img className={"chat-ai-icon"} src={ isMobile ? mobileChatAiIcon : chatAiIcon } alt="content.png" />
          { isGuide && <ChatGuide /> }
          { content  &&
              <div className="chat-response-content"

              >
                  <ReactMarkdown>
                    { replaceContent(content) }
                  </ReactMarkdown>
              </div>
          }
      </div>
    );
}

export default ChatResponse;