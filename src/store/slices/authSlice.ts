import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../../api/authApi";
import { AuthState } from "../../types";

const storedAuthState = localStorage.getItem("isAuthenticated");
const initialState: AuthState = {
    isAuthenticated: storedAuthState ? JSON.parse(storedAuthState) : false,
    loading: false,
    error: null,
};


export const login = createAsyncThunk("auth/login", async ({ name, email }: { name: string; email: string }, { rejectWithValue }) => {
    try {
        await loginUser(name, email);
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        return true;
    } catch (error) {
        return rejectWithValue("Login failed.");
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem("isAuthenticated");
        await logoutUser();
        return false;
    } catch (error) {
        return rejectWithValue("Logout failed.");
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;
