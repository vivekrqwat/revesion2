import axios from "axios";
import React, { useState } from "react";
import { UserStore } from "../store/Userstroe";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const { signup, login, user } = UserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupdata = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const formdata = {
        username: username,
        email: email,
        password: password,
      };
      console.log(user);
      await signup(formdata);
      toast.success("Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-6xl w-full gap-0 items-stretch">
        {/* Left Panel - Signup Form */}
        <Card className="w-full md:w-1/2 bg-card border-0 shadow-xl rounded-r-none md:rounded-r-lg">
          <CardHeader className="space-y-6">
            {/* Logo */}
            <div className="text-center">
              <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-black">
                  NOTE
                </span>
                <span className="text-primary font-black">HUB</span>
              </h1>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Join NoteHub to start organizing your notes
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={signupdata} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-foreground">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="pl-10 bg-muted border-border text-foreground"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-muted border-border text-foreground"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 bg-muted border-border text-foreground"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-muted border-border text-foreground"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary font-semibold hover:underline cursor-pointer transition-colors"
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Welcome Message */}
        <Card className="hidden md:flex w-full md:w-1/2 bg-primary text-primary-foreground border-0 rounded-l-none shadow-xl overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground rounded-full -ml-36 -mb-36" />
          </div>

          {/* Content */}
          <CardContent className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10">
            {/* Logo */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span>NOTE</span>
                <span className="text-yellow-300">_HUB</span>
              </h1>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Join Note<span className="text-yellow-300">Hub!</span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed opacity-90">
                  Start your journey to better learning. NoteHub is a student-friendly platform where
                  you can organize your schedules, store and manage your notes, and collaborate with
                  classmates through discussions and shared resources.
                </p>
              </div>

              <div className="pt-4 space-y-3 opacity-80">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground mt-2 flex-shrink-0" />
                  <p className="text-sm">Organize notes by subjects and topics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground mt-2 flex-shrink-0" />
                  <p className="text-sm">Collaborate with classmates in real-time</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground mt-2 flex-shrink-0" />
                  <p className="text-sm">Access your notes from anywhere</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground mt-2 flex-shrink-0" />
                  <p className="text-sm">Track your learning progress</p>
                </div>
              </div>
            </div>

            {/* Footer Message */}
            <p className="text-xs opacity-75">
              Whether you're preparing for exams or working on group projects, NoteHub keeps
              everything in one place so you can focus on what matters most — learning and growing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;