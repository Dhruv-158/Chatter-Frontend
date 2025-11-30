import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
    sendFriendRequest, 
    removeFriend,
    resetActionStatusUtil 
} from '@/services/friendService';

/**
 * Custom hook for performing friend-related actions
 * @returns {Object} Friend action functions and status
 */
export const useFriendActions = () => {
    // Get action state from Redux
    const { 
        actionStatus, 
        actionError,
        isPerformingAction 
    } = useSelector((state) => state.friends);

    /**
     * Send a friend request to a user
     */
    const sendRequest = useCallback(async (userId) => {
        if (!userId) {
            return { success: false, error: 'User ID is required' };
        }

        const result = await sendFriendRequest(userId);
        return result;
    }, []);

    /**
     * Remove a friend (unfriend)
     */
    const unfriend = useCallback(async (friendId) => {
        if (!friendId) {
            return { success: false, error: 'Friend ID is required' };
        }

        const result = await removeFriend(friendId);
        return result;
    }, []);

    /**
     * Reset action status (clear success/error states)
     */
    const resetStatus = useCallback(() => {
        resetActionStatusUtil();
    }, []);

    return {
        // State
        actionStatus,
        actionError,
        isPerformingAction,
        isIdle: actionStatus === 'idle',
        isLoading: actionStatus === 'loading',
        isSuccess: actionStatus === 'succeeded',
        isError: actionStatus === 'failed',
        
        // Actions
        sendRequest,
        unfriend,
        resetStatus,
    };
};
