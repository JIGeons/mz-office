import React from "react";
import {useNavigate} from "react-router-dom";

// Image
import menuIco from "../../assets/images/sidebar/ico_leftmenu.png";
import mzLogoWhite from "../../assets/images/mz_logo_white.png";
import closedIcon from "../../assets/images/sidebar/ico_closed.png";

// CSS
import "../../styles/common.css";

const MobileHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));

    return (
        <div className="mobile-header">
            { userData ?
                <img className="header-menu-icon" src={menuIco} alt="menuIco.png" onClick={toggleSidebar} /> :
                <img className="header-menu-icon" src={closedIcon} alt="closedIcon.png" onClick={() => { navigate("/login")}}/>
            }
            <img className="header-logo" src={mzLogoWhite} alt="mzLogoWhite.png" />
        </div>
    );
}

export default MobileHeader;