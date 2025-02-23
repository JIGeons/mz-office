import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// API 호출
import * as AuthActions from "../redux/modules/AuthSlice";

const NaverCallback = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const [ loginProcess, setLoginProcess ] = useState(true);

    // ComponentDidMount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        console.log(`code: ${code}, state: ${state}`);

        // code와 state가 존재하는 경우에는 login API 호출
        if (code && state) {
            dispatch(AuthActions.linkNaver({ code, state }));
        }
    }, []);

    useEffect(() => {
        // Redux의 accessToken 값이 변경되면 팝업 닫기
        if (authState.userData.code == "SUCCESS") {
            // 네이버 로그인에 성공한 경우
            localStorage.setItem("accessToken", authState.userData.content);
            window.close();
        } else {
            // 네이버 로그인에 실패한 경우
            setLoginProcess(false);
        }
    }, [authState.userData]);

    return (
        <div>
            {
                loginProcess ?
                    <div> 네이버 로그인 처리 중... </div>
                    : <div className="login-fail">
                        네이버 로그인 실패
                    <button onClick={() => window.close()}> 확인 </button>
                    </div>
            }
        </div>
    );
}

export default NaverCallback;