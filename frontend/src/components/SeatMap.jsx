import { useEffect } from "react";
import { Button } from "./ui/button";
import useShowStore from "../store/useShowStore";

export const SeatMap = ({ showId }) => {
  const { showDetails, selectedSeats, selectSeat, fetchShowDetails } =
    useShowStore();
  console.log(selectedSeats)
  const handleSeatClick = (seatId) => {
    if (!showDetails) return;

    const seat = showDetails.seats.find((s) => s._id === seatId);
    if (!seat) return;

    // If seat is not available, return
    if (seat.status !== "available") {
      return;
    }

    selectSeat(seatId);
  };

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat._id)) return "selected";
    return seat.status;
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
            {/* {row.map((seat) => {
              const status = getSeatStatus(seat);
              
              return (
                <Button
                  key={seat._id}
                  variant={status === 'selected' ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    status === 'reserved' || status === 'booked'
                      ? 'bg-gray-800 cursor-not-allowed'
                      : status === 'selected'
                      ? 'bg-cinema-red hover:bg-red-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handleSeatClick(seat._id)}
                  disabled={status === 'reserved' || status === 'booked'}
                >
                  {rowIndex * 10 + row.indexOf(seat) + 1}
                </Button>
              );
            })} */}
            {row.map((seat) => {
              const status = getSeatStatus(seat);

              return (
                <Button
                  key={seat._id}
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
                  onClick={() => handleSeatClick(seat._id)}
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
