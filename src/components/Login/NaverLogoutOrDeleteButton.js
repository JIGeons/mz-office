import React from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import { clearAuthState } from "../../redux/modules/AuthSlice";
import {useNavigate} from "react-router-dom";

const NaverLogoutOrDeleteButton = ({ onLogout, isLogout }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNaverLogout = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const accessToken = userData?.accessToken;

            if (!accessToken) {
                console.error("No access token found");
                return ;
            }

            dispatch(clearAuthState());

            // 토큰 삭제 & 로그인 상태 변경
            localStorage.removeItem("userData");
            console.log("logout!");

            navigate("/login");
        } catch (error) {
            console.error("네이버 로그아웃 실패: ", error);
        }
    };

    return (
        <div>
            { isLogout ?
                <button onClick={handleNaverLogout} style={{ backgroundColor: "#ff4b4b", color: "white" }}>
                    로그아웃
                </button>
                :
                <button onClick={handleNaverLogout} style={{ backgroundColor: "#ff4b4b", color: "white" }}>
                    회원탈퇴
                </button>
            }
        </div>
    );
};

export default NaverLogoutOrDeleteButton;