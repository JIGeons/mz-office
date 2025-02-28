import React, {useEffect, useState} from 'react';
import NaverLoginButton from "../components/Login/NaverLoginButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// CSS
import '../styles/login.css';

// images
import mzLogo from "../assets/images/MZ_logo_black.png";
import mzOfficeImage from "../assets/images/login/mz-office-image.png"
import sectionBackground from "../assets/images/login/bg_mainright.png";
import sideImage1 from "../assets/images/login/login_side_img-1.png";
import sideImage2 from "../assets/images/login/login_side_img-2.png";
import sideImage3 from "../assets/images/login/login_side_img-3.png";

const sideImages = [sideImage1, sideImage2, sideImage3];

const Login = () => {
    const navigate = useNavigate();

    // State 관리
    const [user, setUser] = useState(null); // 네이버 로그인 성공 시 사용자 정보 저장
    const [currentSideImageIndex, setCurrentSideImageIndex] = useState(0);

    // Redux State
    const { userData } = useSelector((state) => state.auth);

    // ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const accessToken = userData?.accessToken;

        // accessToken이 존재하는 경우 /chat 페이지로 이동
        if (accessToken) {
            navigate("/chat");
        }

        const Interval = setInterval(() => {
            setCurrentSideImageIndex(prevIndex => (prevIndex + 1) % sideImages.length);
        }, 5000);

        return () => clearInterval(Interval);
    }, []);

    return (
        <div className="login_container">
            <section className="login_inner_fir">
                <img className="mz-logo" src={mzLogo} alt={"MZ-Office.logo"} />
                <img className="mz-office" src={mzOfficeImage} alt="mz-office-image.png" />
                <div className="naver-login">
                    <NaverLoginButton />
                    <p>Naver 로그인 시, 이용약관 및 개인정보처리방침에 동의하는 것으로 간주합니다.</p>
                </div>
            </section>
            <section
                className="login_inner_sec"
                style={{
                    backgroundImage: `url(${sectionBackground})`,
                }}
            >
                {/* 5초마다 바뀌는 side 이미지 */}
                <img className={`side-image-${currentSideImageIndex}`} src={sideImages[currentSideImageIndex]} alt={"side-image-1"} />
            </section>
        </div>
    );
};

export default Login;