import React from "react";
import { Link } from "react-router-dom";

// CSS
import "../../styles/components/notFount.css";

const NotFound = () => {
    return (
        <div className="container" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <h1 className="header">404</h1>
            <p className="text">죄송합니다. 요청한 페이지를 찾을 수 없습니다.</p>
            <Link to="/login" className="link">메인 페이지로 돌아가기</Link>
        </div>
    );
};

export default NotFound;
