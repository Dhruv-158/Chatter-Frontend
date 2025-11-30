import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginUser(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            // Store token in localStorage for persistence (using 'accessToken' as key)
            if (action.payload.token) {
                localStorage.setItem('accessToken', action.payload.token);
                console.log('✅ Token stored in localStorage');
                console.log('🔑 Token value:', action.payload.token.substring(0, 30) + '...');
            } else {
                console.error('❌ No token received in loginUser action');
            }
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logoutUser(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            // Remove tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});
export const { loginStart, loginUser, loginFailure, logoutUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
