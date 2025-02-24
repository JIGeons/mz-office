import React, {useEffect} from "react";

import authSlice from "../redux/modules/AuthSlice";

// Image
import MZLogoWhite from "../asset/images/MZ_logo_white.png";

// CSS
import "../styles/chatMain.css";
import {useSelector} from "react-redux";

const ChatMain = (() => {
    return (
        <div className="chat-main">
            <section className="mz-logo-white">
                <img src={MZLogoWhite} alt="MZ-logo-white.png" />
                <h1>ㅇㅇ님, 안녕하세요.</h1>
                <p>MZ오피스를 이용하여, 사내에서 문제를 해결해보세요!</p>
            </section>
            <section className="chatting_main">

            </section>
            <section className="chat_input">

            </section>
        </div>
    );
});

export default ChatMain;