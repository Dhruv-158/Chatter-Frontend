import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ChatSidebar from './ChatSidebar';
import ChatRoom from './ChatRoom';
import EmptyChat from './EmptyChat';
import { 
    onMessageDeleted,
    offMessageDeleted,
} from '@/services/socketService';
import { 
    removeMessage,
    selectActiveConversationId 
} from '@/states/messageSlice';

const ChatLayout = () => {
    const dispatch = useDispatch();
    const activeConversationId = useSelector(selectActiveConversationId);

    // ========================================
    // HANDLE MESSAGE DELETION ONLY
    // (Socket connection and new messages handled in DashboardLayout)
    // ========================================
    useEffect(() => {
        const handleMessageDeleted = ({ messageId }) => {
            dispatch(removeMessage(messageId));
        };

        // Register event listener
        onMessageDeleted(handleMessageDeleted);

        // Cleanup on unmount
        return () => {
            offMessageDeleted(handleMessageDeleted);
        };
    }, [dispatch]);

    return (
        <div className="h-dvh w-full overflow-hidden bg-background">
            {/* Mobile & Tablet View - Stack Layout */}
            <div className="lg:hidden flex h-full w-full relative">
                {/* Sidebar - Always present but positioned off-screen when conversation is active */}
                <div className={`
                    absolute inset-y-0 left-0 w-full h-full bg-sidebar
                    transition-transform duration-300 ease-in-out
                    ${activeConversationId ? '-translate-x-full' : 'translate-x-0'}
                    z-10
                `}>
                    <ChatSidebar />
                </div>

                {/* Chat Room - Slides in when active */}
                <div className={`
                    absolute inset-0 w-full h-full bg-background
                    transition-transform duration-300 ease-in-out
                    ${activeConversationId ? 'translate-x-0' : 'translate-x-full'}
                    z-20
                `}>
                    {activeConversationId ? (
                        <div className="relative h-full w-full flex flex-col">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                                backgroundSize: '32px 32px'
                            }}></div>
                            
                            <div className="relative z-10 flex-1 h-full overflow-hidden flex flex-col">
                                <ChatRoom key={activeConversationId} friendId={activeConversationId} />
                            </div>
                        </div>
                    ) : (
                        <EmptyChat />
                    )}
                </div>
            </div>

            {/* Desktop View - Resizable Panels */}
            <div className="hidden lg:flex h-full w-full">
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                    <ResizablePanel
                        defaultSize={25}
                        minSize={15}
                        maxSize={40}
                        className="min-w-[280px]"
                    >
                        <div className="h-full overflow-hidden bg-sidebar border-r border-sidebar-border">
                            <ChatSidebar />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

                    <ResizablePanel defaultSize={75} minSize={50}>
                        <div className="h-full overflow-hidden flex-col bg-background relative">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                                backgroundSize: '32px 32px'
                            }}></div>
                            
                            <div className="relative z-10 flex-1 h-full overflow-hidden flex flex-col w-full">
                                {activeConversationId ? (
                                    <ChatRoom key={activeConversationId} friendId={activeConversationId} />
                                ) : (
                                    <EmptyChat />
                                )}
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default ChatLayout;