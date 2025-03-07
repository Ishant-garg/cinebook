import { Layout } from "@/components/Layout";
import { SeatMap } from "@/components/SeatMap";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import useShowStore from "../store/useShowStore";
import { useAuthStore } from "../store/useAuthStore"; // Import your custom auth store
import toast from "react-hot-toast";

const SeatSelection = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { authUser, checkAuth } = useAuthStore();

  // Extract Zustand store actions and state
  const {
    showDetails,
    selectedSeats,
    fetchShowDetails,
    clearSelection,
    reserveSeats,
    releaseLockedSeats,
  } = useShowStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch show details and release locked seats on component load
  useEffect(() => {
    const initialize = async () => {
      await releaseLockedSeats(showId); // Release expired locked seats
      await fetchShowDetails(showId); // Fetch show details
    };

    initialize();

    
  }, [showId, releaseLockedSeats, fetchShowDetails, clearSelection]);

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      return;
    }

    if (!authUser) {
      // Save current path to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", `/shows/${showId}/seats`);
      toast.error("Please login to continue with booking");
      navigate("/login");
      return;
    }

    // Try to reserve the seats
    const success = await reserveSeats(showId);
    // console.log('ssssssssssssssssssssss' , success);
    if (success) {
      navigate(`/payment/${showId}`);
    } else {
      toast.error("Sorry, some seats are no longer available. Please try different seats.");
      // await releaseLockedSeats(showId); // Ensure expired locked seats are released
      await fetchShowDetails(showId); // Refresh seat map
      clearSelection(); // Clear the user's selection
    }
  };

  if (!showDetails) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-8 mb-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">SELECT SEATS</span>
            <span className="text-gray-400">{">"}</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <SeatMap showId={showId} />
          </div>
          <div className="bg-cinema-gray rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            {showDetails && (
              <div className="mb-4 pb-4 border-b border-gray-700">
                <h3 className="font-semibold text-cinema-red">{showDetails.movieTitle}</h3>
                <p className="text-gray-400">{new Date(showDetails.showTime).toLocaleString()}</p>
                <p className="text-gray-400">{showDetails.theaterName}</p>
              </div>
            )}
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-700">
                <h3 className="font-semibold mb-2">Selected Seats</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-cinema-red px-2 py-1 rounded text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-4 border-b border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
                  <span>${selectedSeats.length * 10}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Convenience Fee</span>
                  <span>${selectedSeats.length * 1.5}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span>${selectedSeats.length * 11.5}</span>
              </div>
              <Button
                className="w-full bg-cinema-red hover:bg-red-700"
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SeatSelection;
