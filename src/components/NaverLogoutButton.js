import React from "react";
import axios from "axios";

const naverClientId = "1Q4oNjyFPspRBv9VEIjq";
const naverSecret = "cNK9ATD9n3";

const NaverLogoutButton = ({ onLogout }) => {
    const handleNaverLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            await axios.get("https://nid.naver.com/oauth2.0/token", {
                params: {
                    grant_type: "delete",
                    client_id: naverClientId,
                    client_secret: naverSecret,
                    access_token: accessToken,
                    service_provider: "NAVER",
                },
            });

            // 토큰 삭제 & 로그인 상태 변경
            localStorage.removeItem("accessToken");
            console.log("logout!");
            onLogout();
        } catch (error) {
            console.error("네이버 로그아웃 실패: ", error);
        }
    };

    return (
        <button onClick={handleNaverLogout} style={{ backgroundColor: "#ff4b4b", color: "white" }}>
            네이버 로그아웃
        </button>
    );
};

export default NaverLogoutButton;