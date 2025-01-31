import { Layout } from "@/components/Layout";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showId = params.get("showId");
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Get session ID from URL

  const [isProcessing, setIsProcessing] = useState(false); // Prevent duplicate calls

  console.log("Session ID:", sessionId);

  useEffect(() => {
    const confirmBooking = async () => {
      if (!sessionId || isProcessing) return; // Prevent multiple calls
      setIsProcessing(true); // Set processing flag

      try {
        const response = await axiosInstance.post("/payment-success", { sessionId });
        console.log("Payment verification response:", response);
        toast.success("Booking confirmed!");
        navigate("/bookings");
      } catch (error) {
        toast.error("Payment verification failed. Please contact support.");
        navigate("/");
      }
    };

    confirmBooking();
  }, [sessionId]);

  return (
    <Layout>
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Your seats for the show with ID {showId} have been booked successfully. Thank you for your purchase!
        </p>
        <Button className="bg-cinema-red hover:bg-red-700" onClick={() => navigate("/bookings")}>
          View My Bookings
        </Button>
      </div>
    </Layout>
  );
};

export default Success;
