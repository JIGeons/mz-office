import React from "react";
import {useNavigate} from "react-router-dom";

// Image
import mzLogo from "../../assets/images/mz_logo_white.png";
import email from "../../assets/images/email.png";

// CSS
import "../../styles/components/footer.css";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={ mzLogo } alt="mzLogo.png" />
                <div className="footer-left-text">
                    <h3 onClick={() => navigate("/privacy-policy")}>개인정보 처리방침</h3>
                    <h3 onClick={() => navigate("/terms-and-conditions")}>이용약관</h3>
                </div>
            </div>
            <div className="footer-right">
                <h4>
                    <img src={ email } alt="email.png" />
                    문의하기: hyunjeewang@gmail.com
                </h4>
                <div>
                    <p>서비스 제공자 : 비사이드 - 시닙사원 팀</p>
                    <p>&copy; 2025 시닙사원. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;