import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
    getSentRequests, 
    cancelFriendRequest 
} from '@/services/friendService';

/**
 * Custom hook for managing sent friend requests (outgoing)
 * @param {Object} options - Hook options
 * @param {boolean} options.fetchOnMount - Whether to fetch requests on mount (default: true)
 * @returns {Object} Sent requests state and actions
 */
export const useSentRequests = ({ fetchOnMount = true } = {}) => {
    // Get sent requests state from Redux
    const { 
        sentRequests, 
        isLoadingSentRequests, 
        sentRequestsError,
        actionStatus,
        actionError 
    } = useSelector((state) => state.friends);

    /**
     * Fetch sent friend requests
     */
    const refetch = useCallback(async () => {
        const result = await getSentRequests();
        return result;
    }, []);

    /**
     * Cancel a sent friend request
     */
    const cancelRequest = useCallback(async (requestId) => {
        if (!requestId) {
            return { success: false, error: 'Request ID is required' };
        }

        const result = await cancelFriendRequest(requestId);
        
        // Refetch sent requests after successful cancellation
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
        sentRequests,
        isLoading: isLoadingSentRequests,
        error: sentRequestsError,
        hasRequests: sentRequests && sentRequests.length > 0,
        requestsCount: sentRequests?.length || 0,
        actionStatus,
        actionError,
        
        // Actions
        cancelRequest,
        refetch,
    };
};
