import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as chat_apis from "../apis/chat_apis";

// 액션 정의
const GET_CHAT_LIST = "chat/getChatList";

// 네이버 계정 연동
export const getChatList = createAsyncThunk(
    GET_CHAT_LIST,
    async(_, {rejectWithValue}) => {
        try {
            return await chat_apis.getChatList();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    chatList: [],
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
            // chatList 연결
            .addCase(getChatList.fulfilled, (state, action) => {
                state.chatList = action.payload;
                state.error = null;
            })
            .addCase(getChatList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
