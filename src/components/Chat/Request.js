import React from 'react';

// Images
import important from "../../assets/images/chat/ico_Error.png";

// CSS
import "../../styles/components/chat.css"

const Request = ({ type, messageType }) => {
    console.log("type : ", type, " messageType : ", messageType, "");
    let title = null;
    let content = null;
    let subContent = null;

    switch ( type ) {
        case "INPUT_METHOD":
            title = `이전에 받은 ${messageType}이 있으신가요?`
            content = `받은 메일을 입력 후 ${messageType} '유형'만 선택하면, 별도의 질문 입력 필요없이 답변해드려요!`
            subContent = `(단, 이전에 받은 ${messageType} 미입력시, 질문은 필수입니다.)`
            break;
        case "WITH_PREVIOUS_EMAIL": // 이전에 받은 문자/메일을 붙여넣는 경우
            title = `${messageType} 내용을 붙여넣고, ${messageType} 유형을 선택하면 자동으로 제목 및 내용을 알려드립니다.\n${messageType} 내용없이 ${messageType} 유형을 선택하면 상황을 설명해주세요~`
            break;
        case "WITHOUT_PREVIOUS_EMAIL":
            title = `${messageType}을 채팅 창에 텍스트로 입력해주세요!`;
            break;
        case "SENTENCE_GENERATION_TYPE":
            title = `어떤 ${messageType} 작성을 원하세요?`
            break;
        case "AI_REQUEST":
            if (!messageType) title = "받아보신 해석 내용에 만족하셨나요?";
            else title = `받아보신 ${messageType} 내용에 만족하셨나요?`
            break;
        default:
            break;
    }
    return (
        <>
            {   type == "MESSAGE_TYPE" &&
                <div className="request-choose-message-type">
                    <h1><span>문자</span>와 <span>메일</span> 중에 유형을 작성해주세요! </h1>
                </div>
            }
            {   type != "MESSAGE_TYPE" &&
                <div className="request">
                    {   type != "INPUT_METHOD" &&
                        <>
                            <img src={important} alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                            </div>
                        </>
                    }
                    {   type == "INPUT_METHOD" &&
                        <>
                            <img src={important} alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                                <h3>{ content } </h3>
                                <span>{ subContent } </span>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    );
}

export default Request;