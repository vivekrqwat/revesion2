import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/Userstroe";
import Upload from "../utils/Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus, Send, Loader2, Plus, X, Heart, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ReadMore from "./Readmore";

const API = import.meta.env.VITE_API_URL;

export default function Discussion() {
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState();
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const { user } = UserStore();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/apii/post/`);
      setPost(res.data);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning("Please write a message");
      return;
    }

    try {
      let imgUrl = "";
      setloading(true);

      if (image) {
        imgUrl = await Upload(image);
      }

      const postdata = {
        uid: "",
        username: user.username,
        email: user?.email,
        desc: message,
        img: imgUrl,
      };

      await axios.post(`${API}/apii/post/`, postdata, {
        withCredentials: true,
      });
      console.log("Post created successfully");

      setMessage("");
      setImage(null);
      setPreviewImage(null);
      setOpenDialog(false);
      fetchPosts();
      toast.success("Post published successfully!");
    } catch (e) {
      console.log("Post error:", e);
      toast.error("Failed to publish post");
    } finally {
      setloading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (userId) => {
    console.log("Navigating to profile with user ID:", userId);
    const profileId = userId;
    navigate(`/profile/${profileId}`);
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `${API}/apii/post/like/${postId}`,
        {},
        { withCredentials: true }
      );
      setPost(post.map(p => p._id === postId ? res.data : p));
    } catch (e) {
      console.log(e);
      toast.error("Failed to like post");
    }
  };

  const handleAddComment = async (postId, text) => {
    if (!text.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/apii/post/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      setPost(post.map(p => p._id === postId ? res.data : p));
      setCommentText({ ...commentText, [postId]: "" });
      toast.success("Comment added!");
    } catch (e) {
      console.log(e);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(
        `${API}/apii/post/comment/${postId}/${commentId}`,
        { withCredentials: true }
      );
      setPost(post.map(p => p._id === postId ? res.data : p));
      toast.success("Comment deleted!");
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete comment");
    }
  };

  const formatDateOnly = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-[calc(100vh-100px)] w-full bg-[var(--bg)] rounded-lg p-4 flex flex-col overflow-hidden relative transition-colors duration-300">
      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
          <p className="text-sm text-[var(--muted)]">
            Publishing your post...
          </p>
        </div>
      )}

      {/* Posts Feed */}
      {!loading && (
        <div className="flex-1 overflow-y-auto space-y-3 p-2">
          {post.length > 0 ? (
            post.map((p) => (
              <Card
                key={p._id}
                className="bg-[var(--color-card)] border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors"
              >
                <CardContent className="p-4 space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleAvatarClick(p.uid || p._id)}
                    >
                      <AvatarImage src='https://api-assets.clashofclans.com/leagues/288/U2acNDRaR5rQDu4Z6pQKaGcjWm9dkSnHMAPZCXrHPB4.png' alt={p.username} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-[var(--color-text)]">
                        {p.username}
                      </p>
                      <p className="text-xs text-[var(--muted)] truncate">
                        {p.email}
                      </p>
                    </div>
                    <div className="text-xs text-[var(--muted)] ml-auto">
                      {formatDateOnly(p.createdAt)}
                    </div>
                  </div>

                  {/* Message */}
                  <ReadMore text={p.desc} />

                  {/* Image */}
                  {p.img && (
                    <img
                      src={p.img}
                      alt="post-image"
                      className="w-full max-h-96 object-contain object-center rounded-lg bg-[var(--border)]"
                    />
                  )}

                  {/* Like and Comment Section */}
                  <div className="pt-3 border-t border-[var(--border)] space-y-3">

                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(p._id)}
                        className={`gap-2 ${
                          p.likes?.includes(user?._id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-[var(--muted)] hover:text-[var(--color-text)]"
                        }`}
                      >
                        <Heart
                          size={18}
                          fill={p.likes?.includes(user?._id) ? "currentColor" : "none"}
                        />
                        <span className="text-xs">{p.likes?.length || 0}</span>
                      </Button>

                      {/* Comments Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedComments({
                            ...expandedComments,
                            [p._id]: !expandedComments[p._id],
                          })
                        }
                        className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--color-text)] transition-colors"
                      >
                        <MessageCircle size={10} />
                        <span>{p.comments?.length || 0} comments</span>
                      </Button>
                    </div>

                    {/* Comments Section - Show/Hide on Click */}
                    {expandedComments[p._id] && (
                      <div className="space-y-3 pt-2 border-t border-[var(--border)]/50">
                        {/* Display Comments */}
                        {p.comments && p.comments.length > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {p.comments.map((comment) => (
                              <div key={comment._id} className="text-xs space-y-1 bg-[var(--border)]/20 p-2 rounded">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-[var(--color-text)]">
                                      {comment.userName}
                                    </p>
                                    <p className="text-[var(--muted)] break-words">
                                      {comment.text}
                                    </p>
                                  </div>
                                  {comment.userId === user?._id && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteComment(p._id, comment._id)
                                      }
                                      className="text-red-500 hover:text-red-600 h-auto p-1 flex-shrink-0"
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* No Comments Message */}
                        {(!p.comments || p.comments.length === 0) && (
                          <p className="text-xs text-[var(--muted)] text-center py-2">
                            No comments yet. Be the first to comment!
                          </p>
                        )}

                        {/* Add Comment Input */}
                        <div className="flex gap-2 pt-2 border-t border-[var(--border)]/50">
                          <Input
                            placeholder="Add a comment..."
                            value={commentText[p._id] || ""}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [p._id]: e.target.value })
                            }
                            className="h-8 text-xs bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)]"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(p._id, commentText[p._id]);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddComment(p._id, commentText[p._id])
                            }
                            className="h-8 px-2 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white"
                          >
                            <Send size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[var(--muted)] text-center">
                No posts yet. Be the first to share!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating + Button */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 left-6 rounded-full w-14 h-14 p-0 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
            title="Create Post"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>

        {/* Create Post Dialog */}
        <DialogContent className="bg-[var(--color-card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--color-text)]">Create a New Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text)]">
                What's on your mind?
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                rows={5}
                className="bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)] placeholder-[var(--muted)] resize-none"
                disabled={loading}
              />
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Image Preview
                </p>
                <div className="relative inline-block w-full">
                  <img
                    src={previewImage}
                    alt="preview"
                    className="w-full max-h-48 object-cover rounded-lg border border-[var(--border)]"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreviewImage(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)] block mb-2">
                Add Image
              </label>
              <label className="cursor-pointer flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors">
                <ImagePlus className="h-5 w-5 text-[var(--muted)]" />
                <span className="text-sm text-[var(--muted)]">
                  {image ? "Change Image" : "Upload Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenDialog(false);
                  setMessage("");
                  setImage(null);
                  setPreviewImage(null);
                }}
                disabled={loading}
                className="border-[var(--border)] text-[var(--color-text)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}