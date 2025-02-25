import React from 'react';

// Image
import noticeIcon from "../../assets/images/chat/ico_Error.png";
// CSS
import "../../styles/components/chat.css"

const ChatGuide = () => {
    return (
        <div className="chat-guide">
            <img src={ noticeIcon } alt="noticeIcon.png" />
            <div className={"chat-guide-content"}>
                <h1>문구 해석 또는 문장 작성 유형을 선택해주신 뒤에, 작성해주세요~</h1>
                <h2>[ 문구 해석 가이드라인 ]</h2>
                <span>Step 1. 해석할 내용을 자유롭게 입력해주세요!</span>

                <h2>[ 문장 작성 가이드라인 ]</h2>
                <span>Step 1. 메일을 보낼 것인지, 문자를 보낼 것인지 선택합니다.</span>
                <span>Step 2. 다른 분께 받은 메일을 입력할 것인지, 메일 입력을 하지 않을 것인지 선택합니다.</span>
                <span style={{paddingLeft: "36px"}}>( 다른 분께 받은 메일을 텍스트로 입력하면 더 정확한 답변을 받을 수 있어요! )</span>
                <span>Step 3. 메일 또는 문자의 유형을 선택합니다.</span>
                <span style={{paddingLeft: "36px"}}>( 받은 메일 또는 문자 미입력 할 시, 문의 내용을 텍스트로 입력합니다. )</span>
            </div>
        </div>
    );
}

export default ChatGuide;