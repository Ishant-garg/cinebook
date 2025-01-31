// Cancel.jsx
import { Layout } from "@/components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Cancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the showId from the query parameters
  const params = new URLSearchParams(location.search);
  const showId = params.get("showId");

  return (
    <Layout>
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Canceled</h1>
        <p className="text-gray-400 mb-8">
          Your payment for the show with ID {showId} was canceled. You can retry booking or contact support if needed.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Go to Home
          </Button>
          <Button className="bg-cinema-red hover:bg-red-700" onClick={() => navigate(`/seat-selection/${showId}`)}>
            Retry Booking
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cancel;
