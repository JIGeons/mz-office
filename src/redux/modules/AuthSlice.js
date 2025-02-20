import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApis from "../apis/auth_apis";

// 액션 정의
const AUTH_UNLINK_NAVER = "auth/unlinkNaver";
const AUTH_REISSUE_NAVER_TOKEN = "auth/reissueNaverToken";

// 네이버 계정 연동 해제 및 탈퇴 액션
export const unlinkNaver = createAsyncThunk(
    AUTH_UNLINK_NAVER,
    async ({}, { rejectWithValue}) => {
        try {
            return await authApis.unlinkNaver();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 네이버 계정 토큰 갱신 액션
export const reissueNaverToken = createAsyncThunk(
    AUTH_REISSUE_NAVER_TOKEN,
    async ({refreshToken}, { rejectWithValue }) => {
        try {
            return await authApis.onReissueNaverToken();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userData: null,
        sessionData: null,
        reissueData: null,
        error: null,
        loading: false,
    },
    reducers: {
        clearAuthState: (state) => {
            state.userData = null;
            state.sessionData = null;
            state.reissueData = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Naver 로그인 연결 해제
            .addCase(unlinkNaver.fulfilled, (state, action) => {
                state.userData = null;
                state.sessionData = null;
            })
            // Naver 로그인 토큰 갱신
            .addCase(reissueNaverToken.fulfilled, (state, action) => {
                state.reissueData = action.payload;
            })
    },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
