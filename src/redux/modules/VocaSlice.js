import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as vocaApis from "../apis/voca_apis";

// 액션 정의
const GET_VOCA_QUIZ = "voca/getQuiz";
const GET_VOCA_WORD = "voca/getWord";

// 랜덤 퀴즈 불러오기
export const getVocaQuiz = createAsyncThunk(
    GET_VOCA_QUIZ,
    async(_, {rejectWithValue}) => {
        try {
            return await vocaApis.getVocaQuize();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// 랜덤 단어 불러오기
export const getVocaWord = createAsyncThunk(
    GET_VOCA_WORD,
    async(_, {rejectWithValue}) => {
        try {
            return await vocaApis.getVocaWord();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// Redux State 초기 설정
const initialState = {
    vocaQuiz: null,
    vocaWord: null,
    error: null,
}

const vocaSlice = createSlice({
    name: "voca",
    initialState,
    reducers: {
        clearVocaState: (state) => {
            state.vocaQuiz = null;
            state.vocaWord = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 랜덤 퀴즈 요청
            .addCase(getVocaQuiz.fulfilled, (state, action) => {
                state.vocaQuiz = action.payload;
                state.error = null;
            })
            .addCase(getVocaQuiz.rejected, (state, action) => {
                state.vocaQuiz = action.payload;
                // state.error = action.error;
            })
            // 랜덤 단어 요청
            .addCase(getVocaWord.fulfilled, (state, action) => {
                state.vocaWord = action.payload;
                state.error = null;
            })
            .addCase(getVocaWord.rejected, (state, action) => {
                state.vocaWord = action.payload;
                // state.error = action.error;
            })
    },
});

export const { clearVocaState } = vocaSlice.actions;
export default vocaSlice.reducer;
