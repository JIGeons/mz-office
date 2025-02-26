import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as chat_apis from "../apis/chat_apis";

// 액션 정의
const GET_TODAY_CHAT_LIST = "chat/getTodayChatList"
const GET_RECENT_CHAT_LIST = "chat/getRecentChatList";
const GET_CHAT_DETAIL = "chat/getChatDetail";
const DELETE_CHAT_ROOM = "chat/deleteChatRoom";

// 오늘 진행된 채팅 내역 조회
export const getTodayChatList = createAsyncThunk(
    GET_TODAY_CHAT_LIST,
    async(_, {rejectWithValue}) => {
        try {
            return await chat_apis.getTodayChatList();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// 최근 채팅 내역 조회
export const getRecentChatList = createAsyncThunk(
    GET_RECENT_CHAT_LIST,
    async(_, {rejectWithValue}) => {
        try {
            return await chat_apis.getRecentChatList();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// 채팅방 대화 조회
export const getChatDetail = createAsyncThunk(
    GET_CHAT_DETAIL,
    async({ chatId }, {rejectWithValue}) => {
        try {
            return await chat_apis.getChatDetail(chatId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// 채팅방 삭제
export const deleteChatRoom = createAsyncThunk(
    DELETE_CHAT_ROOM,
    async ({ chatId }, {rejectWithValue}) => {
        try {
            return await chat_apis.deleteChatRoom(chatId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    todayChatList: {},
    recentChatList: [],
    chatDetail: {},
    deleteChatRoom: {},
    error: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatState: (state) => {
            state.chatList = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 오늘 채팅 내역 조회
            .addCase(getTodayChatList.fulfilled, (state, action) => {
                state.todayChatList = action.payload;
                state.error = null;
            })
            .addCase(getTodayChatList.rejected, (state, action) => {
                state.loading = false;
                state.todayChatList = action.payload;
            })
            // 최근 채팅 내역 조회
            .addCase(getRecentChatList.fulfilled, (state, action) => {
                state.recentChatList = action.payload;
                state.error = null;
            })
            .addCase(getRecentChatList.rejected, (state, action) => {
                state.loading = false;
                state.recentChatList = action.payload;
            })
            // 채팅방 상세 대화 목록 조회
            .addCase(getChatDetail.fulfilled, (state, action) => {
                // chatId를 키로 저장
                const chatData = action.payload;
                state.chatDetail = chatData;
                state.error = null;
            })
            .addCase(getChatDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    type: "getChatDetail",
                    content: action.payload
                };
            })
            // 채팅방 삭제
            .addCase(deleteChatRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.deleteChatRoom = action.payload;
            })
            .addCase(deleteChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.deleteChatRoom = action.payload;
            })
    },
});

export const { clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
