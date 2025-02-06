import { useEffect } from "react";
import { Button } from "./ui/button";
import useShowStore from "../store/useShowStore";
import { useAuthStore } from "../store/useAuthStore";

export const SeatMap = ({ showId }) => {
  const { showDetails, selectedSeats, selectSeat, fetchShowDetails, unlockSeat } =
    useShowStore();
  const { authUser } = useAuthStore();

  // Handle seat click - select or deselect seat and unlock if needed
  const handleSeatClick = async (seatId) => {
    if (!showDetails) return;

    const seat = showDetails.seats.find((s) => s?._id === seatId);
    if (!seat) return;

    // Allow user to click on their own locked seat to unlock it
    if (seat.status === "locked" && seat.lockedBy !== authUser?._id) {
      alert("Seat is not available");
      return;
    }

    // If the user clicks their own locked seat, unlock it
    if (seat.lockedBy === authUser?._id) {
      await unlockSeat(showId, seatId); // Call API to unlock the seat
      fetchShowDetails(showId); // Refresh seat data immediately after unlocking
    }

    // Toggle the seat selection
    selectSeat(seatId);
  };

  // Get seat status for rendering
  const getSeatStatus = (seat) => {
    if (seat.status === "booked") return "booked"; // Ensure booked seats are recognized
    if (seat.lockedBy === authUser?._id) return "selected"; // Show locked seats as selected if locked by the current user
    if (selectedSeats.includes(seat?._id)) return "selected"; // Mark user-selected seats as selected
    return seat.status; // Default status
  };

  useEffect(() => {
    // Set up polling to refresh seat status every 5 seconds
    const interval = setInterval(() => {
      if (showDetails) {
        fetchShowDetails(showId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [showDetails, showId]);

  useEffect(() => {
    if (!showDetails) return;

    // Add locked seats to the selectedSeats array if the seat is locked by the current user
    const lockedSeats = showDetails.seats
      .filter((seat) => seat.status === "locked" && seat.lockedBy === authUser?._id)
      .map((seat) => seat?._id);

    // Only add the locked seats to selectedSeats if they aren't already in the array
    lockedSeats.forEach((seatId) => {
      if (!selectedSeats.includes(seatId)) {
        selectSeat(seatId);
      }
    });
  }, [showDetails, authUser, selectedSeats, selectSeat]);

  if (!showDetails || !showDetails.seats) {
    return <div>Loading seats...</div>;
  }

  // Assuming 10 seats per row
  const rows = [];
  for (let i = 0; i < showDetails.seats.length; i += 10) {
    rows.push(showDetails.seats.slice(i, i + 10));
  }

  return (
    <div className="space-y-8">
      <div className="w-full bg-gray-900 p-2 text-center text-gray-400 shadow-lg screen-effect">
        SCREEN
      </div>

      <div className="grid gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            <span className="w-6 text-gray-400 flex items-center">
              {String.fromCharCode(65 + rowIndex)}
            </span>

            {row.map((seat) => {
              const status = getSeatStatus(seat);
              return (
                <Button
                  key={seat?._id}
                  variant={status === "selected" ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    status === "reserved" ||
                    status === "booked" ||
                    status === "locked"
                      ? "bg-gray-800 cursor-not-allowed"
                      : status === "selected"
                      ? "bg-cinema-red hover:bg-red-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleSeatClick(seat?._id)}
                  disabled={
                    status === "reserved" ||
                    status === "booked" ||
                    status === "locked"
                  }
                >
                  {rowIndex * 10 + row.indexOf(seat) + 1}
                </Button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cinema-red rounded"></div>
          <span className="text-sm text-gray-400">
            Selected ({selectedSeats.length}/10)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
          <span className="text-sm text-gray-400">Reserved/Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-600 rounded"></div>
          <span className="text-sm text-gray-400">Available</span>
        </div>
      </div>
    </div>
  );
};
