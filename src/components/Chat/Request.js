import React from 'react';

// Utils
import { RequestType } from "../../utils/Enums";

// Images
import important from "../../assets/images/chat/ico_Error.png";
import step1 from "../../assets/images/chat/web_steps1.png"
import step2 from "../../assets/images/chat/web_steps2.png"
import step3 from "../../assets/images/chat/web_steps3.png"
import mobileStep1 from "../../assets/images/chat/mobile_step1.png";
import mobileStep2 from "../../assets/images/chat/mobile_step2.png";
import mobileStep3 from "../../assets/images/chat/mobile_step3.png";

// CSS
import "../../styles/components/chat.css"

const Request = ({ type, messageType, step }) => {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
    let isMobile = false;

    let title = null;
    let content = null;
    let subContent = null;
    const requestType = RequestType(messageType);

    // ✅ 모바일 기기 확인 후 강제 리디렉트
    if (mobileRegex.test(userAgent)) {
        isMobile = true;
    }

    switch ( type ) {
        case "MESSAGE_TYPE":
            title = `이전에 받은 ${requestType == "문자" ? "문자가" : "메일이"} 있으신가요?`
            content = `받은 ${requestType == "문자" ? "문자를" : "메일을"} 입력 후 ${requestType} '유형'만 선택하면, 별도의 질문 입력 필요없이 답변해드려요!`
            subContent = `(단, 이전에 받은 ${requestType} 미입력시, 질문은 필수입니다.)`
            break;
        case "WITHOUT_PREVIOUS": // 이전에 받은 문자/메일을 붙여넣는 경우
            title = `${requestType} 유형을 선택하고, ${requestType} 내용을 붙여넣으면 자동으로 제목 및 내용을 알려드립니다.`;
            break;
        case "WITH_PREVIOUS":
            title = `${requestType == "문자" ? "문자를" : "메일을"} 채팅 창에 텍스트로 입력해주세요!`;
            break;
        case "SENTENCE_GENERATION_TYPE":
            title = `어떤 ${requestType} 작성을 원하세요?`
            break;
        case "INPUT_TEXT":
            title = `${!requestType ? "해석을 원하는 문장을" : requestType == "문자" ? "문자를" : "메일을"} 채팅 창에 텍스트로 입력해주세요!`;
            break;
        default :
            if (!requestType) title = "받아보신 해석 내용에 만족하셨나요?";
            else title = `받아보신 ${requestType} 내용에 만족하셨나요?`
            break;
        // default:
        //     break;
    }

    let stepImage = null;
    switch ( step ) {
        case "step_1":
            stepImage = isMobile ? mobileStep1 : step1;
            break;
        case "step_2":
            stepImage = isMobile ? mobileStep2 : step2;
            break;
        case "step_3":
            stepImage = isMobile ? mobileStep3 : step3;
            break;
        default:
            break;
    }

    return (
        <>
            {   step &&
                <div className="request-step">
                    <img className={"request-step-img"} src={ stepImage } alt="stepImage.png" />
                </div>
            }
            {   type == "REQUEST_TYPE" &&
                <div className="request-choose-message-type">
                    { !isMobile
                        && <h1><span>문자</span>와 <span>메일</span> 중에 유형을 작성해주세요! </h1>
                    }
                </div>
            }
            {   type == "INPUT_TEXT" &&
                <div className = "request">
                    <img className="notice-image" src={important} alt="important.png" />
                    <div className="request-content">
                        <h2>{ title }</h2>
                    </div>
                </div>
            }
            {   step && (type == "MESSAGE_TYPE" || type == "WITH_PREVIOUS" || type == "WITHOUT_PREVIOUS") &&
                <div className="request">
                    {   (type == "WITH_PREVIOUS" || type == "WITHOUT_PREVIOUS") &&
                        <>
                            <img className="notice-image" src={important} alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                            </div>
                        </>
                    }
                    {   type == "MESSAGE_TYPE" &&
                        <>
                            <img className="notice-image" src={important} alt="important.png" />
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