import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import dogReducer from "./slices/dogSlice"

const store = configureStore({
    reducer: {
        auth: authReducer, 
        dog: dogReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;