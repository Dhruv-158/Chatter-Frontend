import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
    checkFriendshipStatus,
    resetFriendshipStatusUtil 
} from '@/services/friendService';

/**
 * Custom hook for checking friendship status with a specific user
 * @param {string} userId - The user ID to check friendship status with
 * @param {Object} options - Hook options
 * @param {boolean} options.fetchOnMount - Whether to fetch status on mount (default: true)
 * @returns {Object} Friendship status and actions
 */
export const useFriendshipStatus = (userId, { fetchOnMount = true } = {}) => {
    // Get friendship status from Redux
    const { 
        friendshipStatus, 
        isCheckingStatus, 
        friendshipStatusError 
    } = useSelector((state) => state.friends);

    /**
     * Check friendship status with the user
     */
    const checkStatus = useCallback(async () => {
        if (!userId) {
            return { success: false, error: 'User ID is required' };
        }

        const result = await checkFriendshipStatus(userId);
        return result;
    }, [userId]);

    /**
     * Reset friendship status
     */
    const resetStatus = useCallback(() => {
        resetFriendshipStatusUtil();
    }, []);

    // Auto-fetch on mount if enabled and userId is provided
    useEffect(() => {
        if (fetchOnMount && userId) {
            checkStatus();
        }

        // Cleanup: reset status when component unmounts or userId changes
        return () => {
            resetStatus();
        };
    }, [fetchOnMount, userId, checkStatus, resetStatus]);

    // Derive boolean flags from status
    const status = friendshipStatus?.status || 'none';
    const isFriend = status === 'friends';
    const isPending = status === 'pending'; // They sent you a request
    const isSent = status === 'sent'; // You sent them a request
    const isNone = status === 'none'; // No relationship

    return {
        // State
        status,
        friendshipStatus,
        isLoading: isCheckingStatus,
        error: friendshipStatusError,
        
        // Boolean helpers
        isFriend,
        isPending,
        isSent,
        isNone,
        canSendRequest: isNone,
        canAcceptRequest: isPending,
        canCancelRequest: isSent,
        canUnfriend: isFriend,
        
        // Actions
        checkStatus,
        resetStatus,
        refetch: checkStatus,
    };
};
