import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Image
import mobileImg from "../assets/images/mobile.png";

// CSS
import "../styles/mobile.css";

const Mobile = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
        if (mobileRegex.test(userAgent)) {
            setIsMobile(true);
        } else {
            navigate("/");  // 모바일이 아니면 루트로 이동
        }
    }, [navigate]);

    if (!isMobile) return null; // 리디렉트 되기 전에 화면 깜빡임 방지

    return (
        <div className="mobile">
            <div className="mobile-content">
                <img src={ mobileImg } alt="mobile.png" />
                <div className="mobile-inner">
                    <h1>더 큰 <span>PC화면</span>에서</h1>
                    <h1>서비스를 이용해주세요!</h1>
                </div>
                <p>PC로 접속 부탁드립니다.</p>
            </div>
        </div>
    );
}

export default Mobile;