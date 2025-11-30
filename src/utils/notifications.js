// src/utils/notifications.js

// Request notification permission
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// Show browser notification
export const showNotification = (title, options = {}) => {
    console.log('🔔 showNotification called with:', title, options);
    console.log('🔔 Permission status:', Notification.permission);
    
    if (Notification.permission !== 'granted') {
        console.log('❌ Notification permission not granted');
        return null;
    }

    const defaultOptions = {
        icon: '/logo.png', // Your app logo
        badge: '/logo.png',
        tag: 'message-notification',
        requireInteraction: false,
        ...options,
    };

    try {
        console.log('✅ Creating notification...');
        const notification = new Notification(title, defaultOptions);
        console.log('✅ Notification created:', notification);
        
        // Add event listeners to debug
        notification.onshow = () => {
            console.log('✅ Notification SHOWN on screen');
        };
        
        notification.onerror = (error) => {
            console.error('❌ Notification ERROR:', error);
        };
        
        notification.onclose = () => {
            console.log('🔔 Notification closed');
        };
        
        // Auto close after 5 seconds
        setTimeout(() => {
            console.log('⏰ Auto-closing notification after 5 seconds');
            notification.close();
        }, 5000);
        
        return notification;
    } catch (error) {
        console.error('❌ Error showing notification:', error);
        return null;
    }
};

// Show message notification
export const showMessageNotification = (message, sender) => {
    const title = `New message from ${sender.username || sender.fullName}`;
    
    let body = '';
    if (message.messageType === 'text') {
        body = message.content;
    } else if (message.messageType === 'image') {
        body = '📷 Sent a photo';
    } else if (message.messageType === 'video') {
        body = '🎥 Sent a video';
    } else if (message.messageType === 'audio') {
        body = '🎵 Sent an audio';
    } else {
        body = `Sent a ${message.messageType}`;
    }

    const notification = showNotification(title, {
        body,
        icon: sender.profilePicture || '/logo.png',
        data: {
            url: `/messages/${sender._id || sender.id}`,
            messageId: message._id,
            senderId: sender._id || sender.id,
        },
    });

    // Handle notification click
    if (notification) {
        notification.onclick = function(event) {
            event.preventDefault();
            window.focus();
            // Navigate to the conversation
            const url = event.target.data?.url || `/messages/${sender._id || sender.id}`;
            window.location.href = url;
            notification.close();
        };
    }

    return notification;
};

// Play notification sound
export const playNotificationSound = () => {
    try {
        const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        if (!soundEnabled) return;

        const audio = new Audio('/notification.mp3'); // Add a notification sound to your public folder
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Could not play notification sound:', err));
    } catch (error) {
        console.error('Error playing notification sound:', error);
    }
};

// Check if notifications are supported
export const areNotificationsSupported = () => {
    return 'Notification' in window;
};

// Get notification permission status
export const getNotificationPermission = () => {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
};
