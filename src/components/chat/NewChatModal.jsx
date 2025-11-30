import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosClient from '@/api/axiosClient';
import API_URLS from '@/api/apiUrls';
import { setActiveConversation, setActiveFriend } from '@/states/messageSlice';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, X, MessageSquare, Users } from 'lucide-react';

const NewChatModal = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Load friends on mount
    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        try {
            setIsLoading(true);
            console.log('📡 API: GET /api/friends');
            const response = await axiosClient.get(API_URLS.GET_FRIENDS);
            const friendsList = response.data?.data || response.data?.friends || response.data || [];
            setFriends(Array.isArray(friendsList) ? friendsList : []);
        } catch (error) {
            console.error('❌ API Error: Failed to load friends:', error);
            setFriends([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredFriends = Array.isArray(friends) 
        ? friends.filter(friend => {
            if (!searchQuery.trim()) return true;
            const username = (friend.username || friend.name || '').toLowerCase();
            const query = searchQuery.toLowerCase().trim();
            return username.includes(query);
          })
        : [];

    const handleStartChat = (friendId, friend) => {
        dispatch(setActiveConversation(friendId));
        dispatch(setActiveFriend(friend));
        navigate(`/messages/${friendId}`);
        onClose();
    };

    // Helper to get image URL
    const getImageUrl = (friend) => {
        if (friend.profilePicture?.startsWith('http')) return friend.profilePicture;
        if (friend.profilePicture) return `http://localhost:5500${friend.profilePicture}`;
        return null;
    };

    return (
        <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                        New Chat
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-1 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 text-sm bg-muted/50 border-transparent focus:bg-background transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">Loading...</p>
                        </div>
                    ) : filteredFriends.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium mb-4">
                                {searchQuery ? 'No friends found' : 'No friends yet'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => {
                                        navigate('/discover');
                                        onClose();
                                    }}
                                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    Discover People
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredFriends.map((friend) => (
                                <div
                                    key={friend._id || friend.id}
                                    onClick={() => handleStartChat(friend._id || friend.id, friend)}
                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-all group"
                                >
                                    {/* Profile Picture */}
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="w-10 h-10 border border-border/50">
                                            <AvatarImage src={getImageUrl(friend)} alt={friend.username} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                {(friend.username || friend.name || 'U').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {friend.isOnline && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Friend Info */}
                                    <div className="flex-1 min-w-0 text-left">
                                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {friend.username || friend.name}
                                        </h3>
                                        {friend.bio && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {friend.bio}
                                            </p>
                                        )}
                                    </div>

                                    {/* Message Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
