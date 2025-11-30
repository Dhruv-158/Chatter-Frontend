import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        // Conversations list (for sidebar)
        conversations: [],
        
        // Messages for active chat
        messages: [],
        
        // Active conversation (friendId from URL)
        activeConversationId: null,
        
        // Active friend data (so we have their info even with 0 messages)
        activeFriend: null,
        
        // Loading states
        isLoading: false,
        isSending: false,
        uploadProgress: 0,
        
        // Pagination
        hasMoreMessages: true,
        currentPage: 1,
        
        // Online status tracking
        onlineUsers: {}, // { userId: true/false }
        
        // Typing indicators
        typingUsers: {}, // { userId: { isTyping: true, username: 'John' } }
    },
    reducers: {
        // ========================================
        // CONVERSATIONS
        // ========================================
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        
        updateConversation: (state, action) => {
            const { friendId, updates } = action.payload;
            const index = state.conversations.findIndex(
                conv => conv.friend._id === friendId || conv.friend.id === friendId
            );
            if (index !== -1) {
                state.conversations[index] = { 
                    ...state.conversations[index], 
                    ...updates 
                };
            }
        },

        // ========================================
        // MESSAGES
        // ========================================
        setMessages: (state, action) => {
            state.messages = action.payload;
            
            // If we don't have activeFriend yet but have messages, extract friend data
            if (!state.activeFriend && Array.isArray(action.payload) && action.payload.length > 0) {
                const firstMessage = action.payload[0];
                const senderData = typeof firstMessage.sender === 'object' ? firstMessage.sender : null;
                const senderId = senderData?._id || firstMessage.sender;
                const receiverData = typeof firstMessage.receiver === 'object' ? firstMessage.receiver : null;
                const receiverId = receiverData?._id || firstMessage.receiver;
                
                if (state.activeConversationId) {
                    if (senderId === state.activeConversationId && senderData) {
                        state.activeFriend = senderData;
                    } else if (receiverId === state.activeConversationId && receiverData) {
                        state.activeFriend = receiverData;
                    }
                }
            }
        },
        
        addMessage: (state, action) => {
            const newMessage = action.payload;
            
            if (!Array.isArray(state.messages)) {
                state.messages = [];
            }
            
            // Avoid duplicates
            if (!state.messages.find(msg => msg._id === newMessage._id)) {
                state.messages.push(newMessage);
                state.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                // Extract sender and receiver data
                const senderData = typeof newMessage.sender === 'object' ? newMessage.sender : null;
                const senderId = senderData?._id || newMessage.sender;
                const receiverData = typeof newMessage.receiver === 'object' ? newMessage.receiver : null;
                const receiverId = receiverData?._id || newMessage.receiver;
                
                // Determine the friend
                let friendData = null;
                let friendId = null;
                
                if (state.activeConversationId) {
                    if (senderId === state.activeConversationId) {
                        friendData = senderData;
                        friendId = senderId;
                    } else if (receiverId === state.activeConversationId) {
                        friendData = receiverData;
                        friendId = receiverId;
                    }
                }
                
                if (!friendData && state.activeFriend) {
                    friendData = state.activeFriend;
                    friendId = state.activeFriend._id || state.activeFriend.id;
                }
                
                if (!friendData) {
                    if (senderData && senderData._id) {
                        friendData = senderData;
                        friendId = senderId;
                    } else if (receiverData && receiverData._id) {
                        friendData = receiverData;
                        friendId = receiverId;
                    }
                }
                
                if (friendData && friendId) {
                    if (!Array.isArray(state.conversations)) {
                        state.conversations = [];
                    }
                    
                    const convIndex = state.conversations.findIndex(
                        conv => conv.friend?._id === friendId || conv.friend?.id === friendId
                    );
                    
                    if (convIndex !== -1) {
                        state.conversations[convIndex].lastMessage = newMessage;
                        state.conversations[convIndex].lastMessageTime = newMessage.createdAt;
                    } else {
                        state.conversations.push({
                            friend: friendData,
                            lastMessage: newMessage,
                            lastMessageTime: newMessage.createdAt,
                            unreadCount: 0
                        });
                    }
                }
            }
        },
        
        updateMessage: (state, action) => {
            const { _id, ...updates } = action.payload;
            
            // Ensure messages is an array
            if (!Array.isArray(state.messages)) {
                state.messages = [];
                return;
            }
            
            const index = state.messages.findIndex(msg => msg._id === _id);
            if (index !== -1) {
                state.messages[index] = { ...state.messages[index], ...updates };
            }
        },
        
        removeMessage: (state, action) => {
            const messageId = action.payload;
            
            // Ensure messages is an array
            if (!Array.isArray(state.messages)) {
                state.messages = [];
                return;
            }
            
            state.messages = state.messages.filter(msg => msg._id !== messageId);
        },
        
        clearMessages: (state) => {
            state.messages = [];
            state.hasMoreMessages = true;
            state.currentPage = 1;
        },

        // ========================================
        // ACTIVE CONVERSATION
        // ========================================
        setActiveConversation: (state, action) => {
            const friendIdOrData = action.payload;
            
            // If payload is null, clear active conversation
            if (friendIdOrData === null || friendIdOrData === undefined) {
                state.activeConversationId = null;
                state.activeFriend = null;
                console.log('🔙 Cleared active conversation');
                return;
            }
            
            // If payload is just an ID string
            if (typeof friendIdOrData === 'string') {
                state.activeConversationId = friendIdOrData;
                state.activeFriend = null; // Will be set separately
            } 
            // If payload is an object with friend data
            else if (friendIdOrData && typeof friendIdOrData === 'object') {
                state.activeConversationId = friendIdOrData._id || friendIdOrData.id;
                state.activeFriend = friendIdOrData;
                console.log('💾 Stored active friend data:', friendIdOrData);
            }
        },
        
        setActiveFriend: (state, action) => {
            state.activeFriend = action.payload;
            console.log('👤 Set active friend:', action.payload);
        },

        // ========================================
        // LOADING STATES
        // ========================================
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setIsSending: (state, action) => {
            state.isSending = action.payload;
        },
        
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        
        setHasMoreMessages: (state, action) => {
            state.hasMoreMessages = action.payload;
        },
        
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // ========================================
        // ONLINE STATUS
        // ========================================
        updateUserOnlineStatus: (state, action) => {
            const { userId, isOnline } = action.payload;
            
            // Update in onlineUsers map
            state.onlineUsers[userId] = isOnline;
            
            // Update in conversations list - check if it's an array
            if (Array.isArray(state.conversations)) {
                state.conversations = state.conversations.map(conv => {
                    if (conv.friend?._id === userId || conv.friend?.id === userId) {
                        return {
                            ...conv,
                            friend: {
                                ...conv.friend,
                                isOnline: isOnline
                            }
                        };
                    }
                    return conv;
                });
            }
        },

        setOnlineUsers: (state, action) => {
            const userIds = action.payload;
            const onlineUsersMap = {};
            
            userIds.forEach(userId => {
                onlineUsersMap[userId] = true;
            });
            
            state.onlineUsers = onlineUsersMap;
            
            // Update conversations - check if it's an array
            if (Array.isArray(state.conversations)) {
                state.conversations = state.conversations.map(conv => ({
                    ...conv,
                    friend: {
                        ...conv.friend,
                        isOnline: onlineUsersMap[conv.friend?._id] || onlineUsersMap[conv.friend?.id] || false
                    }
                }));
            }
        },

        // ========================================
        // TYPING INDICATORS
        // ========================================
        setTypingStatus: (state, action) => {
            const { userId, isTyping, username } = action.payload;
            
            if (isTyping) {
                state.typingUsers[userId] = {
                    isTyping: true,
                    username: username || 'User'
                };
            } else {
                delete state.typingUsers[userId];
            }
        },

        clearTypingStatus: (state, action) => {
            const userId = action.payload;
            delete state.typingUsers[userId];
        },
    },
});

