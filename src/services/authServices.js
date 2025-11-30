import API_URLS from "@/api/apiUrls";
import axiosClient from "@/api/axiosClient";
import store from "@/store/store";
import { loginUser } from "@/states/authSlice";

export const signupService = async (userData) => {
    try {
        const response = await axiosClient.post(API_URLS.signup, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginService = async (credentials) => {
    try {
        const response = await axiosClient.post(API_URLS.login, credentials);
        console.log('✅ Login response:', response.data);
        
        // Backend returns accessToken and refreshToken
        const { accessToken, refreshToken, user } = response.data.data;
        
        console.log('🔑 AccessToken received:', accessToken ? 'Yes' : 'No');
        console.log('🔄 RefreshToken received:', refreshToken ? 'Yes' : 'No');
        console.log('👤 User data:', user);
        
        // Dispatch login action to update Redux store
        store.dispatch(loginUser({
            user: user,
            token: accessToken, // Map accessToken to token
        }));
        
        console.log('📦 Redux store updated');
        console.log('💾 Token in localStorage:', localStorage.getItem('accessToken') ? 'Stored' : 'Not stored');
        
        // Also store refreshToken if needed
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
            console.log('💾 RefreshToken in localStorage: Stored');
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
};

// Refresh token service - gets new access token using refresh token
export const refreshTokenService = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        console.log('🔄 Attempting to refresh access token...');
        
        // Call refresh endpoint with refresh token
        const response = await axiosClient.post(API_URLS.refreshToken, {
            refreshToken: refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        console.log('✅ Token refresh successful');
        
        // Update access token in Redux store
        store.dispatch(loginUser({
            user: store.getState().auth.user, // Keep existing user data
            token: accessToken,
        }));
        
        // Update refresh token if backend sends a new one
        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        return accessToken;
    } catch (error) {
        console.error('❌ Token refresh failed:', error);
        // Clear tokens on refresh failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
    }
};
