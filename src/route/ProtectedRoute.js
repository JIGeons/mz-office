import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
    const location = useLocation();
    const user = useSelector(state => state.auth.userData); // Redux에서 사용자 정보 가져오기
    const isAuthenticated = user?.content;  // 로그인 여부 확인
    const userData = JSON.parse(localStorage.getItem("userData"));


    // console.log("accessToken", userData?.accessToken);
    // console.log("isAuthenticated", isAuthenticated);
    if (!userData?.accessToken) {
        // ✅ 로그인하지 않은 경우, 로그인 페이지로 리디렉트
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;  // 인증된 사용자만 해당 페이지를 렌더링
};

export default ProtectedRoute;