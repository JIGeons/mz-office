import React, { useState, useEffect } from 'react';

const ChatRequest = ({ setRequestType }) => {
    const [selectedType, setSelectedType] = useState(null);

    const buttonClick = (type) => {
        setSelectedType((prevType) => {
            const newType = prevType === type ? null : type;
            setRequestType(newType); // 부모 컴포넌트에 선택된 타입 전달
            return newType;
        });
    };

    useEffect(() => {
        console.log("Selected Type:", selectedType);
    }, [selectedType]);

    return (
        <div className="chat-request">
            <button
                className={`chat-request-button ${selectedType === "explain" ? "request-selected" : ""}`}
                onClick={() => buttonClick("explain")}
            >
                <h3>문구 해석</h3>
                <span>사수가 뭐라고 하는지 이해가 안돼 ㅠㅠ</span>
            </button>
            <button
                className={`chat-request-button ${selectedType === "write" ? "request-selected" : ""}`}
                onClick={() => buttonClick("write")}
            >
                <h3>문장 작성</h3>
                <span>타팀에 보낼 메일 및 문자를 부탁해!</span>
            </button>
        </div>
    );
};

export default ChatRequest;