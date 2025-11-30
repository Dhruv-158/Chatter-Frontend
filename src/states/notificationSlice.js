// src/states/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        // Unread message notifications per friend
        unreadNotifications: {}, // { friendId: count }
        
        // Last notification per friend
        lastNotification: {}, // { friendId: { message, timestamp, sender } }
        
        // Total unread count
        totalUnread: 0,
        
        // Notification settings
        settings: {
            enabled: true,
            sound: true,
            desktop: true,
        }
    },
    reducers: {
        // Add new message notification
        addNotification: (state, action) => {
            const { message, sender } = action.payload;
            const senderId = sender?._id || sender?.id || sender;
            
            if (!senderId) return;
            
            // Increment unread count for this friend
            if (!state.unreadNotifications[senderId]) {
                state.unreadNotifications[senderId] = 0;
            }
            state.unreadNotifications[senderId] += 1;
            
            // Store last notification
            state.lastNotification[senderId] = {
                message,
                sender,
                timestamp: new Date().toISOString(),
            };
            
            // Update total unread
            state.totalUnread = Object.values(state.unreadNotifications).reduce((sum, count) => sum + count, 0);
        },
        
        // Clear notifications for a specific friend
        clearNotification: (state, action) => {
            const friendId = action.payload;
            
            if (state.unreadNotifications[friendId]) {
                delete state.unreadNotifications[friendId];
                delete state.lastNotification[friendId];
                
                // Recalculate total
                state.totalUnread = Object.values(state.unreadNotifications).reduce((sum, count) => sum + count, 0);
            }
        },
        
        // Clear all notifications
        clearAllNotifications: (state) => {
            state.unreadNotifications = {};
            state.lastNotification = {};
            state.totalUnread = 0;
        },
        
        // Update notification settings
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
    },
});

export const {
    addNotification,
    clearNotification,
    clearAllNotifications,
    updateSettings,
} = notificationSlice.actions;

// Selectors
export const selectUnreadNotifications = (state) => state.notifications.unreadNotifications;
export const selectTotalUnread = (state) => state.notifications.totalUnread;
export const selectLastNotification = (friendId) => (state) => state.notifications.lastNotification[friendId];
export const selectNotificationSettings = (state) => state.notifications.settings;
export const selectUnreadForFriend = (friendId) => (state) => state.notifications.unreadNotifications[friendId] || 0;

export default notificationSlice.reducer;
