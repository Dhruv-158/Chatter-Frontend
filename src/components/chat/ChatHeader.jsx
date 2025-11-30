import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectConversations, selectMessages, selectActiveFriend, setActiveConversation } from '@/states/messageSlice';
import { ArrowLeft, Video, Phone, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const ChatHeader = ({ friendId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const conversations = useSelector(selectConversations) || [];
    const messages = useSelector(selectMessages) || [];
    const activeFriend = useSelector(selectActiveFriend);
    const onlineUsers = useSelector(state => state.messages?.onlineUsers || {});

    const handleBackClick = () => {
        console.log('🔙 Back button clicked - clearing conversation');
        dispatch(setActiveConversation(null));
        navigate('/messages', { replace: true });
    };

    // Derive friend data directly during render
    const friend = useMemo(() => {
        if (!friendId) return null;

        // 1. Try activeFriend from Redux (set by Sidebar or MessagesPage)
        if (activeFriend && (activeFriend._id === friendId || activeFriend.id === friendId)) {
            return {
                ...activeFriend,
                isOnline: onlineUsers[friendId] || activeFriend.isOnline || false
            };
        }

        // 2. Try finding in conversations list
        const currentConversation = Array.isArray(conversations) 
            ? conversations.find(conv => conv.friend?._id === friendId || conv.friend?.id === friendId)
            : null;

        if (currentConversation?.friend) {
            return {
                ...currentConversation.friend,
                isOnline: onlineUsers[friendId] || currentConversation.friend.isOnline || false
            };
        }

        // 3. Try finding in current messages
        if (Array.isArray(messages) && messages.length > 0) {
            const foundMessage = messages.find(msg => 
                (msg.sender?._id === friendId) || (msg.receiver?._id === friendId)
            );

            if (foundMessage) {
                const user = foundMessage.sender?._id === friendId ? foundMessage.sender : foundMessage.receiver;
                if (user) {
                    return {
                        ...user,
                        isOnline: onlineUsers[friendId] || user.isOnline || false
                    };
                }
            }
        }

        // 4. Fallback - show loading state
        return null;
    }, [friendId, activeFriend, conversations, messages, onlineUsers]);

    const getProfilePictureUrl = (user) => {
        if (!user) return null;
        const profilePic = user.profilePicture;
        if (!profilePic) return null;
        if (profilePic.startsWith('http')) return profilePic;
        return `http://localhost:5500${profilePic}`;
    };

    // Show loading if we don't have friend data
    if (!friend || !friend._id) {
        return (
            <div className="bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3">
                <div className="flex items-center gap-4 animate-pulse">
                    <div className="lg:hidden w-8 h-8 bg-muted rounded-full"></div>
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3 sticky top-0 z-20">
            <div className="flex items-center justify-between">
                {/* Friend Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Back Button - Only visible on mobile & tablet */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBackClick}
                        className="lg:hidden -ml-2 h-8 w-8"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${friend._id}`)}>
                        <Avatar className="w-10 h-10 border border-border/50">
                            <AvatarImage src={getProfilePictureUrl(friend)} alt={friend.fullName || friend.username} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {((friend.fullName || friend.username || 'U').charAt(0).toUpperCase())}
                            </AvatarFallback>
                        </Avatar>
                        {friend.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${friend._id}`)}>
                        <h3 className="font-semibold text-foreground text-base leading-none truncate mb-1">
                            {friend.fullName || friend.username || 'User'}
                        </h3>
                        <p className={`text-xs font-medium truncate ${friend.isOnline ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                            {friend.isOnline ? 'Active now' : 'Offline'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9">
                        <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9">
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;