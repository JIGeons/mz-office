import React, { useEffect } from "react";
import serverUrl from "../../utils/ServerUrl";

// Image
import naverLoginButton from "../../assets/images/login/naver_login_btn.png";

const naverClientId = process.env.REACT_APP_NAVER_CLIENT_ID;
const webUrl = process.env.REACT_APP_MZ_OFFICE_WEB_URL;
const naverCallbackUrl = `${webUrl}/naver-callback`;

console.log("callbackURL = ", naverCallbackUrl);

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
            return ;
        }

        const checkPopupClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopupClosed);
                console.log("팝업이 닫혔습니다. 로그인 상태 확인 중...");

                // localStorage에서 로그인 상태 확인
                const loginStatus = JSON.parse(localStorage.getItem("userData"));
                if (loginStatus?.accessToken) {
                    console.log("✅ 로그인 성공: ", loginStatus);
                    window.location.reload();  // 페이지 새로고침하여 로그인 반영
                } else {
                    console.log("❌ 로그인 실패 또는 취소됨");
                }
            }
        }, 1000);
    };

    return (
        <button onClick={handleNaverLogin}>
            <img  height="67" src={naverLoginButton} alt="네이버 로그인" />
        </button>
    );
};

export default NaverLoginButton;
