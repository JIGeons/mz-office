// 로그인 관련 apis 파일
import axiosInstance from "../AxiosInstance";
import serverUrl from "../../utils/ServerUrl";
import axios from "axios";

// chat List 요청
export const getChatList = async () => {
    try {
        const response = await axiosInstance().get(`${serverUrl}/api/v1/chat/?`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};