import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    socket: {
        data: null,
    },
    commonError: {
        code: "",
        description: "",
    },
};

// Redux Slice 생성
const constantSlice = createSlice({
    name: "constant",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

export const {} = constantSlice.actions;
export default constantSlice.reducer;