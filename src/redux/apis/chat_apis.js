// 로그인 관련 apis 파일
// import axiosInstance from "../AxiosInstance";
import axios from "axios";
import serverUrl from "../../utils/ServerUrl";

// 오늘 진행된 채팅 내역 조회
export const getTodayChatList = async () => {
    try {
        const response = await axiosInstance.get(`${serverUrl}/api/v1/chat/active`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// 최근 채팅 내역 조회
export const getRecentChatList = async () => {
    try {
        const response = await axiosInstance.get(`${serverUrl}/api/v1/chat/recent`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 채팅방 대화 조회
export const getChatDetail = async (chatId) => {
    try {
        const response = await axiosInstance.get(`${serverUrl}/api/v1/chat/${chatId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const deleteChatRoom = async (chatId) => {
    try {
        const response = await axios.delete(`${serverUrl}/api/v1/chat/${chatId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}