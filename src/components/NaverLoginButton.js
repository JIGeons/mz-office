import React, { useEffect } from "react";
import serverUrl from "../utils/ServerUrl";

const naverClientId = "1Q4oNjyFPspRBv9VEIjq";
const naverCallbackUrl = `${serverUrl}/api/v1/auth/login/naver-callback`;

const NaverLoginButton = () => {
    useEffect(() => {
        console.log("🚀 네이버 SDK 로딩 체크:", window.naver); // ✅ 콘솔 확인

        if (window.naver) {
            console.log("✅ 네이버 SDK 로드 완료!");
            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: naverClientId,
                callbackUrl: naverCallbackUrl,
                isPopup: true,  // ✅ 팝업 비활성화
                loginButton: { color: "green", type: 3, height: "50" },
            });
            naverLogin.init();
        } else {
            console.error("❌ 네이버 SDK가 로드되지 않았습니다.");
        }
    }, []);

    return <div id="naverIdLogin" />; // 네이버 로그인 버튼 자동 생성
};

export default NaverLoginButton;
