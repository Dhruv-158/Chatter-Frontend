import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Friends list
    friends: [],
    friendsStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    friendsError: null,

    // Pending requests (received)
    pendingRequests: [],
    pendingStatus: "idle",
    pendingError: null,

    // Sent requests
    sentRequests: [],
    sentStatus: "idle",
    sentError: null,

    // Search results
    searchResults: [],
    searchStatus: "idle",
    searchError: null,

    // Action status (send, accept, reject, remove)
    actionStatus: "idle",
    actionError: null,

    // Friendship status with specific user
    friendshipStatus: null, // 'friends' | 'request_sent' | 'request_received' | 'not_friends'
    friendshipStatusLoading: false,
};

const friendSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        // ========== SEARCH USERS ==========
        searchUsersStart(state) {
            state.searchStatus = "loading";
            state.searchError = null;
        },
        searchUsersSuccess(state, action) {
            state.searchResults = action.payload;
            state.searchStatus = "succeeded";
            state.searchError = null;
        },
        searchUsersFailure(state, action) {
            state.searchStatus = "failed";
            state.searchError = action.payload;
        },
        clearSearchResults(state) {
            state.searchResults = [];
            state.searchStatus = "idle";
            state.searchError = null;
        },

        // ========== GET FRIENDS LIST ==========
        getFriendsStart(state) {
            state.friendsStatus = "loading";
            state.friendsError = null;
        },
        getFriendsSuccess(state, action) {
            state.friends = action.payload;
            state.friendsStatus = "succeeded";
            state.friendsError = null;
        },
        getFriendsFailure(state, action) {
            state.friendsStatus = "failed";
            state.friendsError = action.payload;
        },

        // ========== GET PENDING REQUESTS ==========
        getPendingRequestsStart(state) {
            state.pendingStatus = "loading";
            state.pendingError = null;
        },
        getPendingRequestsSuccess(state, action) {
            state.pendingRequests = action.payload;
            state.pendingStatus = "succeeded";
            state.pendingError = null;
        },
        getPendingRequestsFailure(state, action) {
            state.pendingStatus = "failed";
            state.pendingError = action.payload;
        },

        // ========== GET SENT REQUESTS ==========
        getSentRequestsStart(state) {
            state.sentStatus = "loading";
            state.sentError = null;
        },
        getSentRequestsSuccess(state, action) {
            state.sentRequests = action.payload;
            state.sentStatus = "succeeded";
            state.sentError = null;
        },
        getSentRequestsFailure(state, action) {
            state.sentStatus = "failed";
            state.sentError = action.payload;
        },

        // ========== SEND FRIEND REQUEST ==========
        sendFriendRequestStart(state) {
            state.actionStatus = "loading";
            state.actionError = null;
        },
        sendFriendRequestSuccess(state, action) {
            // Just mark as succeeded - the hook will refetch data
            state.actionStatus = "succeeded";
            state.actionError = null;
        },
        sendFriendRequestFailure(state, action) {
            state.actionStatus = "failed";
            state.actionError = action.payload;
        },

        // ========== ACCEPT FRIEND REQUEST ==========
        acceptFriendRequestStart(state) {
            state.actionStatus = "loading";
            state.actionError = null;
        },
        acceptFriendRequestSuccess(state, action) {
            // Remove from pending requests using the requestId
            const requestId = action.payload;
            state.pendingRequests = state.pendingRequests.filter(
                req => req._id !== requestId
            );
            state.actionStatus = "succeeded";
            state.actionError = null;
        },
        acceptFriendRequestFailure(state, action) {
            state.actionStatus = "failed";
            state.actionError = action.payload;
        },

        // ========== REJECT FRIEND REQUEST ==========
        rejectFriendRequestStart(state) {
            state.actionStatus = "loading";
            state.actionError = null;
        },
        rejectFriendRequestSuccess(state, action) {
            // Remove from pending requests using the requestId
            const requestId = action.payload;
            state.pendingRequests = state.pendingRequests.filter(
                req => req._id !== requestId
            );
            state.actionStatus = "succeeded";
            state.actionError = null;
        },
        rejectFriendRequestFailure(state, action) {
            state.actionStatus = "failed";
            state.actionError = action.payload;
        },

        // ========== CANCEL FRIEND REQUEST ==========
        cancelFriendRequestStart(state) {
            state.actionStatus = "loading";
            state.actionError = null;
        },
        cancelFriendRequestSuccess(state, action) {
            // Remove from sent requests using the requestId
            const requestId = action.payload;
            state.sentRequests = state.sentRequests.filter(
                req => req._id !== requestId
            );
            state.actionStatus = "succeeded";
            state.actionError = null;
        },
        cancelFriendRequestFailure(state, action) {
            state.actionStatus = "failed";
            state.actionError = action.payload;
        },

        // ========== REMOVE FRIEND ==========
        removeFriendStart(state) {
            state.actionStatus = "loading";
            state.actionError = null;
        },
        removeFriendSuccess(state, action) {
            // Remove from friends list using the friendId
            const friendId = action.payload;
            state.friends = state.friends.filter(
                friend => friend._id !== friendId
            );
            state.actionStatus = "succeeded";
            state.actionError = null;
        },
        removeFriendFailure(state, action) {
            state.actionStatus = "failed";
            state.actionError = action.payload;
        },

        // ========== CHECK FRIENDSHIP STATUS ==========
        checkFriendshipStatusStart(state) {
            state.friendshipStatusLoading = true;
        },
        checkFriendshipStatusSuccess(state, action) {
            state.friendshipStatus = action.payload.status;
            state.friendshipStatusLoading = false;
        },
        checkFriendshipStatusFailure(state) {
            state.friendshipStatusLoading = false;
        },

        // ========== RESET STATES ==========
        resetActionStatus(state) {
            state.actionStatus = "idle";
            state.actionError = null;
        },
        resetFriendshipStatus(state) {
            state.friendshipStatus = null;
            state.friendshipStatusLoading = false;
        },
    },
});

