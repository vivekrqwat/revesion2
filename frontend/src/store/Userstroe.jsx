import axios from 'axios';
import { toast } from 'react-toastify';
import { create } from 'zustand';

const API = import.meta.env.VITE_API_URL;

export const UserStore = create((set) => ({
  user: null,
  isAutth: false,
  noteid: null,
  postdata: null,
  notedata: null,
  loading: false,

  setnoteid: (id) => {
    set({ noteid: id });
  },

  // ✅ Initialize user from localStorage on app start
  initializeUser: () => {
    try {
      const savedUser = localStorage.getItem('user1');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        set({ user: userData, isAutth: true });
        console.log("User initialized from localStorage:", userData);
      }
    } catch (e) {
      console.error("Failed to initialize user:", e);
      localStorage.removeItem('user1');
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API}/apii/user/check`, {
        withCredentials: true,
      });
      console.log("check auth response:", res.data);
      
      // ✅ Extract user data properly
      const userData = res.data.user || res.data;
      set({ user: userData, isAutth: true, loading: false });
      
      // ✅ Save to localStorage
      localStorage.setItem('user1', JSON.stringify(userData));
    } catch (e) {
      console.error("Auth check failed:", e);
      set({ user: null, isAutth: false, loading: false });
      // normalize key removal
      localStorage.removeItem('user1');
    }
  },

  signup: async (data) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${API}/apii/user/signup`, data, {
        withCredentials: true,
      });
      
      console.log("signup response:", res.data);
      
      // ✅ Extract user data properly
      const userData = res.data.user || res.data;
      set({ user: userData, isAutth: true, loading: false });
      
      // ✅ Save to localStorage
      localStorage.setItem('user1', JSON.stringify(userData));
      toast.success("Account created successfully!");
      
      return userData;
    } catch (e) {
      console.error("Signup error:", e);
      toast.error(e.response?.data?.message || "Signup failed");
      set({ user: null, isAutth: false, loading: false });
      localStorage.removeItem('user1');
    }
  },

  login: async (data) => {
    try {
      set({ loading: true });
      console.log("Logging in with:", data);
      
      const res = await axios.post(`${API}/apii/user/login`, data, {
        withCredentials: true,
      });
      
      console.log("login response:", res.data);
      
      // ✅ CRITICAL FIX: Extract user data properly
      // Backend might return { user: {...}, token: "..." }
      // Or just {...} directly
      const userData =  res.data||res.data.user ;
      
      console.log("Extracted user data:", userData);
      
      // ✅ Update state with actual user data
      set({ user: userData, isAutth: true, loading: false });
      
      // ✅ Save to localStorage for persistence
     
      localStorage.setItem('user1', JSON.stringify(userData));
      
      toast.success("Login successful!");
      return userData;
    } catch (e) {
      console.error("Login error:", e);
     if (e?.response?.status === 429) {
     
      toast.error("Too many login attempts. Try again later.");
      set({ loading: false });
      return; // ⛔ IMPORTANT: Stop further execution
    }
      toast.error(e.response?.data?.message || "Wrong credentials or password");
      set({ user: null, isAutth: false, loading: false });
      localStorage.removeItem('user1');
    }
  },

  logout: async () => {
    try {
      const res = await axios.post(`${API}/apii/user/logout`, null, {
        withCredentials: true,
      });
      console.log("Logout response:", res.data);
      
      // ✅ CRITICAL: Clear everything completely
      set({ user: null, isAutth: false, postdata: null, notedata: null, noteid: null });
      localStorage.removeItem('user1');
      localStorage.removeItem('id');
      localStorage.removeItem('noteid');
      
      toast.success("Logged out successfully");
    } catch (e) {
      console.error("Logout error:", e);
      // Force logout even if API call fails
      set({ user: null, isAutth: false, postdata: null, notedata: null, noteid: null });
      localStorage.removeItem('user1');
      localStorage.removeItem('id');
      localStorage.removeItem('noteid');
    }
  },

  // ✅ Add setUser function for manual updates
  setUser: (userData) => {
    set({ user: userData, isAutth: !!userData });
    if (userData) {
      localStorage.setItem('user1', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user1');
    }
  },

  post: async (id) => {
    try {
      const res = await axios.get(`${API}/apii/post/${id}`);
      console.log("posts fetched for user:", id);
      set({ postdata: res.data });
    } catch (e) {
      console.error("post error:", e);
      set({ postdata: null });
    }
  },

  notes: async (id) => {
    try {
      const res = await axios.get(`${API}/apii/dir/${id}`);
      console.log("notes fetched:", res.data);
      set({ notedata: res.data });
    } catch (e) {
      console.error("notes error:", e);
      set({ notedata: null });
    }
  },
}));