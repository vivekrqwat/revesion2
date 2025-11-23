import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Award, Mail, BookOpen, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import GitGraph from './GitGraph';

const API = import.meta.env.VITE_API_URL;

export default function Alluser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/apii/user/`, {
          withCredentials: true,
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (e) {
        console.error('Error fetching users:', e);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Get user level/badge based on submission count
  const getLeague = (submissionCount = 0) => {
    const count = submissionCount || 0;
    if (count < 500) return { league: 'Note Novice', color: 'bg-blue-100 text-blue-800' };
    if (count < 1000) return { league: 'Idea Initiator', color: 'bg-purple-100 text-purple-800' };
    if (count < 1500) return { league: 'Page Pioneer', color: 'bg-amber-100 text-amber-800' };
    return { league: 'Draft Drifter', color: 'bg-red-100 text-red-800' };
  };

  const getUserInitials = (username = 'User') => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            👥 Community Members
          </h1>
          <p className="text-muted-foreground">
            Explore profiles and contributions from {users.length} community members
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} members
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
            {filteredUsers.map((user) => {
              const league = getLeague(user.submission?.length);
              const userInitials = getUserInitials(user.username);

              return (
                <Card
                  key={user._id}
                  className="bg-card border-border hover:border-primary/50 transition-all duration-200 overflow-hidden"
                >
                
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 p-4 sm:p-5">
                      {/* Left Side - Profile Info */}
                      <div className="space-y-3 sm:space-y-4">
                        {/* Avatar and Name */}
                        <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3">
                          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary">
                            <AvatarImage src='../public/BronzeI.webp' alt={user.username} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="text-center sm:text-left flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                              {user.username}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start min-w-0">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* League Badge */}
                        <Badge className={`${league.color} w-full text-center justify-center py-1 text-xs sm:text-sm`}>
                          {league.league}
                        </Badge>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/50 rounded-lg p-2 sm:p-3 text-center border border-border/50">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-primary mb-1" />
                            <p className="text-sm sm:text-base font-bold text-primary">
                              {user.submission?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Submissions</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 sm:p-3 text-center border border-border/50">
                            <span className="text-sm sm:text-base font-bold text-primary">✨</span>
                            <p className="text-sm sm:text-base font-bold text-primary">
                              {(user.submission?.length / 30).toFixed(1) || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Monthly</p>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <Button
                          onClick={() => navigate(`/profile/${user._id}`)}
                          className="w-full bg-primary hover:bg-primary/90 text-sm py-2 h-9"
                        >
                          View Profile
                        </Button>
                      </div>

                      {/* Right Side - Contribution Graph */}
                      <div className="sm:col-span-1 lg:col-span-2">
                        <div className="bg-muted/20 rounded-lg border border-border/50 p-2 sm:p-3 overflow-x-auto max-h-[400px]">
                          <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                            📊 Contributions
                          </h4>
                          <div className="scale-75 sm:scale-90 lg:scale-100 origin-top-left">
                            <GitGraph activeDays={user.submission || []} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stats Bar */}
                    {/* <div className="border-t border-border/50 bg-muted/30 px-4 sm:px-5 py-2 sm:py-3 flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        <span className="text-xs">{user.notes?.length || 0} notes</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        <span className="text-xs">{user.posts?.length || 0} posts</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-auto text-muted-foreground text-xs">
                        <span>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-semibold text-foreground mb-2">No users found</p>
              <p className="text-muted-foreground text-center">
                {searchTerm ? 'Try adjusting your search terms' : 'No members available'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}