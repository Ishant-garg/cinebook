import { Layout } from "@/components/Layout";
import { SeatMap } from "@/components/SeatMap";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import useStore from "../store/useStore";

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const setStoreSelectedSeats = useStore((state) => state.setSelectedSeats);

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    setStoreSelectedSeats(seats); // Update Zustand store as well
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      return;
    }
    // Handle payment navigation here
    console.log("Proceeding with seats:", selectedSeats);
  };

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
            <SeatMap onSelectSeats={handleSeatSelect} />
          </div>
          <div className="bg-cinema-gray rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
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
