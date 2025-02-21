import React, { useState, useEffect } from "react";

import "../styles/components/sidebar.css"
import {useSelector} from "react-redux";
import NaverLogoutButton from "./NaverLogoutButton";

const Sidebar = ({ toggleSidebar }) => {
    // const {} = useSelector();   // chat 내용을 받아온다.
    //
    // useEffect(() => {
    //
    // }, []);

    return (
        <div className="sidebar">
            {/* 사이드바 닫기 버튼 */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ✖
            </button>
            <h1>챗봇</h1>
            <h2>오늘</h2>
            <h1>단어장</h1>
            <div className="logout_button">
                <NaverLogoutButton />
            </div>
        </div>
    );
}

export default Sidebar;