import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectMessages, 
    selectIsMessagesLoading,
    selectHasMoreMessages,
    clearMessages 
} from '@/states/messageSlice';
import { getMessages, markAllMessagesAsRead } from '@/services/messageServices';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';

const ChatRoom = ({ friendId }) => {
    const dispatch = useDispatch();
    const messages = useSelector(selectMessages) || [];
    const isLoading = useSelector(selectIsMessagesLoading);
    const hasMoreMessages = useSelector(selectHasMoreMessages);
    const currentUser = useSelector(state => state.user?.profile);
    const typingUsers = useSelector(state => state.messages.typingUsers || {});
    
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Check if friend is currently typing
    const isFriendTyping = typingUsers[friendId]?.isTyping || false;
    const friendTypingUsername = typingUsers[friendId]?.username || '';

    // ========================================
    // LOAD MESSAGES ON FRIEND CHANGE
    // ========================================
    useEffect(() => {
        if (friendId) {
            dispatch(clearMessages());
            setPage(1);
            getMessages(friendId, 1, 50);
            markAllMessagesAsRead(friendId);
        }
    }, [friendId, dispatch]);

    // ========================================
    // AUTO SCROLL TO BOTTOM ON NEW MESSAGE
    // ========================================
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ========================================
    // LOAD MORE MESSAGES (PAGINATION)
    // ========================================
    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMoreMessages) return;
        
        setIsLoadingMore(true);
        const nextPage = page + 1;
        await getMessages(friendId, nextPage, 50);
        setPage(nextPage);
        setIsLoadingMore(false);
    };

    // ========================================
    // HANDLE SCROLL FOR PAGINATION
    // ========================================
    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        
        // Load more when scrolled to top
        if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
            loadMoreMessages();
        }
    };

    // ========================================
    // GROUP MESSAGES BY DATE
    // ========================================
    const groupMessagesByDate = (messages) => {
        const groups = {};
        
        // Ensure messages is an array
        if (!Array.isArray(messages)) {
            return groups;
        }
        
        messages.forEach(message => {
            const date = new Date(message.createdAt).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        
        return groups;
    };

    const messageGroups = groupMessagesByDate(messages || []);

    // ========================================
    // FORMAT DATE LABEL
    // ========================================
    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden bg-background relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            {/* Chat Header - Fixed at top */}
            <div className="flex-shrink-0 z-10">
                <ChatHeader friendId={friendId} />
            </div>

            {/* Messages Container - Scrollable */}
            <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-2 z-10 min-h-0"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {/* Loading More Indicator */}
                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-border/50">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}

                {/* Initial Loading */}
                {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <p className="text-muted-foreground font-medium">Loading messages...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4 bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm max-w-sm mx-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No messages yet</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Send a message to start the conversation with your friend.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Messages Grouped by Date */}
                        {Object.keys(messageGroups).map(date => (
                            <div key={date}>
                                {/* Date Divider */}
                                <div className="flex items-center justify-center my-6 sticky top-2 z-20">
                                    <div className="bg-card/80 backdrop-blur-md border border-border/50 text-muted-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                        {formatDateLabel(date)}
                                    </div>
                                </div>

                                {/* Messages for this date */}
                                {messageGroups[date].map((message, index) => {
                                    // Determine if message is from current user
                                    const senderId = typeof message.sender === 'object' 
                                        ? message.sender?._id 
                                        : message.sender;
                                    const isOwn = senderId === currentUser?._id || senderId === currentUser?.id;
                                    
                                    return (
                                        <MessageItem
                                            key={message._id}
                                            message={message}
                                            isOwn={isOwn}
                                            showAvatar={
                                                index === 0 || 
                                                messageGroups[date][index - 1].sender !== message.sender
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ))}

                        {/* Scroll to bottom anchor */}
                        <div ref={messagesEndRef} />
                    </>
                )}

                {/* Typing Indicator */}
                {isFriendTyping && (
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="bg-card shadow-md rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 border border-border">
                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium animate-pulse">{friendTypingUsername} is typing...</span>
                    </div>
                )}
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="flex-shrink-0 z-10">
                <MessageInput friendId={friendId} />
            </div>
        </div>
    );
};

export default ChatRoom;
