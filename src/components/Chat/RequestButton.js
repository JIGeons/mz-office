import React from 'react';

// Images
import explainButton from "../../assets/images/chat/btn_explain.png"
import writeButton from "../../assets/images/chat/btn_write.png"
import writeMailBtn from "../../assets/images/chat/ico_mail.png";
import writeMessageBtn from "../../assets/images/chat/ico_text.png";
import parseIcon from "../../assets/images/chat/parse_ico.png";
import writeIcon from "../../assets/images/chat/write_ico.png";
import parseIconx2 from "../../assets/images/chat/parse_icox2.png";
import writeIconx2 from "../../assets/images/chat/write_icox2.png";
import parseIconx3 from "../../assets/images/chat/parse_icox3.png";
import writeIconx3 from "../../assets/images/chat/write_icox3.png";

import webReIcon from "../../assets/images/chat/ico_web_re.png";
import webReIcon2 from "../../assets/images/chat/ico_web_re@2x.png";
import webReIcon3 from "../../assets/images/chat/ico_web_re@3x.png";
import webHomeIcon from "../../assets/images/chat/ico_web_home.png";
import webHomeIcon2 from "../../assets/images/chat/ico_web_home@2x.png";
import webHomeIcon3 from "../../assets/images/chat/ico_web_home@3x.png";
import reIcon from "../../assets/images/chat/ico_re.png";
import reIcon2 from "../../assets/images/chat/ico_mobile_re.png";
import reIcon3 from "../../assets/images/chat/ico_mobile_re@2x.png";
import homeIcon from "../../assets/images/chat/ico_home.png";
import homeIcon2 from "../../assets/images/chat/ico_mobile_home.png";
import homeIcon3 from "../../assets/images/chat/ico_mobile_home@2x.png";

// Utils
import { GenerateType, RequestType } from "../../utils/Enums";
import incorrectImgx2 from "../../assets/images/voca/img_incorrect@x2.png";
import incorrectImgx3 from "../../assets/images/voca/img_incorrect@x3.png";

