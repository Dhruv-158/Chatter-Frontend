import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Clock, UserCheck } from 'lucide-react';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import SentRequests from './SentRequests';
import { useFriendsList, useFriendRequests, useSentRequests } from '@/hooks';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Get counts for badges - fetch on mount to show badge counts
  // Note: fetchOnMount is true, but child components should use fetchOnMount: false to avoid duplicate requests
  const { friendsCount } = useFriendsList({ fetchOnMount: true });
  const { requestsCount } = useFriendRequests({ fetchOnMount: true });
  const { requestsCount: sentCount } = useSentRequests({ fetchOnMount: true });

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              All Friends
            </TabsTrigger>
            
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Requests
              {requestsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {requestsCount}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sent
              {sentCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {sentCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* All Friends Tab */}
          <TabsContent value="all" className="mt-6">
            <FriendsList />
          </TabsContent>

          {/* Friend Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <FriendRequests />
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent" className="mt-6">
            <SentRequests />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FriendsPage;
