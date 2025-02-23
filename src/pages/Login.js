import React, { useState } from 'react';
import NaverLoginButton from "../components/NaverLoginButton";
import {useNavigate} from "react-router-dom";

// CSS
import '../styles/login.css';

// images
import cat from "../asset/images/cat.jpg";
import mzLogo from "../asset/images/logo_mz.png";

const Login = () => {
    const [user, setUser] = useState(null); // 네이버 로그인 성공 시 사용자 정보 저장
    const navigate = useNavigate();

    return (
        <div className="login_container">
            <section className="login_inner_fir">
                <img className="mz-logo" src={mzLogo} alt={"MZ-Office.logo"} />
                <div className="mz-office">
                    <h1>MZ 오피스</h1>
                </div>
                <div className="naver-login">
                    <NaverLoginButton />
                    <p>Naver 로그인 시, 이용약관 및 개인정보처리방침에 동의하는 것으로 간주합니다.</p>
                </div>
            </section>
            <section className="login_inner_sec">
                <img src={cat} alt="Cat" />
            </section>
        </div>
    );
};

export default Login;