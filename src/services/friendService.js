import API_URLS from "@/api/apiUrls";
import axiosClient from "@/api/axiosClient";
import store from "@/store/store";
import {
    searchUsersStart,
    searchUsersSuccess,
    searchUsersFailure,
    getFriendsStart,
    getFriendsSuccess,
    getFriendsFailure,
    getPendingRequestsStart,
    getPendingRequestsSuccess,
    getPendingRequestsFailure,
    getSentRequestsStart,
    getSentRequestsSuccess,
    getSentRequestsFailure,
    sendFriendRequestStart,
    sendFriendRequestSuccess,
    sendFriendRequestFailure,
    acceptFriendRequestStart,
    acceptFriendRequestSuccess,
    acceptFriendRequestFailure,
    rejectFriendRequestStart,
    rejectFriendRequestSuccess,
    rejectFriendRequestFailure,
    cancelFriendRequestStart,
    cancelFriendRequestSuccess,
    cancelFriendRequestFailure,
    removeFriendStart,
    removeFriendSuccess,
    removeFriendFailure,
    checkFriendshipStatusStart,
    checkFriendshipStatusSuccess,
    checkFriendshipStatusFailure,
    clearSearchResults,
    resetActionStatus,
    resetFriendshipStatus,
} from "@/states/friendSlice";

/**
 * Search for users by query
 * @param {string} query - Search query
 * @returns {Promise<{success: boolean, data?: any, error?: string, cancelled?: boolean}>}
 */
