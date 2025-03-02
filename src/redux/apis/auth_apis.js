// 로그인 관련 apis 파일
import axiosInstance from "../AxiosInstance";
import serverUrl from "../../utils/ServerUrl";
import axios from "axios";

// 네이버 로그인 요청
export const linkNaver = async (code, state) => {
    try {
        const response = await axios.get(
            `${serverUrl}/api/v1/auth/login/naver-callback?`
                + `code=${code}&`
                + `state=${state}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 네이버 로그아웃 요청
export const unlinkNaver = async() => {
    try {
        const response = await axios.post(`${serverUrl}/api/v1/auth/unlink-naver`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const onReissueNaverToken = async (refreshToken) => {
    try {
        const response = await axios.get(`${serverUrl}/api/v1/auth/refresh-token`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}