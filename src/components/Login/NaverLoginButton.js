import React, { useEffect } from "react";
import serverUrl from "../../utils/ServerUrl";

// Image
import naverLoginButton from "../../assets/images/login/naver_login_btn.png";

const naverClientId = process.env.NAVER_CLIENT_ID;
const webUrl = process.env.REACT_APP_MZ_OFFICE_WEB_URL;
// const webUrl ="http://localhost";
const naverCallbackUrl = `${webUrl}/naver-callback`;

const generateState = () => {
    return Math.random().toString(36).substr(2, 15); // ✅ 랜덤 state 생성 (CSRF 방지)
};

// console.log("callbackURL = ", naverCallbackUrl);

const NaverLoginButton = () => {
    const handleNaverLogin = () => {
        const state = Math.random().toString(36).substr(2, 15); // ✅ 랜덤 state 생성
        localStorage.setItem("naver_auth_state", state); // ✅ CSRF 방지를 위해 state 저장

        const NAVER_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code`
            + `&client_id=${naverClientId}`
            + `&redirect_uri=${naverCallbackUrl}`
            + `&state=${state}`;

        // ✅ 팝업 창으로 네이버 로그인 페이지 열기
        const popup = window.open(
            NAVER_LOGIN_URL,
            "NaverLogin",
            "width=600,height=800,scrollbars=yes"
        );

        // ✅ 팝업 창이 정상적으로 열렸는지 확인
        if (!popup) {
            alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
    };

    return (
        <button onClick={handleNaverLogin}>
            <img  height="67" src={naverLoginButton} alt="네이버 로그인" />
        </button>
    );
/*
    useEffect(() => {
        const state = Math.random().toString(36).substr(2, 15); // ✅ 랜덤 state 생성 (CSRF 방지)
        localStorage.setItem("naver_auth_state", state); // ✅ 로그인 시 저장 (나중에 검증용)

        // ✅ 네이버 로그인 초기화 (스크립트 로드 후 실행)
        if (window.naver) {
            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: naverClientId,
                callbackUrl: naverCallbackUrl,
                isPopup: true,  // ✅ 팝업 비활성화
                loginButton: { color: "green", type: 3, height: "70" },
                state: state,
                responseType: "code",
            });

            naverLogin.init();
        } else {
            console.error("네이버 SDK 로드 안됨");
        }
    }, []);

    return <div id="naverIdLogin" />; // 네이버 로그인 버튼 자동 생성
    */
};

export default NaverLoginButton;