// ============================================
// ACTIONS EXPORT
// ============================================
export const {
    // Search
    searchUsersStart,
    searchUsersSuccess,
    searchUsersFailure,
    clearSearchResults,
    // Friends
    getFriendsStart,
    getFriendsSuccess,
    getFriendsFailure,
    // Pending requests
    getPendingRequestsStart,
    getPendingRequestsSuccess,
    getPendingRequestsFailure,
    // Sent requests
    getSentRequestsStart,
    getSentRequestsSuccess,
    getSentRequestsFailure,
    // Send request
    sendFriendRequestStart,
    sendFriendRequestSuccess,
    sendFriendRequestFailure,
    // Accept request
    acceptFriendRequestStart,
    acceptFriendRequestSuccess,
    acceptFriendRequestFailure,
    // Reject request
    rejectFriendRequestStart,
    rejectFriendRequestSuccess,
    rejectFriendRequestFailure,
    // Cancel request
    cancelFriendRequestStart,
    cancelFriendRequestSuccess,
    cancelFriendRequestFailure,
    // Remove friend
    removeFriendStart,
    removeFriendSuccess,
    removeFriendFailure,
    // Check status
    checkFriendshipStatusStart,
    checkFriendshipStatusSuccess,
    checkFriendshipStatusFailure,
    // Reset
    resetActionStatus,
    resetFriendshipStatus,
} = friendSlice.actions;

export default friendSlice.reducer;

// ============================================
// SELECTORS
// ============================================

// Friends List Selectors
export const selectFriends = (state) => state.friends.friends;
export const selectFriendsStatus = (state) => state.friends.friendsStatus;
export const selectFriendsError = (state) => state.friends.friendsError;
export const selectFriendsCount = (state) => state.friends.friends.length;
export const selectIsFriendsLoading = (state) => 
    state.friends.friendsStatus === "loading";

// Pending Requests Selectors
export const selectPendingRequests = (state) => state.friends.pendingRequests;
export const selectPendingStatus = (state) => state.friends.pendingStatus;
export const selectPendingError = (state) => state.friends.pendingError;
export const selectPendingCount = (state) => state.friends.pendingRequests.length;
export const selectIsPendingLoading = (state) => 
    state.friends.pendingStatus === "loading";

// Sent Requests Selectors
export const selectSentRequests = (state) => state.friends.sentRequests;
export const selectSentStatus = (state) => state.friends.sentStatus;
export const selectSentError = (state) => state.friends.sentError;
export const selectSentCount = (state) => state.friends.sentRequests.length;
export const selectIsSentLoading = (state) => 
    state.friends.sentStatus === "loading";

// Search Selectors
export const selectSearchResults = (state) => state.friends.searchResults;
export const selectSearchStatus = (state) => state.friends.searchStatus;
export const selectSearchError = (state) => state.friends.searchError;
export const selectIsSearchLoading = (state) => 
    state.friends.searchStatus === "loading";
export const selectHasSearchResults = (state) => 
    state.friends.searchResults.length > 0;

// Action Status Selectors
export const selectActionStatus = (state) => state.friends.actionStatus;
export const selectActionError = (state) => state.friends.actionError;
export const selectIsActionLoading = (state) => 
    state.friends.actionStatus === "loading";
export const selectHasActionError = (state) => 
    state.friends.actionError !== null;

// Friendship Status Selectors
export const selectFriendshipStatus = (state) => state.friends.friendshipStatus;
export const selectFriendshipStatusLoading = (state) => 
    state.friends.friendshipStatusLoading;

// Derived Selectors
export const selectIsFriend = (userId) => (state) =>
    state.friends.friends.some(friend => friend._id === userId);

export const selectHasPendingRequest = (userId) => (state) =>
    state.friends.pendingRequests.some(req => req.sender._id === userId);

export const selectHasSentRequest = (userId) => (state) =>
    state.friends.sentRequests.some(req => req.receiver._id === userId);