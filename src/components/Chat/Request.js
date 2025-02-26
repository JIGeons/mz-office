import React from 'react';

// Images
import explainButton from "../../assets/images/chat/btn_explain.png"
import writeButton from "../../assets/images/chat/btn_write.png"

const Request = ({ setRequestType }) => {

    const requestButtonClick = (content) => {
        setRequestType("REQUEST_TYPE", content);
    }

    return (
        <div className="request">
            <img src={ explainButton } alt="explain.png" onClick={() => requestButtonClick('PARSE')} />
            <img src={ writeButton } alt="writeButton" onClick={() => requestButtonClick('GENERATE')} />
        </div>
    );
};

export default Request;