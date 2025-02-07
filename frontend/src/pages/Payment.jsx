import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useShowStore from "../store/useShowStore";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const Payment = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { showDetails, selectedSeats, fetchShowDetails  } =
  useShowStore();

  const {authUser} = useAuthStore();
  // console.log("Auth user:", authUser);
  const sss = selectedSeats;
    
  console.log("Selected seats:", selectedSeats);

  useEffect(() => {
    const validateAndFetchShowDetails = async () => {
      if (!showId) {
        toast.error("Invalid show ID");
        navigate("/");
        return;
      }

      console.log("Fetching show details for showId:", showId);
      if (!showDetails) {
        await fetchShowDetails(showId);
      }
    };

    validateAndFetchShowDetails();
  }, [showId, showDetails, fetchShowDetails, navigate]);

  const handlePayment = async () => {
    // console.log("Handling payment...");
    // console.log("Selected seats:fsf " , selectedSeats);
    if (selectedSeats.length === 0) {
      toast.error("No seats selected");
      console.log("No seats selected, redirecting to seat selection");
      navigate(`/seat-selection/${showId}`);
      return;
    }

    try {
      const totalAmount = selectedSeats.length * 11.5; // Example pricing logic
      console.log("Total amount calculated:", totalAmount);

      const response = await axiosInstance.post("/create-checkout-session", {
        showId,
        seatIds: selectedSeats,
        totalAmount,
        userId: authUser._id
      });

      console.log("Stripe checkout session response:", response);
      

      if (response.data.url) {
        console.log("Redirecting to Stripe checkout URL:", response.data.url);
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error redirecting to Stripe Checkout:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  if (!showDetails) {
    console.log("Show details not available, showing loading spinner...");
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
      </Layout>
    );
  }

  const totalAmount = selectedSeats.length * 11.5;
  console.log("Rendering payment details with total amount:", totalAmount);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-cinema-gray rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          <div className="border-b border-gray-700 pb-6">
            <h3 className="font-semibold text-cinema-red mb-2">{showDetails.movieTitle}</h3>
            <p className="text-gray-400">{new Date(showDetails.showTime).toLocaleString()}</p>
            <p className="text-gray-400">{showDetails.theaterName}</p>
          </div>
          <div className="border-b border-gray-700 pb-6">
            <h3 className="font-semibold mb-3">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {sss.map((seat) => (

                <span key={seat} className="bg-cinema-red px-2 py-1 rounded text-sm">
                  {seat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg mt-6">
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-cinema-red hover:bg-red-700 mt-8"
            onClick={handlePayment}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
