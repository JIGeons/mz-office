import React from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import { clearAuthState } from "../redux/modules/AuthSlice";

const NaverLogoutButton = ({ onLogout }) => {
    const dispatch = useDispatch();

    const handleNaverLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            dispatch(clearAuthState());

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