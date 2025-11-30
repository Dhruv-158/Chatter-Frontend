import React from 'react';
import { Button } from '@/components/ui/button';
import { requestNotificationPermission, showNotification } from '@/utils/notifications';

const NotificationTest = () => {
    const testNotification = async () => {
        const granted = await requestNotificationPermission();
        
        if (granted) {
            showNotification('Test Notification', {
                body: 'If you see this, notifications are working! 🎉',
                icon: '/vite.svg',
            });
        } else {
            alert('Notification permission denied. Please enable it in browser settings.');
        }
    };

    const checkPermission = () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications');
            return;
        }
        
        alert(`Notification permission: ${Notification.permission}`);
    };

    return (
        <div className="fixed bottom-24 right-4 z-50 bg-card border border-border rounded-xl p-4 shadow-lg">
            <h3 className="font-bold mb-2">🔔 Notification Test</h3>
            <div className="space-y-2">
                <Button onClick={testNotification} size="sm" className="w-full">
                    Test Notification
                </Button>
                <Button onClick={checkPermission} variant="outline" size="sm" className="w-full">
                    Check Permission
                </Button>
            </div>
        </div>
    );
};

export default NotificationTest;
