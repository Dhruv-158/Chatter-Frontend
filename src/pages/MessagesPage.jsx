// src/pages/MessagesPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChatLayout from '@/components/chat/ChatLayout';
import { setActiveConversation, setActiveFriend } from '@/states/messageSlice';
import axiosClient from '@/api/axiosClient';
import API_URLS from '@/api/apiUrls';

/**
 * MessagesPage Component
 * 
 * Handles routes:
 * - /messages - Shows chat layout with no active conversation
 * - /messages/:friendId - Shows chat layout with specific conversation active
 */
const MessagesPage = () => {
    const { friendId } = useParams(); // Get friendId from URL
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.messages?.conversations || []);

    // Set active conversation when friendId changes
    useEffect(() => {
        if (friendId) {
            dispatch(setActiveConversation(friendId));
            
            // Try to find friend data in conversations first
            const conversation = conversations.find(
                conv => conv.friend?._id === friendId || conv.friend?.id === friendId
            );
            
            if (conversation?.friend) {
                dispatch(setActiveFriend(conversation.friend));
            } else {
                // Fetch friend data from API if not in conversations
                const fetchFriendData = async () => {
                    try {
                        const response = await axiosClient.get(`${API_URLS.GET_USER_BY_ID}/${friendId}`);
                        if (response.data?.user) {
                            dispatch(setActiveFriend(response.data.user));
                        }
                    } catch (error) {
                        console.error('Failed to fetch friend data:', error);
                        dispatch(setActiveFriend(null));
                    }
                };
                fetchFriendData();
            }
        } else {
            // No friendId means we're on /messages route
            dispatch(setActiveConversation(null));
            dispatch(setActiveFriend(null));
        }
    }, [friendId, dispatch, conversations]);

    return (
        <div className="h-full w-full bg-background">
            <ChatLayout />
        </div>
    );
};

export default MessagesPage;
