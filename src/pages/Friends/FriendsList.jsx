import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, MoreVertical, UserMinus, Search, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFriendsList, useFriendActions } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5500/api/').replace(/\/$/, '');
  return `${baseUrl}${imagePath}`;
};

const FriendsList = () => {
  const navigate = useNavigate();
  // fetchOnMount: false because FriendsPage already fetches the data
  const { friends, isLoading, refetchFriends } = useFriendsList({ fetchOnMount: false });
  const { unfriend } = useFriendActions();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter friends based on search - ensure friends is an array
  const filteredFriends = Array.isArray(friends) 
    ? friends.filter(friend =>
        friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleUnfriend = async (friendId, friendName) => {
    if (confirm(`Are you sure you want to unfriend ${friendName}?`)) {
      const result = await unfriend(friendId);
      if (result.success) {
        refetchFriends();
      }
    }
  };

  const handleMessage = (friendId) => {
    navigate(`/messages/${friendId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-border/50 bg-card/50 space-y-4">
            <div className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full mb-4" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
            <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">No friends yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-base mb-8">
          Your friend list is empty. Start connecting with people to build your network!
        </p>
        <Button 
          onClick={() => navigate('/discover')} 
          size="lg"
          className="rounded-full px-8 shadow-lg hover:shadow-primary/25 transition-all duration-300"
        >
          Discover People
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto md:mx-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search your friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Friends Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          Showing {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
        </div>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFriends.map((friend, index) => (
          <div 
            key={friend._id} 
            className="group relative bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleMessage(friend._id)}
          >
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Avatar className="w-24 h-24 ring-4 ring-background group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage src={getFullImageUrl(friend.profilePicture)} alt={friend.fullName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                    {friend.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {friend.isOnline && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-background rounded-full"></span>
                )}
              </div>

              {/* Info */}
              <div className="mb-6 w-full space-y-1">
                <h4 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                  {friend.fullName}
                </h4>
                <p className="text-sm text-muted-foreground truncate font-medium">
                  @{friend.username}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full">
                <Button 
                  className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold rounded-xl transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(friend._id);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${friend._id}`);
                      }} 
                      className="rounded-lg cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfriend(friend._id, friend.fullName);
                      }}
                      className="text-destructive focus:text-destructive rounded-lg cursor-pointer"
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfriend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFriends.length === 0 && searchQuery && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            No friends found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
