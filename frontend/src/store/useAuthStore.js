import { create } from "zustand";
import axiosInstance from "../lib/axios";
 
import { toast } from "../hooks/use-toast";

export const useAuthStore = create((set) => ({
     

  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  // Check Auth Function
  checkAuth: async () => {
    

    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("fdsfs" , res.data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup Function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast({
        title: "Success",
        description: "Account created successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login Function
  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast({
        title: "Welcome Back!",
        description: "You are logged in successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLogginIn: false });
    }
  },

  // Logout Function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  },

  // Update Profile Function
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
