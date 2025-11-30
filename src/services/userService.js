import API_URLS from "@/api/apiUrls";
import axiosClient from "@/api/axiosClient";
import store from "@/store/store";
import {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    updateUserProfile,
    uploadProfilePictureStart,
    uploadProfilePictureSuccess,
    uploadProfilePictureFailure,
} from "@/states/userSlice";

// ============================================
// FETCH USER PROFILE
// ============================================
export const fetchUserProfile = async () => {
    store.dispatch(fetchUserStart());
    try {
        const response = await axiosClient.get(API_URLS.USER_PROFILE);
        // Assuming response structure: { success: true, data: { user } }
        const userData = response.data?.data || response.data?.user || response.data;
        store.dispatch(fetchUserSuccess(userData));
        return { success: true, data: userData };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch profile";
        store.dispatch(fetchUserFailure(errorMessage));
        console.error("Error fetching user profile:", error);
        return { success: false, error: errorMessage };
    }
};

// ============================================
// UPDATE USER PROFILE (General info like name, bio, etc.)
// ============================================
export const updateUserProfileService = async (profileData) => {
    try {
        const response = await axiosClient.put(API_URLS.UPDATE_PROFILE, profileData);
        const userData = response.data?.data || response.data?.user || response.data;
        store.dispatch(updateUserProfile(userData));
        return { success: true, data: userData };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
        console.error("Error updating profile:", error);
        throw new Error(errorMessage);
    }
};

// ============================================
// ALTERNATIVE: Upload with Progress Tracking
// ============================================
export const changeProfilePictureWithProgress = async (file, onProgress) => {
    store.dispatch(uploadProfilePictureStart());
    try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        const response = await axiosClient.put(
            API_URLS.CHANGE_PROFILE_PICTURE, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    if (onProgress) {
                        onProgress(percentCompleted);
                    }
                }
            }
        );
        const profilePictureUrl = response.data?.data?.profilePicture || 
                                  response.data?.profilePicture;
        if (!profilePictureUrl) {
            throw new Error("Profile picture URL not found in response");
        }
        store.dispatch(uploadProfilePictureSuccess(profilePictureUrl));
        return { 
            success: true, 
            data: profilePictureUrl,
            message: "Profile picture updated successfully" 
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Failed to upload profile picture";
        store.dispatch(uploadProfilePictureFailure(errorMessage));
        console.error("Error uploading profile picture:", error);
        return { 
            success: false, 
            error: errorMessage 
        };
    }
};

