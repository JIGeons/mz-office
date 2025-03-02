// 로그인 관련 apis 파일
// import axiosInstance from "../AxiosInstance";
import axios from "axios";
import serverUrl from "../../utils/ServerUrl";

// 단어 퀴즈 요청
export const getVocaQuize = async () => {
    try {
        const response = await axios.get(`${serverUrl}/api/v1/vocabulary/quiz`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// 단어 요청
export const getVocaWord = async () => {
    try {
        const response = await axios.get(`${serverUrl}/api/v1/vocabulary/word`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}