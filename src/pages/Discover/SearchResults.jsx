import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Clock, Users, Search, UserMinus, ArrowRight } from 'lucide-react';
import { useFriendActions } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { checkFriendshipStatus, removeFriend } from '@/services/friendService';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5500/api/').replace(/\/$/, '');
  return `${baseUrl}${imagePath}`;
};

const UserResultItem = ({ user, index }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('none');
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { sendRequest, isPerformingAction } = useFriendActions();

  // Check friendship status on mount and when user changes
  useEffect(() => {
    const fetchStatus = async () => {
      setIsCheckingStatus(true);
      const result = await checkFriendshipStatus(user._id);
      if (result.success) {
        // Handle nested response formats
        let statusData = result.data;
        
        // If data has a nested structure like {success: true, data: {...}}
        if (statusData && typeof statusData === 'object' && statusData.data) {
          statusData = statusData.data;
        }
        
        // Extract the actual status string
        const actualStatus = statusData?.status || statusData;
        
        setStatus(actualStatus);
      } else {
        console.error('Failed to check status:', result.error);
        setStatus('none');
      }
      setIsCheckingStatus(false);
    };
    
    if (user._id) {
      fetchStatus();
    }
  }, [user._id]);

  const handleSendRequest = async () => {
    const result = await sendRequest(user._id);
    if (result.success) {
      toast({
        title: 'Request sent',
        description: `Friend request sent to ${user.username || user.name}`,
      });
      // Update local status
      setStatus('sent');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to send request',
        variant: 'destructive',
      });
    }
  };

  const handleUnfriend = async () => {
    const result = await removeFriend(user._id);
    if (result.success) {
      toast({
        title: 'Friend removed',
        description: `You are no longer friends with ${user.username || user.name}`,
      });
      // Update local status
      setStatus('none');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to remove friend',
        variant: 'destructive',
      });
    }
  };

  const isFriend = status === 'friends' || status === 'friend';
  const isPending = status === 'pending' || status === 'request_received';
  const isSent = status === 'sent' || status === 'request_sent';
  const isNone = status === 'none' || status === 'not_friends' || !status;

  const getActionButton = () => {
    // Show loading state while checking status
    if (isCheckingStatus) {
      return (
        <div className="w-9 h-9 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      );
    }

    if (isFriend) {
      return (
        <Button 
          variant="ghost" 
          onClick={handleUnfriend}
          className="h-9 w-9 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          disabled={isPerformingAction}
          title="Unfriend"
        >
          <UserMinus className="w-5 h-5" />
        </Button>
      );
    }

    if (isPending) {
      return (
        <Button 
          variant="secondary" 
          onClick={() => navigate('/friends?tab=requests')}
          className="h-9 px-4 text-xs font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Respond
        </Button>
      );
    }

    if (isSent) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Pending</span>
        </div>
      );
    }

    if (isNone) {
      return (
        <Button 
          onClick={handleSendRequest} 
          className="h-9 w-9 p-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-primary/25 transition-all"
          disabled={isPerformingAction}
          title="Add Friend"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      );
    }

    return null;
  };

  const profilePicture = getFullImageUrl(user.profilePicture);
  const userName = user.username || user.name || 'Unknown User';

  return (
    <div 
        className="group flex items-center justify-between p-4 bg-card/40 hover:bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/20 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
        style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4 overflow-hidden cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
        <Avatar className="w-12 h-12 border-2 border-background ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
          <AvatarImage src={profilePicture} alt={userName} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
            {userName}
          </h3>
          <p className="text-sm text-muted-foreground truncate font-medium">
            @{user.username || 'username'}
          </p>
        </div>
      </div>

      <div className="pl-3">
        {getActionButton()}
      </div>
    </div>
  );
};

const SearchResults = ({ results, isLoading, query }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-card/30 rounded-2xl border border-border/30">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No results found</h3>
        <p className="text-muted-foreground text-sm">
          We couldn't find any users matching "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-2 pb-2 flex items-center justify-between border-b border-border/40">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Global Search Results
        </h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {results.length} found
        </span>
      </div>

      <div className="space-y-3">
        {Array.isArray(results) && results.map((user, index) => (
          <UserResultItem key={user._id} user={user} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
