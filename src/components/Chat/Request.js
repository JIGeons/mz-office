import React from 'react';

// Utils
import { RequestType } from "../../utils/Enums";

// Images
import important from "../../assets/images/chat/ico_Error.png";
import important2 from "../../assets/images/chat/ico_guide@2x.png";
import important3 from "../../assets/images/chat/ico_guide@2x.png";
import step1 from "../../assets/images/chat/web_step1.png"
import step2 from "../../assets/images/chat/web_step2.png"
import step3 from "../../assets/images/chat/web_step3.png"
import mobileStep1 from "../../assets/images/chat/mobile_step1.png";
import mobileStep1x2 from "../../assets/images/chat/mobile_step1x2.png";
import mobileStep1x3 from "../../assets/images/chat/mobile_step1x3.png";
import mobileStep2 from "../../assets/images/chat/mobile_step2.png";
import mobileStep2x2 from "../../assets/images/chat/mobile_step2x2.png";
import mobileStep2x3 from "../../assets/images/chat/mobile_step2x3.png";
import mobileStep3 from "../../assets/images/chat/mobile_step3.png";
import mobileStep3x2 from "../../assets/images/chat/mobile_step3x2.png";
import mobileStep3x3 from "../../assets/images/chat/mobile_step3x3.png";
import mobileChatAiIcon from "../../assets/images/chat/ico_mobile_chat_ai.png";

// CSS
import "../../styles/components/chat.css"
import chatAiIcon from "../../assets/images/chat/chat_ai_icon.png";

