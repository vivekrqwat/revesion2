import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GitGraph from "./GitGraph";
import scientist from "../avatar/scientist.png";
import { UserStore } from "../store/Userstroe";
import { Trash2, Edit2, Award, MessageSquare, Share2 } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Delete from "../utils/Delete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import ReadMore from "./Readmore";

const API = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState({});
  const { user, post, postdata, notes, notedata } = UserStore();
  const [listdata, setlistdata] = useState();
  const [listname, setlistname] = useState("posts");
  const [title, settitle] = useState({
    league: "Beginner",
    title: "Note Novice",
  });
  const [score, setscore] = useState(0);
  const [expandedImage, setexpandedImage] = useState(null);
  const [openDir, setOpenDir] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [dirdata, setdirdata] = useState([]);

  const isOwnProfile = () => {
    if (!user || !id) return false;
    if (user._id === id) return true;
    if (user.email && user.email === id) return true;
    if (user.username && user.username === id) return true;
    return false;
  };

  const getnotes = async (id) => {
    setOpenDir(openDir === id ? null : id);
    try {
      const notesdata = await axios.get(`${API}/apii/notes/${id}`, {
        withCredentials: true,
      });
      setNotesMap((prev) => ({
        ...prev,
        [id]: notesdata.data,
      }));
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch notes");
    }
  };

  const getGradeColorClass = (grade) => {
    switch (grade) {
      case "green": return "bg-green-500";
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-400";
      default: return "bg-gray-500";
    }
  };

  const delepost = async (itemId) => {
    try {
      if (listname === "posts") {
        await Delete("post", itemId);
        setlistdata((prev) => prev.filter((item) => item._id !== itemId));
        toast.success("Post deleted successfully");
      } else if (listname === "notes") {
        await Delete("dir", itemId);
        await Delete("notes", itemId);
        setlistdata((prev) => prev.filter((item) => item._id !== itemId));
        toast.success("Directory deleted successfully");
      }
    } catch (e) {
      console.log("del", e);
      toast.error("Failed to delete item");
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${API}/apii/user/${id}`, {
          withCredentials: true,
        });
        await post(id);
        await notes(id);
        
        try {
          const dirRes = await axios.get(`${API}/apii/dir/${res.data._id}`, {
            withCredentials: true,
          });
          setdirdata(dirRes.data);
        } catch (err) {
          console.log("Failed to fetch directories:", err);
          setdirdata([]);
        }
        
        setuserdata(res.data);
      } catch (e) {
        console.error("Fetch error details:", e.response?.data || e.message);
        toast.error(e.response?.data?.message || "Failed to fetch user data");
      }
    };
    if (id) {
      fetchdata();
    }
  }, [id, post, notes]);

  const listtransfer = () => {
    if (listname === "posts") {
      setlistdata(postdata);
    } else if (listname === "notes") {
      setlistdata(dirdata);
    }
  };

  useEffect(() => {
    listtransfer();
  }, [listname, postdata, dirdata]);

  const getleauge = (n) => {
    const leagues = [
      { min: 500, max: 800, league: "Beginner", title: "Learning Sprout" },
      { min: 801, max: 1000, league: "Beginner", title: "Fresh Scriber" },
      { min: 1001, max: 1200, league: "Amateur", title: "Rising Scholar" },
      { min: 1201, max: 1500, league: "Amateur", title: "Knowledge Seeker" },
      { min: 1501, max: 1800, league: "Amateur", title: "Syllabus Explorer" },
      { min: 1801, max: 2500, league: "Professional", title: "Note Master" },
      { min: 2501, max: 3500, league: "Professional", title: "Study Strategist" },
      { min: 3501, max: Infinity, league: "Professional", title: "Subject Sensei" },
    ];

    const found = leagues.find((l) => n >= l.min && n <= l.max);
    if (found) {
      settitle({ league: found.league, title: found.title });
    }
  };

  useEffect(() => {
    const submissionLength = user?.submission?.length || 0;
    setscore(submissionLength);
    getleauge(submissionLength);
  }, [user]);

  const userInitials = userdata?.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const leagueColors = {
    Beginner: "bg-blue-100 text-blue-800 border-blue-300",
    Amateur: "bg-purple-100 text-purple-800 border-purple-300",
    Professional: "bg-amber-100 text-amber-800 border-amber-300",
  };

  const leagueBgGradient = {
    Beginner: "from-blue-50 to-blue-100/50",
    Amateur: "from-purple-50 to-purple-100/50",
    Professional: "from-amber-50 to-amber-100/50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-3 sm:p-6 md:p-8">
      {/* <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--color-muted);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          opacity: 0.5;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          opacity: 0.7;
        }
      `}</style> */}
      <div className="max-w-7xl mx-auto">
        {/* Profile Header Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Card - Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-6 shadow-lg overflow-hidden">
                <div className={`h-24 bg-gradient-to-r ${leagueBgGradient[title.league] || leagueBgGradient.Beginner}`} />
                
                <CardContent className="pt-0 pb-6">
                  <div className="flex flex-col items-center text-center space-y-4 -mt-12 relative z-10">
                    <Avatar className="h-28 w-28 border-4 border-card shadow-md">
                      <AvatarImage src='../public/BronzeI.webp' alt={userdata?.username} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold" >
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 px-2">
                      <h2 className="text-2xl font-bold text-foreground">{userdata?.username}</h2>
                      <p className="text-xs text-muted-foreground break-all line-clamp-2">
                        {userdata?.email}
                      </p>
                    </div>

                    {/* Trophy & League Section */}
                    <div className="w-full space-y-3 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-5xl mb-2">
                          <img src="../public/c1.png" alt="" />
                        </div>
                        {/* <Badge className={`${leagueColors[title.league] || leagueColors.Beginner} border`}>
                          {title.league}
                        </Badge> */}

                        
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{title.title}</h3>
                      
                      <div className="flex items-center justify-center gap-2 bg-muted rounded-lg py-3">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold text-primary">{score}</p>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-border">
                      {[
                        { label: "Posts", value: postdata?.length || 0, icon: "📝" },
                        { label: "Notes", value: notedata?.length || 0, icon: "📚" },
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <p className="text-xl">{stat.icon}</p>
                          <p className="text-lg font-bold text-primary mt-1">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    {isOwnProfile() && (
                      <div className="w-full flex gap-2 pt-4 border-t border-border">
                        <Button variant="outline" className="flex-1" size="sm">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Collections Tab */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-2xl">
                    {isOwnProfile() ? "Your Collections" : `${userdata?.username}'s Collections`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="posts" onValueChange={setlistname}>
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border/50">
                      <TabsTrigger value="posts" className="data-[state=active]:bg-card">
                        <span className="mr-2">📝</span>Posts
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="data-[state=active]:bg-card">
                        <span className="mr-2">📂</span>Directories
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="space-y-3 mt-6">
                      {listdata && listdata.length > 0 ? (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-muted">
                          {listdata.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-muted/30 border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                            >
                              <div className="flex gap-4 p-4">
                                <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                <div className="flex-1 min-w-0">
                                  <ReadMore text={item.desc} className="flex-1" />
                                </div>
                                
                                {isOwnProfile() && (
                                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                    >
                                      <Edit2 size={16} />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-card border-border">
                                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this post? This action cannot be undone.
                                        </AlertDialogDescription>
                                        <div className="flex gap-3 justify-end">
                                          <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => delepost(item._id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </div>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                )}
                              </div>
                              {item.img && (
                                <div className="px-4 pb-4">
                                  <img
                                    src={item.img}
                                    alt="post"
                                    className="w-full max-h-96 object-contain rounded-lg bg-black cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setexpandedImage(item.img)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-lg text-muted-foreground">📭 No posts yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="notes" className="mt-6">
                      {listdata && listdata.length > 0 ? (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-muted">
                          {listdata.map((dir) => (
                            <div key={dir._id} className="bg-muted/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-all">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 items-start flex-1">
                                  <div className={`w-4 h-4 rounded flex-shrink-0 mt-1 ${getGradeColorClass(dir.grade)}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">{dir.Dirname}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{dir.desc}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center flex-shrink-0">
                                  {isOwnProfile() && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                          <FaTrash size={14} />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-card border-border">
                                        <AlertDialogTitle>Delete Directory</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this directory? This action cannot be undone.
                                        </AlertDialogDescription>
                                        <div className="flex gap-3 justify-end">
                                          <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => delepost(dir._id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </div>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                  <button 
                                    onClick={() => getnotes(dir._id)}
                                    className="p-2 hover:bg-muted rounded-md transition-all"
                                  >
                                    <FiChevronDown
                                      className={`transition-transform duration-300 ${openDir === dir._id ? "rotate-180" : ""}`}
                                      size={18}
                                    />
                                  </button>
                                </div>
                              </div>

                              {openDir === dir._id && notesMap[dir._id]?.length > 0 && (
                                <div className="mt-4 space-y-2 border-t border-border pt-4">
                                  {notesMap[dir._id].map((note) => (
                                    <div
                                      key={note._id}
                                      className="flex items-start gap-3 bg-card p-3 rounded-md hover:bg-muted/50 transition-all cursor-pointer border border-border/50"
                                      onClick={() => {
                                        localStorage.setItem("noteid", note._id);
                                        navigate(`/notes/${id}`);
                                      }}
                                    >
                                      <div className="mt-1 flex-shrink-0">
                                        <span className={`w-3 h-3 rounded block ${getGradeColorClass(note.grade)}`} />
                                      </div>
                                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm truncate">{note.heading}</p>
                                          <p className="text-muted-foreground text-xs line-clamp-1">{note.desc}</p>
                                        </div>
                                        <FaArrowRight className="text-xs text-muted-foreground rotate-90 flex-shrink-0" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-lg text-muted-foreground">📂 No directories yet</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Contribution Graph */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-xl">📊 Contribution Graph</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 overflow-x-auto">
                  <GitGraph activeDays={userdata?.submission} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setexpandedImage(null)}
        >
          <div className="relative">
            <img
              src={expandedImage}
              alt="expanded"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setexpandedImage(null)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;