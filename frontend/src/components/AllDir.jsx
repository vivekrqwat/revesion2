import React, { useEffect, useState } from 'react';
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
import Directory from './Directory';
import { DirectorySkeleton } from './Sekelton ';

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
      console.log('Fetched directories:', res.data);
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

  // Upvote directory
  const upvoteDirectory = async (e, dirId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `${API}/apii/dir/upvote/${dirId}`,
        {},
        { withCredentials: true }
      );
      
      setDirectories((prev) =>
        prev.map((dir) =>
          dir._id === dirId
            ? { ...dir, upvotes: res.data.upvotes, hasUpvoted: res.data.hasUpvoted }
            : dir
        )
      );
      
      setFilteredDirs((prev) =>
        prev.map((dir) =>
          dir._id === dirId
            ? { ...dir, upvotes: res.data.upvotes, hasUpvoted: res.data.hasUpvoted }
            : dir
        )
      );
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

  // Get difficulty level from grade
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
        return 'bg-green-500/10 text-green-600';
      case 'red':
      case 'Red':
        return 'bg-red-500/10 text-red-600';
      case 'yellow':
      case 'Yellow':
        return 'bg-yellow-500/10 text-yellow-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
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
    return <DirectorySkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--color-text)] p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Public Directories/Reading AREA
          </h1>
          <p className="text-[var(--muted)]">
            Explore and learn from public directories shared by the community
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[var(--color-card)] border border-[var(--border)] rounded-lg p-3">
          <Input
            placeholder="Search directories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)] placeholder-[var(--muted)]"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-[var(--muted)]">
          Showing {filteredDirs.length} of {directories.length} directories
        </div>

        {/* Directories Grid */}
        {filteredDirs.length > 0 ? (
          <div className="space-y-4">
            {filteredDirs.filter((id) => id.isPublic == true).map((dir) => (
              <div
                key={dir._id}
                className="bg-[var(--color-card)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-200 overflow-hidden rounded-lg"
              >
                {/* Directory Header */}
                <div className="p-5 border-b border-[var(--border)]/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${getGradeIndicator(
                          dir.grade
                        )}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-[var(--color-text)] truncate">
                            {dir.Dirname}
                          </h3>
                          <Badge className={getGradeColor(dir.grade)}>
                            {getLevel(dir.grade)}
                          </Badge>
                          {isOwner(dir.uid) && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              <Lock className="w-3 h-3 mr-1" />
                              Your Directory
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
                          {dir.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchNotesForDir(dir._id)}
                        className="text-[var(--primary)] hover:bg-[var(--primary)]/10"
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
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted)]">
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
                          : 'text-[var(--muted)] hover:text-blue-500'
                      }`}
                      onClick={(e) => upvoteDirectory(e, dir._id)}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {dir.upvotes || 0}
                    </Button>
                  </div>
                </div>

                {/* Expanded Notes Section */}
                {expandedDir === dir._id && notesMap[dir._id] && (
                  <div className="bg-[var(--border)]/10 p-4 space-y-2 border-t border-[var(--border)]/50">
                    {notesMap[dir._id].length > 0 ? (
                      notesMap[dir._id].map((note) => (
                        <div
                          key={note._id}
                          className="flex items-start gap-3 bg-[var(--color-card)] p-3 rounded-md hover:bg-[var(--border)]/20 transition-all cursor-pointer border border-[var(--border)]/50"
                          onClick={() => {
                            localStorage.setItem("noteid", note._id);
                            navigate(`/notes/${id}`);
                          }}
                        >
                          <div className="mt-1 flex-shrink-0">
                            <span
                              className={`w-3 h-3 rounded block ${getGradeIndicator(
                                note.grade
                              )}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[var(--color-text)] hover:text-[var(--primary)] transition-colors truncate">
                              {note.heading}
                            </p>
                            <p className="text-xs text-[var(--muted)] line-clamp-2 mt-1">
                              {note.desc}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-[var(--muted)] py-4">
                        No notes in this directory
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-card)] border border-[var(--border)] rounded-lg">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
                No directories found
              </p>
              <p className="text-[var(--muted)] text-center">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No public directories available yet'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllDir;