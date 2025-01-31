import { Toaster } from "@/components/ui/toaster"; // ShadCN Toaster
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthStore } from "./store/useAuthStore";
 
import { Loader2 } from "lucide-react";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Bookings from "./pages/Bookings";
 

const queryClient = new QueryClient();

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loader while checking authentication
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/seat-selection/:id" element={<SeatSelection />} />
            <Route path="/profile" element={authUser ? <Profile /> :  <Login />  } />
            <Route path="/login" element={authUser ? <Index /> :  <Login />  } />
            <Route path="/signup" element={authUser ? <Index /> : <Signup />} />
            <Route path="/payment/:showId" element={<Payment /> } />
            <Route path="/success" element={<Success /> } />
            <Route path="/cancel" element={<Cancel /> } />
            <Route path="/bookings" element={<Bookings/>} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
