import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
    selectSortedConversations, 
    selectIsMessagesLoading,
    selectTotalUnreadCount,
    setActiveConversation,
    setActiveFriend
} from '@/states/messageSlice';
import { selectUnreadNotifications } from '@/states/notificationSlice';
import NewChatModal from './NewChatModal';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useFriendsList } from '@/hooks';

const ChatSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const conversations = useSelector(selectSortedConversations);
    const isMessagesLoading = useSelector(selectIsMessagesLoading);
    const totalUnreadCount = useSelector(selectTotalUnreadCount);
    const activeConversationId = useSelector(state => state.messages.activeConversationId);
    const currentUser = useSelector(state => state.auth?.user || state.user?.profile);
    const onlineUsers = useSelector(state => state.messages?.onlineUsers || {});
    const unreadNotifications = useSelector(selectUnreadNotifications);
    
    // Use the hook for friends list
    const { friends, isLoading: isFriendsLoading } = useFriendsList();
    
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const mergedFriendsList = useMemo(() => {
        const friendsList = Array.isArray(friends) ? friends : [];
        return friendsList.map(friend => {
            const conversation = conversations.find(
                conv => conv.friend?._id === friend._id || conv.friend?.id === friend._id
            );
            const isOnline = onlineUsers[friend._id] || onlineUsers[friend.id] || friend.isOnline || false;
            
            return {
                ...friend,
                isOnline,
                lastMessage: conversation?.lastMessage || null,
                lastMessageTime: conversation?.lastMessageTime || null,
                unreadCount: conversation?.unreadCount || 0,
                hasConversation: !!conversation
            };
        });
    }, [friends, conversations, onlineUsers]);

    const filteredFriends = mergedFriendsList.filter(friend => {
        if (!searchQuery.trim()) return true;
        const friendName = (friend.username || friend.name || '').toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        return friendName.includes(query);
    });

    const sortedFriends = [...filteredFriends].sort((a, b) => {
        if (a.hasConversation && !b.hasConversation) return -1;
        if (!a.hasConversation && b.hasConversation) return 1;
        if (a.hasConversation && b.hasConversation) {
            const timeA = new Date(a.lastMessageTime || 0);
            const timeB = new Date(b.lastMessageTime || 0);
            return timeB - timeA;
        }
        return (a.username || '').localeCompare(b.username || '');
    });

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 86400000 && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        if (diff < 604800000) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatMessagePreview = (lastMessage) => {
        if (!lastMessage) return 'Start a conversation';
        const isSentByMe = lastMessage.sender === currentUser?._id || lastMessage.sender === currentUser?.id;
        const prefix = isSentByMe ? 'You: ' : '';
        
        const icons = {
            image: '📷 Photo',
            video: '🎥 Video',
            audio: '🎵 Audio',
            document: '📄 Document',
            link: '🔗 Link'
        };
        
        if (lastMessage.messageType === 'text') {
            return `${prefix}${lastMessage.content}`;
        }
        return `${prefix}${icons[lastMessage.messageType] || lastMessage.messageType}`;
    };

    const getProfilePictureUrl = (user) => {
        if (!user) return `https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff`;
        const profilePic = user.profilePicture;
        if (!profilePic) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=8b5cf6&color=fff`;
        }
        if (profilePic.startsWith('http')) return profilePic;
        return `http://localhost:5500${profilePic}`;
    };

    const isLoading = isMessagesLoading || isFriendsLoading;

    return (
        <div className="h-full w-full flex flex-col bg-sidebar border-r border-sidebar-border/50">
            {/* Header */}
            <div className="px-4 py-4 flex items-center justify-between bg-sidebar/50 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Chats</h1>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowNewChatModal(true)}
                        className="p-2 rounded-full hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="New Chat"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-sidebar-accent/50 border-transparent focus:bg-background focus:border-primary/50 rounded-xl transition-all"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto chat-scrollbar">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-12 h-12 bg-muted rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-1/3"></div>
                                    <div className="h-3 bg-muted rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sortedFriends.length > 0 ? (
                    <div className="divide-y divide-sidebar-border/30">
                        {sortedFriends.map((friend) => {
                            const isActive = activeConversationId === friend._id;
                            const notificationUnread = unreadNotifications[friend._id] || 0;
                            const unreadCount = notificationUnread || friend.unreadCount || 0;
                            
                            return (
                                <Link
                                    key={friend._id}
                                    to={`/messages/${friend._id}`}
                                    onClick={() => {
                                        dispatch(setActiveConversation(friend._id));
                                        dispatch(setActiveFriend(friend));
                                    }}
                                    className={`
                                        block px-4 py-3 cursor-pointer transition-all hover:bg-sidebar-accent/50
                                        ${isActive ? 'bg-sidebar-accent' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={getProfilePictureUrl(friend)}
                                                alt={friend.username}
                                                className="w-12 h-12 rounded-full object-cover border border-border"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username || 'User')}&background=8b5cf6&color=fff`;
                                                }}
                                            />
                                            {friend.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-sidebar-background rounded-full"></span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-base font-semibold text-foreground truncate">
                                                    {friend.username || 'Unknown User'}
                                                </h3>
                                                {friend.lastMessageTime && (
                                                    <span className={`text-xs ${unreadCount > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                                        {formatTime(friend.lastMessageTime)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm truncate pr-2 ${
                                                    unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                                                }`}>
                                                    {formatMessagePreview(friend.lastMessage)}
                                                </p>
                                                {unreadCount > 0 && (
                                                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No chats yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">Start a new conversation with your friends</p>
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                        >
                            Start Chatting
                        </button>
                    </div>
                )}
            </div>

            {showNewChatModal && (
                <NewChatModal onClose={() => setShowNewChatModal(false)} />
            )}
        </div>
    );
};

export default ChatSidebar;