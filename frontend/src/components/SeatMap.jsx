import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import useStore from "../store/useStore";

export const SeatMap = ({ onSelectSeats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const setStoreSelectedSeats = useStore((state) => state.setSelectedSeats);

  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const seatsPerRow = 8;

  // Mock data - replace with API call later
  const bookedSeats = ["A1", "B4", "C3", "E5"];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    // Update the local selected seats
    setSelectedSeats((prev) => {
      const newSelection = prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId];
      
      // Update Zustand store (this will also trigger re-render in parent component)
      setStoreSelectedSeats(newSelection);

      // Pass the new selection back to the parent component
      onSelectSeats(newSelection);

      return newSelection;
    });
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Select Your Seats</h2>
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-3xl">
          <div className="w-full h-4 bg-cinema-gray rounded-lg mb-8 text-center text-sm text-gray-400">
            Screen
          </div>
          <div className="grid gap-4">
            {rows.map((row) => (
              <div key={row} className="flex justify-center gap-2">
                <div className="w-6 flex items-center justify-center text-gray-400">
                  {row}
                </div>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const status = getSeatStatus(seatId);
                  return (
                    <Button
                      key={seatId}
                      variant="outline"
                      className={`w-8 h-8 p-0 ${status === "booked" ? "bg-gray-700 cursor-not-allowed" : status === "selected" ? "bg-cinema-red hover:bg-red-700" : "hover:bg-cinema-red/10"}`}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === "booked"}
                    >
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-gray-400"></div>
          <span className="text-sm text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cinema-red"></div>
          <span className="text-sm text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-700"></div>
          <span className="text-sm text-gray-400">Booked</span>
        </div>
      </div>
    </div>
  );
};
