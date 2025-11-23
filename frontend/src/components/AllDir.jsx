// Check if current user owns the directory
  const isOwner = (dirUid) => {
    return user && user._id === dirUid;
  };

  // Upvote note
  const upvoteNote = async (e, noteId, dirId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `${API}/apii/note/upvote/${noteId}`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setNotesMap((prev) => ({
        ...prev,
        [dirId]: prev[dirId].map((note) =>
          note._id === noteId
            ? { ...note, upvotes: res.data.upvotes, hasUpvoted: res.data.hasUpvoted }
            : note
        ),
      }));
      
      toast.success(res.data.message || 'Upvoted successfully');
    } catch (e) {
      console.error('Error upvoting note:', e);
      toast.error('Failed to upvote');
    }
  };import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserStore } from '../store/Userstroe';
import { Eye, Lock, Edit2, Trash2, ChevronDown, ThumbsUp, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const API = import.meta.env.VITE_API_URL;

function AllDir() {
  const navigate = useNavigate();
  const { user } = UserStore();
  const [directories, setDirectories] = useState([]);
  const [filteredDirs, setFilteredDirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDir, setExpandedDir] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [loadingNotes, setLoadingNotes] = useState({});
    const { id } = useParams();

  // Fetch all public directories
  const fetchAllDirectories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/apii/dir/allone`, {
        withCredentials: true,
      });
      setDirectories(res.data);
      setFilteredDirs(res.data);
    } catch (e) {
      console.error('Error fetching directories:', e);
      toast.error('Failed to fetch directories');
      setDirectories([]);
      setFilteredDirs([]);
    } finally {
      setLoading(false);
    }
  };
  //upvote dir
   const upvoteDirectory = async (e, dirId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `${API}/apii/dir/upvote/${dirId}`,
        {},
        { withCredentials: true }
      );
      
      // Update local state for directories
      setDirectories((prev) =>
        prev.map((dir) =>
          dir._id === dirId
            ? { ...dir, upvotes: res.data.upvotes, hasUpvoted: res.data.hasUpvoted }
            : dir
        )
      );
      
      // Also update filtered directories
      setFilteredDirs((prev) =>
        prev.map((dir) =>
          dir._id === dirId
            ? { ...dir, upvotes: res.data.upvotes, hasUpvoted: res.data.hasUpvoted }
            : dir
        )
      );
      
    //   toast.success(res.data.message || 'Upvoted successfully');
    } catch (e) {
      console.error('Error upvoting directory:', e);
      toast.error('Failed to upvote directory');
    }
  };

  // Fetch notes for a specific directory
  const fetchNotesForDir = async (dirId) => {
    if (notesMap[dirId]) {
      setExpandedDir(expandedDir === dirId ? null : dirId);
      return;
    }

    try {
      setLoadingNotes((prev) => ({ ...prev, [dirId]: true }));
      const res = await axios.get(`${API}/apii/notes/${dirId}`, {
        withCredentials: true,
      });
      setNotesMap((prev) => ({
        ...prev,
        [dirId]: res.data,
      }));
      setExpandedDir(expandedDir === dirId ? null : dirId);
    } catch (e) {
      console.error('Error fetching notes:', e);
      toast.error('Failed to fetch notes');
    } finally {
      setLoadingNotes((prev) => ({ ...prev, [dirId]: false }));
    }
  };

  //check leve
  const getLevel = (grade) => {
  if (grade === "green") return "Beginner";
  if (grade === "red") return "Advanced";
  return "Intermediate";
};
  // Check if current user owns the directory
  const isOwner = (dirUid) => {
    return user && user._id === dirUid;
  };

  // Delete directory (only for owner)
  const deleteDirectory = async (dirId) => {
    try {
      await axios.delete(`${API}/apii/dir/${dirId}`, {
        withCredentials: true,
      });
      setDirectories((prev) => prev.filter((dir) => dir._id !== dirId));
      setFilteredDirs((prev) => prev.filter((dir) => dir._id !== dirId));
      toast.success('Directory deleted successfully');
    } catch (e) {
      console.error('Error deleting directory:', e);
      toast.error('Failed to delete directory');
    }
  };

  // Handle search/filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDirs(directories);
    } else {
      const filtered = directories.filter((dir) =>
        dir.Dirname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dir.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDirs(filtered);
    }
  }, [searchTerm, directories]);

  useEffect(() => {
    fetchAllDirectories();
  }, []);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'green':
      case 'Green':
        return 'bg-green-100 text-green-800';
      case 'red':
      case 'Red':
        return 'bg-red-100 text-red-800';
      case 'yellow':
      case 'Yellow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeIndicator = (grade) => {
    switch (grade) {
      case 'green':
      case 'Green':
        return 'bg-green-500';
      case 'red':
      case 'Red':
        return 'bg-red-500';
      case 'yellow':
      case 'Yellow':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Public Directories/Reading AREA</h1>
          <p className="text-muted-foreground">
            Explore and learn from public directories shared by the community
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Input
              placeholder="Search directories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted border-border"
            />
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredDirs.length} of {directories.length} directories
        </div>

        {/* Directories Grid */}
        {filteredDirs.length > 0 ? (
          <div className="space-y-4">
            {filteredDirs.filter((id)=>id.isPublic==true).map((dir) => (


              <Card
                key={dir._id}
                className="bg-card border-border hover:border-primary/50 transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Directory Header */}
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${getGradeIndicator(dir.grade)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {dir.Dirname}
                            </h3>
                            <Badge className={getGradeColor(dir.grade)}>
                                {getLevel(dir.grade)}
                            </Badge>
                            {isOwner(dir.uid) && (
                              <Badge variant="outline" className="bg-blue-500">
                                <Lock className="w-3 h-3 mr-1" />
                                Your Directory
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {dir.desc}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        {/* {isOwner(dir.uid) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border">
                                <AlertDialogTitle>Delete Directory</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{dir.Dirname}"? This action cannot be undone.
                                </AlertDialogDescription>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteDirectory(dir._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )} */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNotesForDir(dir._id)}
                          className="text-primary hover:bg-primary/10"
                        >
                          {loadingNotes[dir._id] ? (
                            <span className="animate-spin">⟳</span>
                          ) : (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                expandedDir === dir._id ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{dir.topic?.length || 0} notes</span>
                      <span>
                        {new Date(dir.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`ml-auto px-2 ${
                          dir.hasUpvoted
                            ? 'text-blue-500 bg-blue-500/10'
                            : 'text-muted-foreground hover:text-blue-500'
                        }`}
                        onClick={(e) => upvoteDirectory(e, dir._id, dir.upvotes)}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {dir.upvotes || 0}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Notes Section */}
                  {expandedDir === dir._id && notesMap[dir._id] && (
                    <div className="bg-muted/30 p-4 space-y-2 border-t border-border/50">
                      {notesMap[dir._id].length > 0 ? (
                        notesMap[dir._id].map((note) => (
                                    <div
                                      key={note._id}
                                      className="flex items-start gap-3 bg-card p-3 rounded-md hover:bg-muted/50 transition-all cursor-pointer border border-border/50"
                                      onClick={() => {
                                        localStorage.setItem("noteid", note._id);
                                        navigate(`/notes/${id}`);
                            }}
                          >
                            <div className="mt-1 flex-shrink-0">
                              <span className={`w-3 h-3 rounded block ${getGradeIndicator(note.grade)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                {note.heading}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {note.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`${
                                  note.hasUpvoted
                                    ? 'text-blue-500 bg-blue-500/10'
                                    : 'text-muted-foreground hover:text-blue-500'
                                }`}
                                onClick={(e) => upvoteNote(e, note._id, dir._id)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {note.upvotes || 0}
                              </Button>
                              {!isOwner(dir.uid) ? (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <span className="text-xs text-primary font-medium">Edit</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                          No notes in this directory
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-lg font-semibold text-foreground mb-2">No directories found</p>
              <p className="text-muted-foreground text-center">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No public directories available yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AllDir;