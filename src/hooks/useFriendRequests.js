import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
    getPendingRequests, 
    acceptFriendRequest, 
    rejectFriendRequest 
} from '@/services/friendService';

/**
 * Custom hook for managing incoming friend requests
 * @param {Object} options - Hook options
 * @param {boolean} options.fetchOnMount - Whether to fetch requests on mount (default: true)
 * @returns {Object} Friend requests state and actions
 */
export const useFriendRequests = ({ fetchOnMount = true } = {}) => {
    // Get pending requests state from Redux
    const { 
        pendingRequests, 
        isLoadingPendingRequests, 
        pendingRequestsError,
        actionStatus,
        actionError 
    } = useSelector((state) => state.friends);

    /**
     * Fetch pending friend requests
     */
    const refetch = useCallback(async () => {
        const result = await getPendingRequests();
        return result;
    }, []);

    /**
     * Accept a friend request
     */
    const acceptRequest = useCallback(async (requestId) => {
        if (!requestId) {
            return { success: false, error: 'Request ID is required' };
        }

        const result = await acceptFriendRequest(requestId);
        
        // Refetch pending requests after successful acceptance
        if (result.success) {
            await refetch();
        }
        
        return result;
    }, [refetch]);

    /**
     * Reject a friend request
     */
    const rejectRequest = useCallback(async (requestId) => {
        if (!requestId) {
            return { success: false, error: 'Request ID is required' };
        }

        const result = await rejectFriendRequest(requestId);
        
        // Refetch pending requests after successful rejection
        if (result.success) {
            await refetch();
        }
        
        return result;
    }, [refetch]);

    // Auto-fetch on mount if enabled
    useEffect(() => {
        if (fetchOnMount) {
            refetch();
        }
    }, [fetchOnMount, refetch]);

    return {
        // State
        pendingRequests,
        isLoading: isLoadingPendingRequests,
        error: pendingRequestsError,
        hasRequests: pendingRequests && pendingRequests.length > 0,
        requestsCount: pendingRequests?.length || 0,
        actionStatus,
        actionError,
        
        // Actions
        acceptRequest,
        rejectRequest,
        refetch,
    };
};