const RequestButton = ({ inquiryType, content, messageType, user, setRequestType }) => {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
    let isMobile = false;

    // ✅ 모바일 기기 확인 후 강제 리디렉트
    if (mobileRegex.test(userAgent)) {
        isMobile = true;
    }


    let buttonType = [];

    if (inquiryType == "MESSAGE_TYPE") {
        buttonType = [`이전에 <span>받은 ${RequestType(messageType)}</span> 입력`, `이전에 받은 <span>${RequestType(messageType)} 없이</span> 입력`];
    } else if (inquiryType == "INPUT_METHOD"  && content == "WITHOUT_PREVIOUS" && messageType == "MAIL") {
        buttonType = ["FEEDBACK_REQUEST", "REMINDER", "THANK_YOU", "APOLOGY", "GREETING", "SUGGESTION"];
    } else if (inquiryType == "INPUT_METHOD" && content == "WITHOUT_PREVIOUS"  && messageType == "MESSAGE") {
        buttonType = ["CONGRATULATION", "INQUIRY", "APPRECIATION", "APOLOGY", "SCHEDULE_CONFIRMATION", "ANNOUNCEMENT", "WORK_REQUEST"]
    } else if (inquiryType == "AI_REQUEST" && user == "AI") {
        buttonType = [`챗봇 메인으로`];
        if (messageType) {
            buttonType.push(`${RequestType(messageType)} 작성 다시 문의하기`);
        } else {
            buttonType.push("해석 더 문의하기");
        }

    } else {

    }

    const requestButtonClick = (inquiryType, content) => {
        if (inquiryType == "AI_REQUEST") {
            if (content == "RESET") setRequestType("RESET", content);
            else setRequestType("RESET", content);
        } else {
            setRequestType(inquiryType, content);
        }
    }

    return (
        <>
            {/* inquiryType에 따라 보여줄 버튼 출력 */}
            { !inquiryType &&
                <div className="request-parse-write">
                    <button className="request-parse-write-button"  onClick={() => requestButtonClick("REQUEST_TYPE", 'PARSE')}>
                        <img
                          src={ parseIcon }
                          srcSet={`${parseIconx2} 2x, ${parseIconx3} 3x`}
                          alt="parse_ico.png"/>
                        <div className="request-parse-write-text">
                            <h3>문구 해석</h3>
                            <p>사수가 뭐라고 하는지 이해가 안돼 :(</p>
                        </div>
                    </button>
                    <button className="request-parse-write-button" onClick={() => requestButtonClick("REQUEST_TYPE", 'GENERATE')} >
                        <img
                          className="write-ico"
                          src={ writeIcon }
                          srcSet={`${writeIconx2} 2x, ${writeIconx3} 3x`}
                          alt="write_ico.png"/>
                        <div className="request-parse-write-text">
                            <h3>문장 작성</h3>
                            <p>타팀에 보낼 메일 및 문자를 부탁해!</p>
                        </div>
                    </button>
                    {/*<img src={ explainButton } alt="explain.png" onClick={() => requestButtonClick("REQUEST_TYPE", 'PARSE')} />*/}
                    {/*<img src={ writeButton } alt="write.png" onClick={() => requestButtonClick("REQUEST_TYPE", 'GENERATE')} />*/}
                </div>
            }
            { inquiryType === "REQUEST_TYPE" &&
                <div className="request-message-type">
                    <button className={"chat-write"} onClick={() => requestButtonClick("MESSAGE_TYPE", 'MESSAGE')}>
                        <img src={ writeMailBtn } alt="mail.png" />
                        <p>문자 작성</p>
                    </button>
                    <button className={"mail-write"} onClick={() => requestButtonClick("MESSAGE_TYPE", 'MAIL')}>
                        <img src={ writeMessageBtn } alt="text.png"/>
                        <p>메일 작성</p>
                    </button>
                </div>
            }
            { inquiryType == "MESSAGE_TYPE" &&
                <div className="request-input-method mobile-prev-div">
                    {/* 이전에 받은 */}
                    <button className={"chat-input-prev mobile-button"} onClick={() => requestButtonClick("INPUT_METHOD", 'WITH_PREVIOUS')}>
                        <p>이전에 <span className="prev-span">받은 {RequestType(messageType)}</span> 입력</p>
                    </button>
                    <button className={"chat-input-prev-none mobile-button"} onClick={() => requestButtonClick("INPUT_METHOD", 'WITHOUT_PREVIOUS')}>
                        <p>이전에 <span className="prev-none-span">받은 {RequestType(messageType)} 없이</span> 입력</p>
                    </button>
                </div>
            }
            { inquiryType == "INPUT_METHOD" && content == "WITHOUT_PREVIOUS" &&
                <div className="request-generation">
                    <div className="request-generation-type">
                        { /* 문자/메일 유형 선택 */
                            buttonType.map((content, index) => {
                                return (
                                    <button className={"chat-generation-type"} onClick={() => requestButtonClick("SENTENCE_GENERATION_TYPE", content)}>
                                        <p>{ GenerateType(content) }</p>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            }
            { inquiryType == "AI_REQUEST" && user == "AI" &&
                <div className="request-input-method">
                    {/* 챗봇 메인으로 */}
                    <button className={"chat-input-prev return-main"} onClick={() => requestButtonClick("AI_REQUEST", 'RESET')}>
                        <img
                          src={isMobile ? homeIcon : webHomeIcon}
                          srcSet={isMobile ?
                            `${homeIcon2} 2x, ${homeIcon3} 3x`
                            : `${webHomeIcon2} 2x, ${webHomeIcon3} 3x`}
                          alt="homeIcon.png" />
                        <p dangerouslySetInnerHTML={{__html: buttonType[0]}}></p>
                    </button>
                    {/* 더 문의 하기 */}
                    <button className={"chat-input-prev-none"} onClick={() => requestButtonClick("MORE_REQUEST", messageType)}>
                        <img
                          src={isMobile ? reIcon : webReIcon}
                          srcSet={isMobile ?
                            `${reIcon2} 2x, ${reIcon3} 3x`
                            : `${webReIcon2} 2x, ${webReIcon3} 3x`}
                          alt="homeIcon.png" />
                        <p dangerouslySetInnerHTML={{__html: buttonType[1]}}></p>
                    </button>
                </div>
            }
        </>
    );
};

export default RequestButton;