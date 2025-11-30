import React from 'react';
import { Logo } from '@/components/ui/Logo';

const EmptyChat = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-background">
            <div className="text-center space-y-6 p-8 max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                    <Logo className="w-12 h-12 text-primary-foreground" />
                </div>
                
                {/* Title & Description */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome to Chattr
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Select a conversation from the sidebar or start a new chat with your friends
                    </p>
                </div>

                {/* Hint */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Choose a friend to begin</span>
                </div>
            </div>
        </div>
    );
};

export default EmptyChat;