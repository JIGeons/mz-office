import axios from "axios";
import serverUrl from "../utils/ServerUrl";
import { store, persistor } from "./Store";
import {reissueNaverToken} from "./modules/AuthSlice";

const baseURL = serverUrl;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const userData = JSON.parse(localStorage.getItem("userData"));

        console.log("AccessToken: " , userData.accessToken)
        config.headers["Authorization"] = `Bearer ${userData.accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newTokens = await store.dispatch(reissueNaverToken());

                if (newTokens) {
                    const userData = JSON.parse(localStorage.getItem("userData"));
                    userData.accessToken = newTokens.accessToken;
                    userData.refreshToken = newTokens.refreshToken;

                    localStorage.setItem("userData", JSON.stringify(userData));

                    // 새 토큰으로 요청 재시도
                    originalRequest.headers["x-access-token"] = newTokens.accessToken;
                    originalRequest.headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error("토큰 갱신 실패, 로그아웃 처리", error);
                store.dispatch(reissueNaverToken());   // Redux 상태 초기화
                await persistor.purge();  // Redux Persist 데이터 삭제
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;