export const searchUsers = async (query) => {
    try {
        store.dispatch(searchUsersStart());

        const response = await axiosClient.get(`${API_URLS.SEARCH_USERS}?query=${query}`);

        const users = response.data.data || response.data.users || response.data;
        console.log('Search users response:', response.data);
        console.log('Extracted users:', users);
        store.dispatch(searchUsersSuccess(users));

        return { success: true, data: users };
    } catch (error) {
        if (error.code === "ERR_CANCELED") {
            console.log("Search users request was cancelled (duplicate request)");
            return { success: false, error: "Request cancelled", cancelled: true };
        }

        const errorMessage = error.response?.data?.message || error.message || "Failed to search users";
        store.dispatch(searchUsersFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Clear user search results
 */
export const clearUserSearchResults = () => {
    store.dispatch(clearSearchResults());
};

/**
 * Get friends list
 * @returns {Promise<{success: boolean, data?: any, error?: string, cancelled?: boolean}>}
 */
export const getFriendsList = async () => {
    try {
        store.dispatch(getFriendsStart());

        const response = await axiosClient.get(API_URLS.GET_FRIENDS);

        const friends = response.data.data || response.data.friends || response.data;
        console.log('Get friends response:', response.data);
        console.log('Extracted friends:', friends);
        store.dispatch(getFriendsSuccess(friends));

        return { success: true, data: friends };
    } catch (error) {
        if (error.code === "ERR_CANCELED") {
            console.log("Get friends list request was cancelled (duplicate request)");
            return { success: false, error: "Request cancelled", cancelled: true };
        }

        const errorMessage = error.response?.data?.message || error.message || "Failed to get friends";
        store.dispatch(getFriendsFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Get pending friend requests (incoming)
 * @returns {Promise<{success: boolean, data?: any, error?: string, cancelled?: boolean}>}
 */
export const getPendingRequests = async () => {
    try {
        store.dispatch(getPendingRequestsStart());

        const response = await axiosClient.get(API_URLS.GET_PENDING_REQUESTS);

        const requests = response.data.data || response.data.requests || response.data;
        console.log('Get pending requests response:', response.data);
        console.log('Extracted requests:', requests);
        store.dispatch(getPendingRequestsSuccess(requests));

        return { success: true, data: requests };
    } catch (error) {
        if (error.code === "ERR_CANCELED") {
            console.log("Get pending requests was cancelled (duplicate request)");
            return { success: false, error: "Request cancelled", cancelled: true };
        }

        const errorMessage = error.response?.data?.message || error.message || "Failed to get pending requests";
        store.dispatch(getPendingRequestsFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Get sent friend requests (outgoing)
 * @returns {Promise<{success: boolean, data?: any, error?: string, cancelled?: boolean}>}
 */
export const getSentRequests = async () => {
    try {
        store.dispatch(getSentRequestsStart());

        const response = await axiosClient.get(API_URLS.GET_SENT_REQUESTS);

        const requests = response.data.data || response.data.requests || response.data;
        console.log('Get sent requests response:', response.data);
        console.log('Extracted requests:', requests);
        store.dispatch(getSentRequestsSuccess(requests));

        return { success: true, data: requests };
    } catch (error) {
        if (error.code === "ERR_CANCELED") {
            console.log("Get sent requests was cancelled (duplicate request)");
            return { success: false, error: "Request cancelled", cancelled: true };
        }

        const errorMessage = error.response?.data?.message || error.message || "Failed to get sent requests";
        store.dispatch(getSentRequestsFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Send a friend request
 * @param {string} userId - The user ID to send request to
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const sendFriendRequest = async (userId) => {
    try {
        store.dispatch(sendFriendRequestStart());

        const response = await axiosClient.post(`${API_URLS.SEND_FRIEND_REQUEST}/${userId}`);

        store.dispatch(sendFriendRequestSuccess());

        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to send friend request";
        store.dispatch(sendFriendRequestFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Accept a friend request
 * @param {string} requestId - The request ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const acceptFriendRequest = async (requestId) => {
    try {
        store.dispatch(acceptFriendRequestStart());

        const response = await axiosClient.put(`${API_URLS.ACCEPT_FRIEND_REQUEST}/${requestId}`);

        store.dispatch(acceptFriendRequestSuccess(requestId));

        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to accept friend request";
        store.dispatch(acceptFriendRequestFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Reject a friend request
 * @param {string} requestId - The request ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const rejectFriendRequest = async (requestId) => {
    try {
        store.dispatch(rejectFriendRequestStart());

        const response = await axiosClient.post(`${API_URLS.REJECT_FRIEND_REQUEST}/${requestId}`);

        store.dispatch(rejectFriendRequestSuccess(requestId));

        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to reject friend request";
        store.dispatch(rejectFriendRequestFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Cancel a sent friend request
 * @param {string} requestId - The request ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const cancelFriendRequest = async (requestId) => {
    try {
        store.dispatch(cancelFriendRequestStart());

        const response = await axiosClient.delete(`${API_URLS.CANCEL_FRIEND_REQUEST}/${requestId}`);

        store.dispatch(cancelFriendRequestSuccess(requestId));

        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to cancel friend request";
        store.dispatch(cancelFriendRequestFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Remove a friend
 * @param {string} friendId - The friend's user ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const removeFriend = async (friendId) => {
    try {
        store.dispatch(removeFriendStart());

        const response = await axiosClient.delete(`${API_URLS.REMOVE_FRIEND}/${friendId}`);

        store.dispatch(removeFriendSuccess(friendId));

        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to remove friend";
        store.dispatch(removeFriendFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Check friendship status with a user
 * @param {string} userId - The user ID to check status with
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const checkFriendshipStatus = async (userId) => {
    try {
        store.dispatch(checkFriendshipStatusStart());

        const response = await axiosClient.get(`${API_URLS.CHECK_FRIENDSHIP_STATUS}/${userId}`);

        console.log("Friendship status response:", response.data);

        const status = response.data.status || response.data;
        store.dispatch(checkFriendshipStatusSuccess(status));

        return { success: true, data: status };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to check friendship status";
        store.dispatch(checkFriendshipStatusFailure(errorMessage));

        return { success: false, error: errorMessage };
    }
};

/**
 * Reset action status (clear send/unfriend action states)
 */
export const resetActionStatusUtil = () => {
    store.dispatch(resetActionStatus());
};

/**
 * Reset friendship status (clear friendship check states)
 */
export const resetFriendshipStatusUtil = () => {
    store.dispatch(resetFriendshipStatus());
};