// ========================================
// EXPORT ACTIONS
// ========================================
export const {
    setConversations,
    updateConversation,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    setActiveConversation,
    setActiveFriend,
    setIsLoading,
    setIsSending,
    setUploadProgress,
    setHasMoreMessages,
    setCurrentPage,
    updateUserOnlineStatus,
    setOnlineUsers,
    setTypingStatus,
    clearTypingStatus,
} = messageSlice.actions;

// ========================================
// SELECTORS
// ========================================
export const selectConversations = (state) => state.messages.conversations;
export const selectMessages = (state) => state.messages.messages;
export const selectActiveConversationId = (state) => state.messages.activeConversationId;
export const selectActiveFriend = (state) => state.messages.activeFriend;
export const selectIsMessagesLoading = (state) => state.messages.isLoading;
export const selectIsSending = (state) => state.messages.isSending;
export const selectUploadProgress = (state) => state.messages.uploadProgress;
export const selectHasMoreMessages = (state) => state.messages.hasMoreMessages;
export const selectCurrentPage = (state) => state.messages.currentPage;
export const selectOnlineUsers = (state) => state.messages.onlineUsers;
export const selectTypingUsers = (state) => state.messages.typingUsers;

// Sorted conversations (most recent first)
export const selectSortedConversations = (state) => {
    const conversations = state.messages.conversations || [];
    if (!Array.isArray(conversations)) return [];
    
    return [...conversations].sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || a.lastMessage?.createdAt || 0);
        const timeB = new Date(b.lastMessageTime || b.lastMessage?.createdAt || 0);
        return timeB - timeA;
    });
};

// Total unread count
export const selectTotalUnreadCount = (state) => {
    const conversations = state.messages.conversations || [];
    if (!Array.isArray(conversations)) return 0;
    
    return conversations.reduce((total, conv) => {
        return total + (conv.unreadCount || 0);
    }, 0);
};

export default messageSlice.reducer;
