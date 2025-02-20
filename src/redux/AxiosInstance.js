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
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        config.headers["x-access-token"] = accessToken;
        config.headers["User-Token"] = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };

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
                    localStorage.setItem("accessToken", newTokens.accessToken);
                    localStorage.setItem("refreshToken", newTokens.refreshToken);

                    // 새 토큰으로 요청 재시도
                    originalRequest.headers["x-access-token"] = newTokens.accessToken;
                    originalRequest.headers["User-Token"] = {
                        accessToken: newTokens.accessToken,
                        refreshToken: newTokens.refreshToken,
                    };
                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error("토큰 갱신 실패, 로그아웃 처리", error);
                store.dispatch(reissueNaverToken);   // Redux 상태 초기화
                await persistor.purge();  // Redux Persist 데이터 삭제
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;