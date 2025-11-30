import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPendingRequests } from '@/services/friendService';

/**
 * Custom hook for managing friend request notifications
 * @param {Object} options - Hook options
 * @param {number} options.refreshInterval - Auto-refresh interval in ms (default: 30000 - 30 seconds)
 * @param {boolean} options.enableAutoRefresh - Enable auto-refresh (default: false)
 * @returns {Object} Notification state and actions
 */
export const useFriendNotifications = ({ 
    refreshInterval = 30000, 
    enableAutoRefresh = false 
} = {}) => {
    const [lastChecked, setLastChecked] = useState(null);
    
    // Get pending requests from Redux
    const { 
        pendingRequests, 
        isLoadingPendingRequests 
    } = useSelector((state) => state.friends);

    /**
     * Fetch new friend requests
     */
    const checkNewRequests = useCallback(async () => {
        const result = await getPendingRequests();
        setLastChecked(new Date());
        return result;
    }, []);

    /**
     * Mark notifications as seen (visual indicator)
     */
    const [hasUnseenRequests, setHasUnseenRequests] = useState(false);
    
    const markAsSeen = useCallback(() => {
        setHasUnseenRequests(false);
    }, []);

    // Check if there are new requests since last check
    useEffect(() => {
        if (pendingRequests && pendingRequests.length > 0) {
            setHasUnseenRequests(true);
        }
    }, [pendingRequests]);

    // Auto-refresh friend requests at interval
    useEffect(() => {
        if (!enableAutoRefresh) return;

        const intervalId = setInterval(() => {
            checkNewRequests();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [enableAutoRefresh, refreshInterval, checkNewRequests]);

    // Calculate notification badge count
    const notificationCount = pendingRequests?.length || 0;
    const hasNotifications = notificationCount > 0;

    return {
        // State
        pendingRequests,
        isLoading: isLoadingPendingRequests,
        notificationCount,
        hasNotifications,
        hasUnseenRequests,
        lastChecked,
        
        // Actions
        checkNewRequests,
        markAsSeen,
        refresh: checkNewRequests,
    };
};
