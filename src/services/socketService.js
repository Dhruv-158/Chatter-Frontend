// src/services/socketService.js
import { io } from 'socket.io-client';
import store from '@/store/store';
import {
    addMessage,
    updateMessage,
    removeMessage,
    updateUserOnlineStatus,
    setOnlineUsers,
    setTypingStatus,
} from '@/states/messageSlice';

// Socket instance
let socket = null;

// ========================================
// CONNECT TO SOCKET
// ========================================
export const connectSocket = () => {
    const authToken = localStorage.getItem('accessToken');
    
    if (!authToken) {
        console.error('❌ No auth token available for socket connection');
        return null;
    }

    if (socket && socket.connected) {
        console.log('✅ Socket already connected');
        return socket;
    }

    console.log('🔌 Connecting to Socket.io server...');

    const cleanToken = authToken.replace('Bearer ', '').trim();
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5500';

    socket = io(socketUrl, {
        auth: {
            token: cleanToken
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    // ========================================
    // CONNECTION EVENTS
    // ========================================
    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id || 'unknown');
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
            socket?.connect();
        }
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
    });

    // ========================================
    // MESSAGE EVENTS
    // ========================================
    
    // ✅ Receive new message
    socket.on('receive-message', (data) => {
        console.log('📨 New message received:', data);
        store.dispatch(addMessage(data));
    });

    // ✅ Message deleted
    socket.on('message-deleted', (data) => {
        console.log('🗑️ Message deleted:', data);
        store.dispatch(removeMessage(data.messageId));
    });

    // ✅ Message read
    socket.on('message-read', (data) => {
        console.log('✅ Message read:', data);
        store.dispatch(updateMessage({ 
            _id: data.messageId, 
            isRead: true, 
            readAt: data.readAt 
        }));
    });

    // ✅ All messages read
    socket.on('all-messages-read', (data) => {
        console.log('✅ All messages read:', data);
        const state = store.getState();
        state.messages.messages
            .filter(msg => msg.sender === data.friendId && !msg.isRead)
            .forEach(msg => {
                store.dispatch(updateMessage({ 
                    _id: msg._id, 
                    isRead: true, 
                    readAt: new Date().toISOString() 
                }));
            });
    });

    // ========================================
    // TYPING INDICATORS
    // ========================================
    
    socket.on('typing-start', (data) => {
        console.log('⌨️ User typing:', data.username);
        store.dispatch(setTypingStatus({ 
            userId: data.userId, 
            isTyping: true, 
            username: data.username 
        }));
    });

    socket.on('typing-stop', (data) => {
        console.log('⏸️ User stopped typing:', data.userId);
        store.dispatch(setTypingStatus({ 
            userId: data.userId, 
            isTyping: false 
        }));
    });

    // ========================================
    // ONLINE STATUS
    // ========================================
    
    socket.on('online-users', (userIds) => {
        console.log('🟢 Online users received:', userIds);
        console.log('🟢 Type:', typeof userIds, 'Is Array:', Array.isArray(userIds));
        
        // Dispatch to Redux to update all online users at once
        if (Array.isArray(userIds) && userIds.length > 0) {
            store.dispatch(setOnlineUsers(userIds));
            console.log('✅ Updated online users in Redux');
        }
    });

    socket.on('user-online', (data) => {
        console.log(`🟢 User ${data.userId} is now online`);
        store.dispatch(updateUserOnlineStatus({ 
            userId: data.userId, 
            isOnline: true 
        }));
    });

    socket.on('user-offline', (data) => {
        console.log(`⚫ User ${data.userId} is now offline`);
        store.dispatch(updateUserOnlineStatus({ 
            userId: data.userId, 
            isOnline: false 
        }));
    });

    return socket;
};

// ========================================
// SEND MESSAGE NOTIFICATION
// ========================================
export const sendMessage = (messageData) => {
    if (!socket || !socket.connected) {
        console.error('❌ Socket not connected');
        return false;
    }
    
    socket.emit('send-message', messageData);
    return true;
};

// ========================================
// TYPING INDICATORS
// ========================================
export const emitTyping = (friendId, isTyping = true) => {
    if (!socket || !socket.connected) {
        return false;
    }

    if (isTyping) {
        socket.emit('typing-start', { friendId });
    } else {
        socket.emit('typing-stop', { friendId });
    }
    return true;
};

// ========================================
// MARK AS READ
// ========================================
export const markMessageAsReadSocket = (messageId) => {
    if (!socket || !socket.connected) {
        return false;
    }
    
    socket.emit('mark-as-read', { messageId });
    return true;
};

// ========================================
// DELETE MESSAGE
// ========================================
export const deleteMessageSocket = (messageId) => {
    if (!socket || !socket.connected) {
        return false;
    }
    
    socket.emit('delete-message', { messageId });
    return true;
};

// ========================================
// DISCONNECT
// ========================================
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('🔌 Socket disconnected');
    }
};

// ========================================
// GET SOCKET INSTANCE
// ========================================
export const getSocket = () => socket;

// ========================================
// CHECK CONNECTION
// ========================================
export const isConnected = () => socket && socket.connected;

// ========================================
// EVENT LISTENERS (for components)
// ========================================
export const onNewMessage = (callback) => {
    if (socket) socket.on('receive-message', callback);
};

export const offNewMessage = (callback) => {
    if (socket) socket.off('receive-message', callback);
};

export const onMessageDeleted = (callback) => {
    if (socket) socket.on('message-deleted', callback);
};

export const offMessageDeleted = (callback) => {
    if (socket) socket.off('message-deleted', callback);
};

export const onTypingStart = (callback) => {
    if (socket) socket.on('typing-start', callback);
};

export const offTypingStart = (callback) => {
    if (socket) socket.off('typing-start', callback);
};

export const onTypingStop = (callback) => {
    if (socket) socket.on('typing-stop', callback);
};

export const offTypingStop = (callback) => {
    if (socket) socket.off('typing-stop', callback);
};

export const onUserOnline = (callback) => {
    if (socket) socket.on('user-online', callback);
};

export const onUserOffline = (callback) => {
    if (socket) socket.on('user-offline', callback);
};

export default {
    connectSocket,
    sendMessage,
    emitTyping,
    markMessageAsReadSocket,
    deleteMessageSocket,
    disconnectSocket,
    getSocket,
    isConnected,
    onNewMessage,
    offNewMessage,
    onMessageDeleted,
    offMessageDeleted,
    onTypingStart,
    offTypingStart,
    onTypingStop,
    offTypingStop,
    onUserOnline,
    onUserOffline,
};
