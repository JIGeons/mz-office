import React from 'react';

// Images
import explainButton from "../../assets/images/chat/btn_explain.png"
import writeButton from "../../assets/images/chat/btn_write.png"
import writeMailBtn from "../../assets/images/chat/ico_mail.png";
import writeMessageBtn from "../../assets/images/chat/ico_text.png";

// Utils
import { GenerateType, RequestType } from "../../utils/Enums";

const RequestButton = ({ inquiryType, messageType, setRequestType }) => {

    let buttonType = [];

    if (inquiryType == "INPUT_METHOD") {
        buttonType = [`이전에 받은 ${RequestType(messageType)} 입력`, `이전에 받은 ${RequestType(messageType)} 없이 입력`];
    } else if (inquiryType == "SENTENCE_GENERATION_TYPE" && messageType == "EMAIL") {
        buttonType = ["FEEDBACK_REQUEST", "REMINDER", "THANK_YOU", "APOLOGY", "GREETING", "SUGGESTION", "FOLLOW_UP"];
    } else if (inquiryType == "SENTENCE_GENERATION_TYPE" && messageType == "MESSAGE") {
        buttonType = ["CONGRATULATION", "INQUIRY", "APPRECIATION", "APOLOGY", "SCHEDULE_CONFIRMATION", "ANNOUNCEMENT", "WORK_REQUEST", "FOLLOW_UP"]
    } else if (inquiryType == "AI_REQUEST") {
        buttonType = [`챗봇 메인으로`];
        if (messageType) {
            buttonType.push(`${RequestType(messageType)} 다시 문의`);
        } else {
            buttonType.push("해석 더 문의하기");
        }

    } else {

    }

    console.log("inquiryType : ", inquiryType, " messageType : ", messageType);
    console.log("buttonType : ", buttonType);

    const requestButtonClick = (inquiryType, content) => {
        setRequestType("REQUEST_TYPE", content);
    }

    return (
        <>
            {/* inquiryType에 따라 보여줄 버튼 출력 */}
            { !inquiryType &&
                <div className="request-parse-write">
                    <img src={ explainButton } alt="explain.png" onClick={() => requestButtonClick('PARSE')} />
                    <img src={ writeButton } alt="write.png" onClick={() => requestButtonClick('GENERATE')} />
                </div>
            }
            { inquiryType === "REQUEST_TYPE" &&
                <div className="request-message-type">
                    <button className={"chat-write"} onClick={() => requestButtonClick('MESSAGE')}>
                        <img src={ writeMailBtn } alt="mail.png" />
                        <p>문자 작성</p>
                    </button>
                    <button className={"mail-write"} onClick={() => requestButtonClick('MAIL')}>
                        <img src={ writeMessageBtn } alt="text.png"/>
                        <p>메일 작성</p>
                    </button>
                </div>
            }
            { inquiryType == "INPUT_METHOD" &&
                <div className="request-input-method">
                    <button className={"chat-input-prev"} onClick={() => requestButtonClick('WITH_PREVIOUS_EMAIL')}>
                        { buttonType[0] }
                    </button>
                    <button className={"chat-input-prev-none"} onClick={() => requestButtonClick('WITHOUT_PREVIOUS_EMAIL')}>
                        { buttonType[1] }
                    </button>
                </div>
            }
            { inquiryType == "SENTENCE_GENERATION_TYPE" && messageType == "MESSAGE" &&
                <div className="request-generation">
                    <div className="request-generation-type">
                        {
                            buttonType.map((content, index) => {
                                return (
                                    <>
                                        { index % 4 == 3 && <br /> }
                                        <button className={"chat-generation-type"} onClick={() => requestButtonClick(content)}>
                                            <p>{ GenerateType(content) }</p>
                                        </button>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            }
            { inquiryType == "SENTENCE_GENERATION_TYPE" && messageType == "EMAIL" &&
                <div className="request-generation">
                    <div className="request-generation-type">
                        {
                            buttonType.map((content, index) => {
                                return (
                                    <>
                                        { index % 4 == 3 && <br /> }
                                        <button className={"chat-generation-type"} onClick={() => requestButtonClick(content)}>
                                            <p>{ GenerateType(content) }</p>
                                        </button>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            }
            { inquiryType == "AI_REQUEST" &&
                <div className="request-input-method">
                    <button className={"chat-input-prev"} onClick={() => requestButtonClick('WITH_PREVIOUS_EMAIL')}>
                        {buttonType[0]}
                    </button>
                    <button className={"chat-input-prev-none"} onClick={() => requestButtonClick('WITHOUT_PREVIOUS_EMAIL')}>
                        {buttonType[1]}
                    </button>
                </div>
            }
        </>
    );
};

export default RequestButton;