import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getFriendsList } from '@/services/friendService';

/**
 * Custom hook for managing friends list
 * @param {Object} options - Hook options
 * @param {boolean} options.fetchOnMount - Whether to fetch friends on mount (default: true)
 * @returns {Object} Friends list state and actions
 */
export const useFriendsList = ({ fetchOnMount = true } = {}) => {
    // Get friends state from Redux
    const { friends, isLoadingFriends, friendsError } = useSelector((state) => state.friends);

    /**
     * Fetch friends list
     */
    const refetchFriends = useCallback(async () => {
        const result = await getFriendsList();
        return result;
    }, []);

    // Auto-fetch on mount if enabled
    useEffect(() => {
        if (fetchOnMount) {
            refetchFriends();
        }
    }, [fetchOnMount, refetchFriends]);

    return {
        // State
        friends,
        isLoading: isLoadingFriends,
        error: friendsError,
        hasFriends: friends && friends.length > 0,
        friendsCount: friends?.length || 0,
        
        // Actions
        refetchFriends,
    };
};
