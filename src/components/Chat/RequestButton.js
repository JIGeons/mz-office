import React from 'react';

// Images
import explainButton from "../../assets/images/chat/btn_explain.png"
import writeButton from "../../assets/images/chat/btn_write.png"
import writeMailBtn from "../../assets/images/chat/ico_mail.png";
import writeMessageBtn from "../../assets/images/chat/ico_text.png";

const RequestButton = ({ inquiryType, setRequestType }) => {

    const requestButtonClick = (content) => {
        setRequestType("REQUEST_TYPE", content);
    }

    return (
        <div className="request-button">
            {/* inquiryType에 따라 보여줄 버튼 출력 */}
            { !inquiryType &&
                <div>
                    <img src={ explainButton } alt="explain.png" onClick={() => requestButtonClick('PARSE')} />
                    <img src={ writeButton } alt="write.png" onClick={() => requestButtonClick('GENERATE')} />
                </div>
            }
            { inquiryType === "REQUEST_TYPE" &&
                <div className="request-message-type">
                    <button className={"chat-write"} onClick={() => requestButtonClick('PARSE')}>
                        <img src={ writeMailBtn } alt="mail.png" />
                        <p>문자 작성</p>
                    </button>
                    <button className={"mail-write"} onClick={() => requestButtonClick('PARSE')}>
                        <img src={ writeMessageBtn } alt="text.png"/>
                        <p>메일 작성</p>
                    </button>
                </div>
            }
        </div>
    );
};

export default RequestButton;