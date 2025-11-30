import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUnreadNotifications } from '@/states/notificationSlice';
import { clearNotification } from '@/states/notificationSlice';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InAppNotifications = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const unreadNotifications = useSelector(selectUnreadNotifications);
    const lastNotifications = useSelector(state => state.notifications.lastNotification);
    const [visible, setVisible] = useState({});
    const [dismissed, setDismissed] = useState(new Set());

    useEffect(() => {
        // Show notification for new messages
        Object.keys(unreadNotifications).forEach(friendId => {
            if (!dismissed.has(friendId) && lastNotifications[friendId]) {
                setVisible(prev => ({ ...prev, [friendId]: true }));
                
                // Auto hide after 5 seconds
                setTimeout(() => {
                    setVisible(prev => ({ ...prev, [friendId]: false }));
                }, 5000);
            }
        });
    }, [unreadNotifications, lastNotifications, dismissed]);

    const handleClick = (friendId) => {
        navigate(`/messages/${friendId}`);
        dispatch(clearNotification(friendId));
        setVisible(prev => ({ ...prev, [friendId]: false }));
        setDismissed(prev => new Set([...prev, friendId]));
    };

    const handleDismiss = (friendId, e) => {
        e.stopPropagation();
        setVisible(prev => ({ ...prev, [friendId]: false }));
        setDismissed(prev => new Set([...prev, friendId]));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {Object.entries(lastNotifications).map(([friendId, notification]) => {
                if (!visible[friendId]) return null;
                
                const { sender, message } = notification;
                const count = unreadNotifications[friendId] || 1;

                return (
                    <div
                        key={friendId}
                        onClick={() => handleClick(friendId)}
                        className="bg-card border border-border rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all animate-slide-in-right"
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={sender.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender.username || 'User')}&background=8b5cf6&color=fff`}
                                    alt={sender.username}
                                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary"
                                />
                                {count > 1 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h4 className="font-bold text-foreground text-sm truncate">
                                        {sender.username || sender.fullName}
                                    </h4>
                                    <button
                                        onClick={(e) => handleDismiss(friendId, e)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {message.messageType === 'text' 
                                        ? message.content 
                                        : `📎 ${message.messageType}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InAppNotifications;
