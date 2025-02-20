// 로그인 관련 apis 파일
import axiosInstance from "../AxiosInstance";
import serverUrl from "../../utils/ServerUrl";

// 로그인 요청
export const onSignIn = async (code) => {
    try {
        const response = await axiosInstance.get(`${serverUrl}/api/v1/auth/login/naver-callback?code=${code}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 로그아웃 요청
export const unlinkNaver = async() => {
    try {
        const response = await axiosInstance.post(`${serverUrl}/api/v1/auth/unlink-naver`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const onReissueNaverToken = async (refreshToken) => {
    try {
        const response = await axiosInstance.get(`${serverUrl}/api/v1/auth/refresh-token`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}