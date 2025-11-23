import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserStore } from "../store/Userstroe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ProfileRight() {
  const { user, setUser } = UserStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stopwatch states
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("stopwatchSessions");
    return saved ? JSON.parse(saved) : [];
  });

  const localUser = JSON.parse(localStorage.getItem("user1") || "{}");
console.log("Local Usegur");
  // Fetch fresh user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?._id) return;

        setLoading(true);
        const response = await axios.get(`${API}/apii/user/${user._id}`, {
          withCredentials: true,
        });

        const newData = response.data;
        setUserData(newData);

        if (setUser) {
          setUser({
            ...localUser,
            ...newData,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id, setUser]);

  // Stopwatch timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time to MM:SS:MS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handlePlay = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (time > 0) {
      setSessions([...sessions, { time, date: new Date().toLocaleString() }]);
      localStorage.setItem("stopwatchSessions", JSON.stringify([...sessions, { time, date: new Date().toLocaleString() }]));
    }
    setTime(0);
  };

  const currentUser = userData || localUser || user;

  const username =
    currentUser?.username ||
    localUser?.user ||
    "User";

  const userInitials =
    username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleNavigateToProfile = () => {
    if (currentUser?._id||currentUser?.id) {
      localStorage.setItem("id", currentUser._id);
      navigate(`/profile/${currentUser._id||currentUser.id}`);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-card p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card p-4 sm:p-5 space-y-4 lg:space-y-6 overflow-y-auto">
      
      {/* Profile Card */}
      <Card
        className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer shadow-sm"
        onClick={handleNavigateToProfile}
      >
        <CardHeader className="pb-3 text-center">
          <div className="flex justify-center mb-3">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src='../public/BronzeI.webp' alt={username} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          <CardTitle className="text-sm font-semibold truncate">
            {currentUser?.username || localUser?.user || "No Name"}
          </CardTitle>

          <p className="text-xs text-muted-foreground truncate mt-1">
            {currentUser?.email || localUser?.eamil || "No email"}
          </p>
        </CardHeader>
      </Card>

      {/* Stopwatch Card */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">⏱️ Study Timer</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Timer Display */}
          <div className="flex justify-center items-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary font-mono">
              {formatTime(time)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            {!isRunning ? (
              <Button
                onClick={handlePlay}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            )}

            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="border-border"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          {/* Sessions List */}
          {sessions.length > 0 && (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Recent Sessions
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {sessions.slice(-5).reverse().map((session, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded bg-muted/30 text-xs"
                  >
                    <span className="text-muted-foreground">
                      {formatTime(session.time)}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {new Date(session.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Report */}
      <Card className="bg-card border-border shadow-sm flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">📊 Progress Report</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            { label: "Submissions", value: currentUser?.submission?.length || 0, max: 100 },
            { label: "Engagement", value:currentUser?.submission?.length*3||0 , max: 100 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-xs text-primary font-semibold">
                  {item.value}{item.max ? "%" : ""}
                </span>
              </div>
              <Progress 
                value={item.max ? item.value : Math.min((item.value / item.max) * 100, 100)} 
                className="h-2" 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* View Profile Button */}
      <Button
        onClick={handleNavigateToProfile}
        className="w-full bg-primary hover:bg-primary/90"
      >
        View Full Profile
      </Button>
    </div>
  );
}