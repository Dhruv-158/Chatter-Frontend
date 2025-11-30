import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Users, Compass, User } from 'lucide-react';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'fill-primary/20' : ''}`} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-xs mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
