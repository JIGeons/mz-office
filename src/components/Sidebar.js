import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

// Component
import NaverLogoutButton from "./NaverLogoutButton";

// Image
import sidebarToggle from "../asset/images/ico_leftmenu.png"

// CSS
import "../styles/components/sidebar.css"

const Sidebar = ({ toggleSidebar, isCollapsed }) => {
    const navigate = useNavigate();
    // const {} = useSelector();   // chat 내용을 받아온다.
    //
    // useEffect(() => {
    //
    // }, []);

    const handleLogout = () => {
        navigate("/login");
    }

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* 사이드바 닫기 버튼 */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <img src={sidebarToggle} alt={"sidebar-toggle.png"} />
            </button>
            { !isCollapsed &&
                <nav className="navigation-bar">
                    {/* 네비게이션 내용 */}
                    <ul>
                        <h1>MZ오피스 챗봇</h1>
                        <h2>최근일자 채팅 내역</h2>
                        <li><h3>2024-11-22</h3></li>
                        <li><h3>2024-11-22</h3></li>
                        <li><h3>2024-11-22</h3></li>
                    </ul>

                    <ul>
                        <h1>MZ오피스 단어장</h1>
                    </ul>

                    <div className="logout_button">
                        <NaverLogoutButton onLogout={handleLogout}/>
                    </div>
                </nav>

            }
        </div>
    );
}

export default Sidebar;