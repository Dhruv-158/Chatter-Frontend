import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    uploadStatus: "idle", // Separate status for profile picture upload
    uploadError: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Fetch User Actions
        fetchUserStart(state) {
            state.status = "loading";
            state.error = null;
        },
        fetchUserSuccess(state, action) {
            state.profile = action.payload;
            state.status = "succeeded";
            state.error = null;
        },
        fetchUserFailure(state, action) {
            state.status = "failed";
            state.error = action.payload;
        },
        // Update Profile Actions
        updateUserProfile(state, action) {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        // Profile Picture Upload Actions
        uploadProfilePictureStart(state) {
            state.uploadStatus = "loading";
            state.uploadError = null;
        },
        uploadProfilePictureSuccess(state, action) {
            if (state.profile) {
                state.profile.profilePicture = action.payload;
            }
            state.uploadStatus = "succeeded";
            state.uploadError = null;
        },
        uploadProfilePictureFailure(state, action) {
            state.uploadStatus = "failed";
            state.uploadError = action.payload;
        },
        resetUploadStatus(state) {
            state.uploadStatus = "idle";
            state.uploadError = null;
        },
    },
});

export const {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    updateUserProfile,
    uploadProfilePictureStart,
    uploadProfilePictureSuccess,
    uploadProfilePictureFailure,
    clearUserProfile,
    resetUploadStatus,
} = userSlice.actions;

export default userSlice.reducer;

// ============================================
// SELECTORS (Improved & Organized)
// ============================================

// Basic Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
// Upload-specific Selectors
export const selectUploadStatus = (state) => state.user.uploadStatus;
export const selectUploadError = (state) => state.user.uploadError;
// Derived Selectors (more useful)
export const selectIsUserLoading = (state) => state.user.status === "loading";
export const selectIsUploadLoading = (state) => state.user.uploadStatus === "loading";
export const selectHasUserError = (state) => state.user.error !== null;

// Profile Data Selectors
export const selectUserProfilePicture = (state) => 
    state.user.profile?.profilePicture || null;
export const selectUserName = (state) => 
    state.user.profile?.name || "";
export const selectUserEmail = (state) => 
    state.user.profile?.email || "";
export const selectUserId = (state) => 
    state.user.profile?._id || null;

// Full profile picture URL (if you need to construct it)
export const selectFullProfilePictureUrl = (state) => {
    const profilePicture = state.user.profile?.profilePicture;
    if (!profilePicture) return null;
    // If it's already a full URL, return it
    if (profilePicture.startsWith('http')) return profilePicture;
    // Otherwise construct full URL (remove trailing slash from baseUrl to avoid double slash)
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5500/api/').replace(/\/$/, '');
    return `${baseUrl}${profilePicture}`;
};

// Check if user is authenticated
export const selectIsAuthenticated = (state) => 
    state.user.profile !== null;