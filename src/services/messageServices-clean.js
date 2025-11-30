// src/services/messageServices.js
import axiosClient from '@/api/axiosClient';
import API_URLS from '@/api/apiUrls';
import store from '@/store/store';
import { 
  setConversations, 
  setMessages, 
  addMessage,
  setIsLoading,
  setIsSending,
  setUploadProgress,
  setHasMoreMessages
} from '@/states/messageSlice';
import { sendMessage as sendSocketMessage } from './socketService';

// ========================================
// GET CONVERSATIONS (for ChatSidebar)
// ========================================
export const getConversations = async () => {
  try {
    store.dispatch(setIsLoading(true));

    
    const response = await axiosClient.get(API_URLS.GET_CONVERSATIONS);
    const conversations = response.data.data || response.data.conversations || response.data || [];
    
    store.dispatch(setConversations(conversations));
    return { success: true, conversations };
  } catch (error) {
    console.error('❌ API Error: Failed to load conversations:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

// ========================================
// GET MESSAGES (for ChatRoom)
// ========================================
export const getMessages = async (friendId, page = 1, limit = 50) => {
  try {
    store.dispatch(setIsLoading(true));
    console.log(`📡 API: GET /api/messages/conversation/${friendId}?page=${page}&limit=${limit}`);
    
    const response = await axiosClient.get(
      `${API_URLS.GET_MESSAGES}/${friendId}`,
      { params: { page, limit } }
    );
    
    const messages = response.data.data || response.data.messages || response.data || [];
    const hasMore = response.data.pagination?.totalPages > page || response.data.hasMore || false;
    
    if (page === 1) {
      store.dispatch(setMessages(messages));
    } else {
      // For pagination, prepend older messages
      const currentMessages = store.getState().messages.messages;
      store.dispatch(setMessages([...messages, ...currentMessages]));
    }
    
    store.dispatch(setHasMoreMessages(hasMore));
    return { success: true, messages, hasMore };
  } catch (error) {
    console.error('❌ API Error: Failed to load messages:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

// ========================================
// SEND TEXT MESSAGE
// ========================================
export const sendTextMessage = async (friendId, content) => {
  try {
    store.dispatch(setIsSending(true));
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_TEXT_MESSAGE}/${friendId}`,
      { content }
    );
    

    
    const message = response.data.message || response.data;
    
    // Add to Redux store
    store.dispatch(addMessage(message));
    
    // Notify via WebSocket
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send text message:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
  }
};

// ========================================
// SEND IMAGE MESSAGE
// ========================================
export const sendImageMessage = async (friendId, file) => {
  try {
    store.dispatch(setIsSending(true));
    store.dispatch(setUploadProgress(0));
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_IMAGE_MESSAGE}/${friendId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store.dispatch(setUploadProgress(progress));
        }
      }
    );
    

    
    const message = response.data.message || response.data;
    store.dispatch(addMessage(message));
    
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send image:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
    store.dispatch(setUploadProgress(0));
  }
};

// ========================================
// SEND VIDEO MESSAGE
// ========================================
export const sendVideoMessage = async (friendId, file) => {
  try {
    store.dispatch(setIsSending(true));
    store.dispatch(setUploadProgress(0));
    
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_VIDEO_MESSAGE}/${friendId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store.dispatch(setUploadProgress(progress));
        }
      }
    );
    

    
    const message = response.data.message || response.data;
    store.dispatch(addMessage(message));
    
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send video:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
    store.dispatch(setUploadProgress(0));
  }
};

// ========================================
// SEND AUDIO MESSAGE
// ========================================
export const sendAudioMessage = async (friendId, file) => {
  try {
    store.dispatch(setIsSending(true));
    store.dispatch(setUploadProgress(0));
    
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_AUDIO_MESSAGE}/${friendId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store.dispatch(setUploadProgress(progress));
        }
      }
    );
    

    
    const message = response.data.message || response.data;
    store.dispatch(addMessage(message));
    
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send audio:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
    store.dispatch(setUploadProgress(0));
  }
};

// ========================================
// SEND DOCUMENT MESSAGE
// ========================================
export const sendDocumentMessage = async (friendId, file) => {
  try {
    store.dispatch(setIsSending(true));
    store.dispatch(setUploadProgress(0));
    
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_DOCUMENT_MESSAGE}/${friendId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          store.dispatch(setUploadProgress(progress));
        }
      }
    );
    

    
    const message = response.data.message || response.data;
    store.dispatch(addMessage(message));
    
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send document:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
    store.dispatch(setUploadProgress(0));
  }
};

// ========================================
// SEND LINK MESSAGE
// ========================================
export const sendLinkMessage = async (friendId, url) => {
  try {
    store.dispatch(setIsSending(true));
    
    const response = await axiosClient.post(
      `${API_URLS.SEND_LINK_MESSAGE}/${friendId}`,
      { url }
    );
    

    
    const message = response.data.message || response.data;
    store.dispatch(addMessage(message));
    
    if (message._id) {
      sendSocketMessage({ messageId: message._id });
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('❌ Failed to send link:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  } finally {
    store.dispatch(setIsSending(false));
  }
};

// ========================================
// MARK MESSAGE AS READ
// ========================================
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axiosClient.put(`${API_URLS.MARK_MESSAGE_READ}/${messageId}`);
    

    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to mark message as read:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// ========================================
// MARK ALL MESSAGES AS READ
// ========================================
export const markAllMessagesAsRead = async (friendId) => {
  try {
    const response = await axiosClient.put(`${API_URLS.MARK_ALL_MESSAGES_READ}/${friendId}/read-all`);
    

    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to mark all messages as read:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// ========================================
// DELETE MESSAGE
// ========================================
export const deleteMessage = async (messageId) => {
  try {
    const response = await axiosClient.delete(`${API_URLS.DELETE_MESSAGE}/${messageId}`);
    

    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to delete message:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};
