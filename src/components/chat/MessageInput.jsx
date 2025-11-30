import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    sendTextMessage, 
    sendImageMessage, 
    sendVideoMessage, 
    sendAudioMessage,
    sendDocumentMessage 
} from '@/services/messageServices';
import { emitTyping } from '@/services/socketService';
import { selectIsSending, selectUploadProgress } from '@/states/messageSlice';
import { Input } from '@/components/ui/input';

const MessageInput = ({ friendId }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const isSending = useSelector(selectIsSending);
    const uploadProgress = useSelector(selectUploadProgress);
    
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messageInputRef = useRef(null);

    // Auto focus input when component mounts or friendId changes
    useEffect(() => {
        if (messageInputRef.current) {
            messageInputRef.current.focus();
        }
    }, [friendId]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (value.trim() && !isTyping) {
            setIsTyping(true);
            emitTyping(friendId, true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            emitTyping(friendId, false);
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        const messageText = message.trim();
        setMessage('');
        
        if (isTyping) {
            setIsTyping(false);
            emitTyping(friendId, false);
        }

        const result = await sendTextMessage(friendId, messageText);
        if (!result.success) {
            console.error('Failed to send message:', result.error);
        }
        
        // Re-focus input after sending
        setTimeout(() => {
            if (messageInputRef.current) {
                messageInputRef.current.focus();
            }
        }, 0);
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;
        
        const uploadFunctions = {
            image: sendImageMessage,
            video: sendVideoMessage,
            audio: sendAudioMessage,
            document: sendDocumentMessage
        };

        const result = await uploadFunctions[type](friendId, file);
        if (!result.success) {
            console.error(`Failed to send ${type}:`, result.error);
        }
    };

    const attachmentOptions = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Photo',
            color: 'text-rose-600 hover:bg-rose-50',
            onClick: () => imageInputRef.current?.click()
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Video',
            color: 'text-blue-600 hover:bg-blue-50',
            onClick: () => videoInputRef.current?.click()
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Document',
            color: 'text-purple-600 hover:bg-purple-50',
            onClick: () => fileInputRef.current?.click()
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            ),
            label: 'Audio',
            color: 'text-emerald-600 hover:bg-emerald-50',
            onClick: () => audioInputRef.current?.click()
        }
    ];

    return (
        <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 md:px-6 py-4 safe-area-bottom z-20">
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Uploading</span>
                        <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-3 relative">
                {/* Attach Button */}
                <div className="relative z-50">
                    <button
                        type="button"
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={`
                            p-3 rounded-full transition-all duration-300 group relative overflow-hidden
                            ${showAttachMenu 
                                ? 'bg-primary text-primary-foreground rotate-45 shadow-lg shadow-primary/25' 
                                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                            }
                        `}
                        title="Attach files"
                    >
                        <svg 
                            className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>

                    {/* Attach Menu */}
                    {showAttachMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-0 bg-background/20 backdrop-blur-[1px]" 
                                onClick={() => setShowAttachMenu(false)}
                            ></div>
                            <div className="absolute bottom-full left-0 mb-4 bg-card/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-2 z-10 min-w-[240px] animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 origin-bottom-left">
                                <div className="grid grid-cols-1 gap-1">
                                    {attachmentOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                option.onClick();
                                                setShowAttachMenu(false);
                                            }}
                                            className={`
                                                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                                                hover:bg-accent/10 group
                                            `}
                                        >
                                            <div className={`
                                                p-2 rounded-lg bg-muted/50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200
                                                ${option.color.split(' ')[0]}
                                            `}>
                                                {option.icon}
                                            </div>
                                            <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Hidden File Inputs */}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'image')} className="hidden" />
                <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileUpload(e.target.files[0], 'video')} className="hidden" />
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.zip" onChange={(e) => handleFileUpload(e.target.files[0], 'document')} className="hidden" />
                <input ref={audioInputRef} type="file" accept="audio/*" onChange={(e) => handleFileUpload(e.target.files[0], 'audio')} className="hidden" />

                {/* Text Input */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <Input
                        ref={messageInputRef}
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type a message..."
                        disabled={isSending}
                        className="h-12 md:h-14 rounded-3xl pl-6 pr-4 border-border/50 bg-muted/30 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 text-base shadow-inner"
                    />
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim() || isSending}
                    className={`
                        h-12 md:h-14 w-12 md:w-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                        ${!message.trim() || isSending
                            ? 'bg-muted text-muted-foreground scale-90 opacity-70 cursor-not-allowed'
                            : 'bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-105 hover:shadow-primary/30 active:scale-95'
                        }
                    `}
                    title="Send message"
                >
                    {isSending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg 
                            className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${message.trim() ? 'translate-x-0.5' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;