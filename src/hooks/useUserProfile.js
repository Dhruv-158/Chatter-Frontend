import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    selectUserProfile,
    selectIsUserLoading,
    selectUserError,
    selectIsAuthenticated,
    selectFullProfilePictureUrl,
    selectUserName,
    selectUserEmail,
} from '@/states/userSlice';
import { fetchUserProfile } from '@/services/userService';

/**
 * Main hook to get user profile data
 * Automatically fetches profile if authenticated but profile is null
 * @param {boolean} autoFetch - Whether to automatically fetch profile (default: false)
 */
export const useUserProfile = (autoFetch = false) => {
    const profile = useSelector(selectUserProfile);
    const isLoading = useSelector(selectIsUserLoading);
    const error = useSelector(selectUserError);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        // Only fetch if autoFetch is enabled
        if (!autoFetch) return;
        
        const token = localStorage.getItem('token');
        // Fetch profile if we have a token but no profile data
        if (token && !profile && !isLoading) {
            fetchUserProfile();
        }
    }, [profile, isLoading, autoFetch]);

    return {
        profile,
        isLoading,
        error,
        isAuthenticated,
        refetch: fetchUserProfile,
    };
};

