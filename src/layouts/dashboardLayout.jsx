import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from '@/services/userService'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import InAppNotifications from '@/components/InAppNotifications'
import { 
  connectSocket, 
  disconnectSocket,
  onNewMessage,
  offNewMessage,
  onUserOnline,
  onUserOffline,
  onTypingStart,
  onTypingStop
} from '@/services/socketService'
import { 
  addMessage,
  updateUserOnlineStatus,
  setTypingStatus,
  selectActiveConversationId
} from '@/states/messageSlice'
import { addNotification, clearNotification } from '@/states/notificationSlice'
import { 
  requestNotificationPermission, 
  showMessageNotification, 
  playNotificationSound 
} from '@/utils/notifications'
import { getConversations } from '@/services/messageServices'

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector(state => state.auth?.user || state.user?.profile);
  const activeConversationId = useSelector(selectActiveConversationId);

  // Check if current page is messages
  const isMessagesPage = location.pathname.startsWith('/messages');

  // Fetch user profile when dashboard loads
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token || refreshToken) {
      console.log('📱 DashboardLayout: Fetching user profile...');
      console.log('🔑 AccessToken:', token ? 'Available' : 'Missing');
      console.log('🔄 RefreshToken:', refreshToken ? 'Available' : 'Missing');
      fetchUserProfile();
    } else {
      console.log('⚠️ No tokens found. User needs to login.');
    }
  }, []);

  // Request notification permission
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestNotificationPermission();
      console.log('🔔 Notification permission:', granted ? 'GRANTED' : 'DENIED');
      console.log('🔔 Notification.permission:', Notification?.permission);
    };
    checkPermission();
  }, []);

  // Connect to socket and handle global message notifications
  useEffect(() => {
    connectSocket();
    
    // Load conversations
    getConversations();

    const handleNewMessage = (message) => {
      console.log('📨 New message received globally:', message);
      
      // Add message to Redux
      dispatch(addMessage(message));
      
      // Get sender info
      const sender = typeof message.sender === 'object' ? message.sender : null;
      const senderId = sender?._id || message.sender;
      
      console.log('👤 Sender:', sender);
      console.log('🆔 Sender ID:', senderId);
      console.log('👤 Current User ID:', currentUser?._id || currentUser?.id);
      
      // Check if message is from current user
      const isFromCurrentUser = senderId === currentUser?._id || senderId === currentUser?.id;
      
      console.log('❓ Is from current user?', isFromCurrentUser);
      
      if (!isFromCurrentUser) {
        // Check if this conversation is active and window is focused
        const isFromActiveConversation = senderId === activeConversationId;
        const isWindowFocused = document.hasFocus();
        
        console.log('💬 Is from active conversation?', isFromActiveConversation);
        console.log('🪟 Is window focused?', isWindowFocused);
        console.log('🔔 Should show notification?', !isFromActiveConversation || !isWindowFocused);
        
        // Always add to notification count
        dispatch(addNotification({ message, sender }));
        
        // Show browser notification only if not actively viewing this conversation
        if (!isFromActiveConversation || !isWindowFocused) {
          console.log('🔔 Attempting to show notification...');
          if (sender) {
            const notification = showMessageNotification(message, sender);
            console.log('🔔 Notification result:', notification);
          }
          playNotificationSound();
        }
      }
    };

    const handleUserOnline = ({ userId, timestamp }) => {
      dispatch(updateUserOnlineStatus({ userId, isOnline: true }));
    };

    const handleUserOffline = ({ userId, timestamp }) => {
      dispatch(updateUserOnlineStatus({ userId, isOnline: false }));
    };

    const handleTypingStart = ({ userId, username }) => {
      dispatch(setTypingStatus({ userId, isTyping: true, username }));
    };

    const handleTypingStop = ({ userId }) => {
      dispatch(setTypingStatus({ userId, isTyping: false }));
    };

    // Register event listeners
    onNewMessage(handleNewMessage);
    onUserOnline(handleUserOnline);
    onUserOffline(handleUserOffline);
    onTypingStart(handleTypingStart);
    onTypingStop(handleTypingStop);

    // Cleanup on unmount
    return () => {
      offNewMessage(handleNewMessage);
      disconnectSocket();
    };
  }, [dispatch, currentUser, activeConversationId]);

  // Clear notifications when viewing a conversation
  useEffect(() => {
    if (activeConversationId) {
      dispatch(clearNotification(activeConversationId));
    }
  }, [activeConversationId, dispatch]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        {/* Main Content */}
        <main className={`bg-gray-50 dark:bg-sidebar h-screen w-full overflow-y-auto ${isMessagesPage ? 'p-0' : 'px-4 pb-20 lg:pb-4'}`}>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <MobileBottomNav />
      <InAppNotifications />
    </SidebarProvider>
  )
}

export default DashboardLayout