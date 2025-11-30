import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFriendRequests, useFriendsList } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Check, X, UserPlus } from 'lucide-react';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5500/api/').replace(/\/$/, '');
  return `${baseUrl}${imagePath}`;
};

const FriendRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // fetchOnMount: false because FriendsPage already fetches the data
  const { pendingRequests, isLoading, acceptRequest, rejectRequest } = useFriendRequests({ fetchOnMount: false });
  const { refetchFriends } = useFriendsList({ fetchOnMount: false });

  const handleAccept = async (requestId, userName) => {
    const result = await acceptRequest(requestId);
    if (result.success) {
      toast({
        title: 'Friend request accepted',
        description: `You are now friends with ${userName}`,
      });
      // Refetch friends list to show the new friend
      refetchFriends();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to accept request',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (requestId, userName) => {
    const result = await rejectRequest(requestId);
    if (result.success) {
      toast({
        title: 'Request rejected',
        description: `Friend request from ${userName} was declined`,
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to reject request',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
            <UserPlus className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2 tracking-tight">No pending requests</h3>
        <p className="text-muted-foreground max-w-xs mx-auto text-base">
          When people send you friend requests, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold tracking-tight">Friend Requests</h2>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {pendingRequests.length} Pending
        </span>
      </div>

      <div className="grid gap-4">
        {Array.isArray(pendingRequests) && pendingRequests.map((request, index) => {
          // Handle both object and ID formats from backend
          const fromUser = request.from || request.sender || {};
          const userName = fromUser.fullName || fromUser.username || 'Unknown User';
          const userUsername = fromUser.username || '';
          const userProfilePicture = getFullImageUrl(fromUser.profilePicture || fromUser.avatar || fromUser.profilePhoto);

          return (
            <div 
              key={request._id} 
              className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-card/40 hover:bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/20 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden cursor-pointer" onClick={() => navigate(`/profile/${fromUser._id}`)}>
                <Avatar className="w-14 h-14 border-2 border-background ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                  <AvatarImage src={userProfilePicture} alt={userName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                    {userName}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">@{userUsername}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                    <span className="truncate">Sent a request</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <Button
                  onClick={() => handleAccept(request._id, userName)}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleReject(request._id, userName)}
                  className="flex-1 sm:flex-none bg-secondary/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequests;
