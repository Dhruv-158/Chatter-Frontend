import { 
    Home, 
    Users, 
    Compass,
    User,
    MessageSquare
} from 'lucide-react';

export const sidebarItems = [
    {
        label: 'Messages',
        path: '/messages',
        icon: MessageSquare,
    },
    {
        label: 'Friends',
        path: '/friends',
        icon: Users,
    },
    {
        label: 'Discover',
        path: '/discover',
        icon: Compass,
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: User,
    },
];