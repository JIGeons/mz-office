import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    dialog: {
      isShowingDialog: false,
      dialogType: null,
      dialogTitle: null,
      dialogContent: null,
      positiveFunction: null,
      negativeFunction: null,
      positiveButtonText: null,
      negativeButtonText: null,
    },
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
    reducers: {
        clearConstantState: (state) => {
            state.error = null;
            state.dialog = {
                isShowingDialog: false,
                dialogType: null,
                dialogTitle: null,
                dialogContent: null,
                positiveFunction: null,
                negativeFunction: null,
                positiveButtonText: null,
                negativeButtonText: null,
            };
            state.socket = {
                data: null,
            };
            state.commonError = {
                code: "",
                description: "",
            };
        },

        onShowDialog: (state, action) => {
            const {
                dialogType = null,
                dialogTitle = null,
                dialogContent = null,
                positiveFunction = null,
                negativeFunction = null,
                positiveButtonText = "확인",
                negativeButtonText = "취소",
            } = action.payload;
            state.dialog = {
                isShowingDialog: true,
                dialogType,
                dialogTitle,
                dialogContent,
                positiveFunction,
                negativeFunction,
                positiveButtonText,
                negativeButtonText,
            };
        },
        onHideDialog: (state) => {
            state.dialog = {
                isShowingDialog: false,
                dialogType: null,
                dialogTitle: null,
                dialogContent: null,
                positiveFunction: null,
                negativeFunction: null,
                positiveButtonText: null,
                negativeButtonText: null,
            };
        },
    },
    extraReducers: (builder) => {},
});

export const { clearConstantState, onShowDialog, onHideDialog } = constantSlice.actions;
export default constantSlice.reducer;