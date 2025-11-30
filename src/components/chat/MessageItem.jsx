import React, { useState } from 'react';
import { deleteMessage } from '@/services/messageServices';
import { Trash2, Copy, Reply, Forward } from 'lucide-react';

const MessageItem = ({ message, isOwn, showAvatar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getProfilePictureUrl = (profilePicture) => {
        if (!profilePicture) return null;
        if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
            return profilePicture;
        }
        return `http://localhost:5500${profilePicture}`;
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
        });
    };

    const handleDelete = async () => {
        if (!confirm('Delete this message?')) return;
        setIsDeleting(true);
        const result = await deleteMessage(message._id);
        if (!result.success) {
            console.error('Failed to delete message:', result.error);
            setIsDeleting(false);
        }
    };

    const renderMessageContent = () => {
        switch (message.messageType) {
            case 'text':
                return (
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                        {message.content}
                    </p>
                );

            case 'image':
                const imageUrl = message.fileUrl || message.imageUrl || message.content || message.url;
                const fullImageUrl = imageUrl?.startsWith('http') 
                    ? imageUrl 
                    : `http://localhost:5500${imageUrl}`;
                
                return (
                    <div className="space-y-1 -mx-2 -mt-2">
                        <img
                            src={fullImageUrl}
                            alt="Shared image"
                            className="max-w-xs rounded-lg cursor-pointer hover:opacity-95 transition-all"
                            onClick={() => window.open(fullImageUrl, '_blank')}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" fill="gray">Image not available</text></svg>';
                            }}
                        />
                        {message.caption && (
                            <p className="text-sm px-2 pb-1">{message.caption}</p>
                        )}
                    </div>
                );

            case 'video':
                const videoUrl = message.fileUrl || message.videoUrl || message.content;
                const fullVideoUrl = videoUrl?.startsWith('http') 
                    ? videoUrl 
                    : `http://localhost:5500${videoUrl}`;
                    
                return (
                    <div className="space-y-1 -mx-2 -mt-2">
                        <video
                            src={fullVideoUrl}
                            controls
                            className="max-w-xs rounded-lg"
                        />
                        {message.caption && (
                            <p className="text-sm px-2 pb-1">{message.caption}</p>
                        )}
                    </div>
                );

            case 'audio':
                const audioUrl = message.fileUrl || message.audioUrl || message.content;
                const fullAudioUrl = audioUrl?.startsWith('http') 
                    ? audioUrl 
                    : `http://localhost:5500${audioUrl}`;
                    
                return (
                    <div className="min-w-[240px]">
                        <audio
                            src={fullAudioUrl}
                            controls
                            className="w-full h-10"
                        />
                    </div>
                );

            case 'document':
                const documentUrl = message.fileUrl || message.documentUrl || message.content;
                const fullDocumentUrl = documentUrl?.startsWith('http') 
                    ? documentUrl 
                    : `http://localhost:5500${documentUrl}`;
                    
                return (
                    <a
                        href={fullDocumentUrl}
                        download
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            isOwn ? 'bg-black/10 hover:bg-black/20' : 'bg-black/5 hover:bg-black/10'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isOwn ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                                {message.fileName || 'Document'}
                            </p>
                            <p className="text-xs opacity-70">
                                {message.fileSize || 'Click to download'}
                            </p>
                        </div>
                    </a>
                );

            case 'link':
                return (
                    <a
                        href={message.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col p-3 rounded-xl transition-all max-w-xs ${
                            isOwn ? 'bg-black/10 hover:bg-black/20' : 'bg-black/5 hover:bg-black/10'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                            isOwn ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        {message.title && (
                            <p className="font-semibold text-sm mb-1">
                                {message.title}
                            </p>
                        )}
                        {message.description && (
                            <p className="text-xs mb-2 opacity-80 line-clamp-2">
                                {message.description}
                            </p>
                        )}
                        <p className="text-xs truncate opacity-70 underline">
                            {message.url}
                        </p>
                    </a>
                );

            default:
                return <p>{message.content || 'Unsupported message type'}</p>;
        }
    };

    const senderData = typeof message.sender === 'object' ? message.sender : null;
    const senderUsername = senderData?.username || 'User';
    const senderProfilePicture = senderData?.profilePicture 
        ? getProfilePictureUrl(senderData.profilePicture)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(senderUsername)}&background=8b5cf6&color=fff`;

    return (
        <div className={`flex gap-2 px-4 py-1 group ${isOwn ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 flex flex-col justify-end">
                {showAvatar && !isOwn && (
                    <img
                        src={senderProfilePicture}
                        alt={senderUsername}
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderUsername)}&background=8b5cf6&color=fff`;
                        }}
                    />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
                
                {/* Message Bubble */}
                <div className="relative">
                    {/* Tail SVG */}
                    {showAvatar && (
                        <div className={`absolute top-0 w-3 h-3 ${isOwn ? '-right-2' : '-left-2'} z-0`}>
                            <svg viewBox="0 0 10 10" className={`w-full h-full ${isOwn ? 'text-primary fill-current' : 'text-card fill-current'}`}>
                                {isOwn ? (
                                    <path d="M0 0 L10 0 L0 10 Z" />
                                ) : (
                                    <path d="M0 0 L10 0 L10 10 Z" />
                                )}
                            </svg>
                        </div>
                    )}

                    <div
                        className={`relative z-10 px-3 py-2 shadow-sm ${
                            isOwn 
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' 
                                : 'bg-card text-card-foreground rounded-2xl rounded-tl-none border border-border/50'
                        } ${isDeleting ? 'opacity-50 scale-95' : 'scale-100'} transition-all`}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setShowMenu(!showMenu);
                        }}
                    >
                        {/* Sender Name in Group Chats (if needed later) */}
                        {/* {!isOwn && showAvatar && (
                            <p className="text-xs font-bold text-primary mb-1">{senderUsername}</p>
                        )} */}

                        <div className="text-sm leading-relaxed min-w-[80px]">
                            {renderMessageContent()}
                        </div>

                        {/* Time & Read Status */}
                        <div className={`flex items-center justify-end gap-1 mt-1 select-none ${
                            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                            <span className="text-[10px] font-medium">{formatTime(message.createdAt)}</span>
                            {isOwn && (
                                <div className="flex">
                                    {message.isRead ? (
                                        <div className="flex -space-x-1">
                                            <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                            </svg>
                                            <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                            </svg>
                                        </div>
                                    ) : (
                                        <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Context Menu */}
                    {showMenu && (
                        <div className={`absolute top-full mt-1 ${isOwn ? 'right-0' : 'left-0'} bg-popover text-popover-foreground rounded-xl shadow-xl border border-border z-50 overflow-hidden min-w-[160px] animate-fade-scale`}>
                            <div className="p-1">
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Reply className="w-4 h-4" /> Reply
                                </button>
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Copy className="w-4 h-4" /> Copy
                                </button>
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Forward className="w-4 h-4" /> Forward
                                </button>
                                {isOwn && (
                                    <>
                                        <div className="h-px bg-border my-1" />
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for Menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
};

export default MessageItem;