import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// API 호출
import * as AuthActions from "../redux/modules/AuthSlice";

const NaverCallback = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

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
        if (authState.userData) {
            console.log("Redux 업데이트 완료! 팝업 닫기");
            window.close();
        }
    }, [authState.userData]);

    return <div> 네이버 로그인 처리 중... </div>
}

export default NaverCallback;