const Request = ({ type, contentType, messageType, step }) => {
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
            title = `${requestType == "문자" ? "문자를" : "메일을"} 채팅 창에 텍스트로 입력해주세요!`;
            break;
        case "INPUT_TEXT":
            title = `${!requestType ? "해석을 원하는 문장을" : requestType == "문자" ? "문자를" : "메일을"} 채팅 창에 텍스트로 입력해주세요!`;
            break;
        default :
            if (!requestType) title = "받아보신 해석 내용에 만족하셨나요?";
            else title = `받아보신 ${requestType} 내용에 만족하셨나요?`
            break;
    }

    let stepImage = null;
    let stepImage2 = null;
    let stepImage3 = null;
    switch ( step ) {
        case "step_1":
            stepImage = isMobile ? mobileStep1 : step1;
            stepImage2 = isMobile ? mobileStep1x2 : step1;
            stepImage3 = isMobile ? mobileStep1x3 : step1;
            break;
        case "step_2":
            stepImage = isMobile ? mobileStep2 : step2;
            stepImage2 = isMobile ? mobileStep2x2 : step1;
            stepImage3 = isMobile ? mobileStep2x3 : step1;
            break;
        case "step_3":
            stepImage = isMobile ? mobileStep3 : step3;
            stepImage2 = isMobile ? mobileStep3x2 : step1;
            stepImage3 = isMobile ? mobileStep3x3 : step1;
            break;
        default:
            break;
    }

    if (type == "SENTENCE_GENERATION_TYPE") {
        if (messageType == "MESSAGE") {
            content = "<h1>[문자 요청 가이드]</h1>";

            switch ( contentType ) {
                case "CONGRATULATION":
                    content += "<br /><p><span class='bold'>승진, 창립기념일, 수상, 신제품</span> 등</p>" +
                        "<p><span class='bold'>경사의 유형</span>예시를 구체적으로 입력해주세요!</p><br />";
                    break;
                case "INQUIRY":
                    content += "<br /><p>부고, 사고, 기업 손실 등의 유형을 구체적으로 입력해주세요!</p><br />";
                    break;
                case "APPRECIATION":
                    content += "<br /><p><span class='bold'>거래처 협력, 직원 노력, 고객 감사</span> 등</p>" +
                        "<p>감사할 <span class='bold'>대상</span> 및 감사할 <span class='bold'>내용</span>에 대하여 구체적으로 입력해주세요!</p><br />";
                    break;
                case "APOLOGY":
                    content += "<br /><p><span class='bold'>일정 변경, 서비스 장애, 배송 지연</span> 등</p>" +
                        "<p>사과하는 <span class='bold'>대상 및 내용</span>에 대해 구체적으로 입력해주세요!</p>" +
                        "<p>입력해주신 내용을 바탕으로, 책임인정 / 해결방안 / 재발 방지 약속과 같은 사과 답변을 제공해드려요!</p>";
                    break;
                case "SCHEDULE_CONFIRMATION":
                    content += "<br /><p><span class='bold'>회의 일정, 출장 일정, 계약 일정</span> 등</p>" +
                        "<p>일정의 <span class='bold'>유형</span> 및 일정 <span class='bold'>날짜</span>를 입력해주세요!</p><br />";
                    break;
                case "ANNOUNCEMENT":
                    content += "<br /><p><span class='bold'>사내 공지, 고객 대상 안내, 시스템 점검 일정</span> 등</p>" +
                        "<p><span class='bold'>공지할 유형</span> 및 <span class='bold'>공지 시간 일자</span>에 대해 구체적으로 입력해주세요!</p><br />";
                    break;
                case "WORK_REQUEST":
                    content += "<br /><p><span class='bold'>자료 요청, 진행 상황 확인, 협조 요청</span> 등</p>" +
                        "<p><span class='bold'>요청할 유형</span> 및 <span class='bold'>시간 일자</span>에 대해 구체적으로 입력해주세요!</p><br />";
                    break;
                default:
                    break;
            }
        } else {
            content = "<h1>[메일 요청 가이드]</h1>";
            switch ( contentType ) {
                case "FEEDBACK_REQUEST":
                    content += "<br /><p><span class='bold'>제안서, 보고서, 디자인 시안 등에 대한 피드백 요청</span> 등</p>" +
                        "<p><span class='bold'>피드백의 유형</span> 및 피드백 요청 <span class='bold'>일자</span>를 구체적으로 입력해주세요!</p><br />";
                    break;
                case "REMINDER":
                    content += "<br /><p><span class='bold'>미팅 일정 리마인드, 마감 기한 안내, 응답 독촉 </span> 등</p>" +
                        "<p>리마인드 <span class='bold'>유형</span> 및 리마인드하고자 하는 <span class='bold'>일정</span>과 <span class='bold'>장소</span>가 있다면 구체적으로 입력해주세요!</p><br />";
                    break;
                case "THANK_YOU":
                    content += "<br /><p>감사할 <span class='bold'>대상</span> 및 감사할 <span class='bold'>내용</span>에 대하여 구체적으로 입력해주세요!</p><br />";
                    break;
                case "APOLOGY":
                    content += "<br /><p><span class='bold'>일정 변경, 서비스 장애, 배송 지연</span> 등</p>" +
                        "<p>사과하는 <span class='bold'>대상 및 내용</span>에 대해 구체적으로 입력해주세요!</p>" +
                        "<p>입력해주신 내용을 바탕으로, 책임인정 / 해결방안 / 재발 방지 약속과 같은 사과 답변을 제공해드려요!</p>";
                    break;
                case "GREETING":
                    content += "<br /><p><span class='bold'>새해 인사, 명절 인사, 신규 담당자 소개</span> 등</p>" +
                        "<p>인사의 <span class='bold'>유형</span> 및 인사하는 <span class='bold'>날짜</span>를 구체적으로 입력해주세요!</p><br />";
                    break;
                case "SUGGESTION":
                    content += "<br /><p><span class='bold'>업무 협업 제안, 신규 계약 제안, 솔루션 제안</span> 등</p>" +
                        "<p>제안할 <span class='bold'>유형</span>과 제안 <span class='bold'>대상</span>에 대해 구체적으로 입력해주세요!</p><br />";
                    break;
                default:
                    break;
            }
        }

        content += "<p>더 자세한 답변을 제공해드릴 수 있습니다!</p>";
    }

    return (
        <>
        {   step &&
            <div className="request-step">
                <img
                  className={"request-step-img"}
                  src={ stepImage }
                  srcSet={ isMobile ? `${stepImage2} 2x, ${stepImage3} 3x` : '' }
                  alt="stepImage.png" />
            </div>
        }
        <div className="request-component">
            { /* 모바일인 경우 chat 이미지를 보여줌 */
                (isMobile || type == "REQUEST_TYPE") && <img className={"chat-ai-icon"} src={mobileChatAiIcon} alt="mobile-chat-ai-icon.png" /> }
            {   type == "REQUEST_TYPE" &&
                <div className="request-choose-message-type">
                    <p><span>문자</span>와 <span>메일</span> 중에 유형을 작성해주세요!</p>
                </div>
            }
            {   (type == "INPUT_TEXT" || type == "AI_RESPONSE") &&
                <div className = "request">
                    <img
                      className="notice-image"
                      src={important}
                      srcSet={`${important2} 2x, ${important3} 3x`}
                      alt="important.png" />
                    <div className="request-content">
                        <h2>{ title }</h2>
                    </div>
                </div>
            }
            {   step && (type == "MESSAGE_TYPE" || type == "WITH_PREVIOUS" || type == "WITHOUT_PREVIOUS") &&
                <div className="request">
                    {   (type == "WITH_PREVIOUS" || type == "WITHOUT_PREVIOUS") &&
                        <>
                            <img
                              className="notice-image"
                              src={important}
                              srcSet={`${important2} 2x, ${important3} 3x`}
                              alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                            </div>
                        </>
                    }
                    {   type == "MESSAGE_TYPE" &&
                        <>
                            <img
                              className="notice-image"
                              src={important}
                              srcSet={`${important2} 2x, ${important3} 3x`}
                              alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                                <h3>{ content } </h3>
                                <span>{ subContent } </span>
                            </div>
                        </>
                    }
                </div>
            }
            {  type == "SENTENCE_GENERATION_TYPE" &&
                (   isMobile ?
                    <div className="request-component-guide">
                        <div className="chat-response-content" dangerouslySetInnerHTML={{__html: content}}>
                        </div>
                        <div className = "request">
                            <img
                              className="notice-image"
                              src={important}
                              srcSet={`${important2} 2x, ${important3} 3x`}
                              alt="important.png" />
                            <div className="request-content">
                                <h2>{ title }</h2>
                            </div>
                        </div>
                    </div>
                        :
                    <>
                        <img className={"chat-ai-icon"} src={ isMobile ? mobileChatAiIcon : chatAiIcon } alt="content.png" />
                        <div className="request-component-guide">
                            <div className="chat-guide" dangerouslySetInnerHTML={{__html: content}}>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
        </>
    );
}

export default Request;