import React, {useEffect, useState} from 'react';
import NaverLoginButton from "../components/Login/NaverLoginButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay, EffectFade, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

// CSS
import '../styles/login.css';

// images
import mzLogo from "../assets/images/mz_logo_black.png";
import mzOfficeImage from "../assets/images/login/mz-office-image.png"
import sectionBackground from "../assets/images/login/bg_mainright.png";
import sideImage1 from "../assets/images/login/login_side_img-1.png";
import sideImage2 from "../assets/images/login/login_side_img-2.png";
import sideImage3 from "../assets/images/login/login_side_img-3.png";

const sideImages = [sideImage1, sideImage2, sideImage3];
const mobileImages = [mzOfficeImage, sideImage1, sideImage2, sideImage3];

const Login = () => {
    const navigate = useNavigate();
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;

    // State 관리
    const [user, setUser] = useState(null); // 네이버 로그인 성공 시 사용자 정보 저장
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [images, setImages] = useState([...sideImages, sideImages[0]]); // 마지막에 첫 번째 이미지를 추가하여 자연스럽게 보이게 함
    const [isMobile, setIsMobile] = useState(false);

    // Redux State
    const { userData } = useSelector((state) => state.auth);

    // ComponentDidMount
    useEffect(() => {
        // ✅ 모바일 기기 확인 후 강제 리디렉트
        if (mobileRegex.test(userAgent)) {
            setIsMobile(true);
        }

        const Interval = setInterval(() => {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setIsTransitioning(true);
        }, 5000);

        return () => clearInterval(Interval);
    }, []);

    const handleNavigateChat = () => {
        const chatId = localStorage.getItem("chatId");
        if (chatId) {
            navigate("/chat?chatId=" + chatId);
        } else {
            navigate("/chat");
        }
    }

    return (
        <div className="login_container">
            { !isMobile &&
                <>
                <section className="login_inner_fir">
                    <img className="mz-logo" src={mzLogo} alt={"MZ-Office.logo"} />
                    <img className="mz-office" src={mzOfficeImage} alt="mz-office-image.png" />
                    <div className="naver-login">
                        <div class="speech-bubble">3초만에 시작하기</div>
                        <NaverLoginButton />
                        {/*<button*/}
                        {/*    className="move-to-mz-chat-btn"*/}
                        {/*    onClick={ handleNavigateChat }>*/}
                        {/*    서비스 바로가기*/}
                        {/*</button>*/}
                        <p><span style={{cursor: "pointer", textDecoration: "underline"}} onClick={() => { navigate("/terms-and-conditions") }}>이용약관</span> 및 <span style={{cursor: "pointer", textDecoration: "underline"}} onClick={() => {navigate("/privacy-policy")}}>개인정보 처리방침</span>에 동의하는 것으로 간주합니다.</p>
                    </div>
                </section>

                {/* 오른쪽 이미지 */}
                <section className="login_inner_sec">
                    <Swiper
                        className="swiper-container"
                        modules={[Autoplay, EffectFade]} // ✅ 모듈을 Swiper에 전달
                        slidesPerView={1}
                        effect="slide"
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                    >
                        {sideImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img className={`side-image-${index}`} src={img} alt={`side-image-${index}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
                </>
            }
            {   isMobile &&
                <section className="login_inner_fir">
                    <img className={"mz-logo-black"} src={mzLogo} alt="mz-office-image" />
                    <div className="naver-login-image">
                        <div className="naver-login-swiper">
                            <Swiper
                                className="swiper-container"
                                modules={[Autoplay, EffectFade, Pagination]} // ✅ 모듈을 Swiper에 전달
                                slidesPerView={1}
                                effect="slide"
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                loop={true}
                                touchEventsTarget="container"
                                allowTouchMove={false} // 터치 필요 없이 자동으로 변경
                                grabCursor={false}
                                pagination={{ clickable: false }} // ✅ Swiper 내장 페이지네이션 활성화
                            >
                                {mobileImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img className={`side-image-${index}`} src={img} alt={`side-image-${index}`} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="naver-login">
                        <div className="speech-bubble">3초만에 시작하기</div>
                        <NaverLoginButton/>
                        <p>Naver 로그인 시,
                            <span style={{cursor: "pointer", textDecoration: "underline"}} onClick={() => { navigate("/terms-and-conditions")}}>이용약관</span> 및 <span style={{cursor: "pointer", textDecoration: "underline"}} onClick={() => {navigate("/privacy-policy")}}>개인정보 처리방침</span>에 동의하는 것으로 간주합니다.</p>
                    </div>
                </section>
            }
        </div>
    );
};

export default Login;