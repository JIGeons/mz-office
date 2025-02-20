import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";

// Reducer
import authReducer from "./modules/AuthSlice";
import constantReducer from "./modules/ConstantSlice";

// Redux Persis 설정
const persistConfig = {
    key: "root",     // 저장소 키
    storage,        // localStorage 사용
};

// Redux Reducer 통합
const rootReduce = combineReducers({
    auth: authReducer,
    constant: constantReducer
});

// Persist 적용된 Reducer 생성
const persistedReducer = persistReducer(persistConfig, rootReduce);

// 환경 설정
const isDevelopment = process.env.NODE_ENV === "development";

// Redux Store 설정
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
                ignoredActionPaths: ["payload.config.adapter", "payload"],
                ignoredPaths: [
                    "constant.dialog.positiveFunction",
                    "constant.dialog.negativeFunction",
                    "constant.dialog.closeFunction",
                ],
            },
        }).concat(thunk),
    devTools: isDevelopment,
});

// Persistor 생성
const persistor = persistStore(store);

export { persistor, store };