import { useEffect } from 'react';
import { Button } from './ui/button';
import useShowStore from '../store/useShowStore';

export const SeatMap = ({ showId }) => {
  const { showDetails, selectedSeats, selectSeats, releaseSeats } = useShowStore();

  const handleSeatClick = async (seatId) => {
    if (!showDetails) return;

    const seat = showDetails.seats.find(s => s._id === seatId);
    if (!seat) return;

    // If seat is already selected, release it
    if (selectedSeats.includes(seatId)) {
      await releaseSeats(showId, [seatId]);
      return;
    }

    // If seat is not available and not our own selection, return
    if (seat.status !== 'available') {
      return;
    }

    // Try to select the seat
    const success = await selectSeats(showId, [seatId]);
    if (!success) {
      alert('Unable to select seat. It might have been taken by another user or you have reached the maximum limit of 10 seats.');
    }
  };

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat._id)) return 'selected';
    return seat.status;
  };

  useEffect(() => {
    // Set up polling to refresh seat status every 5 seconds
    const interval = setInterval(() => {
      if (showDetails) {
        showDetails.fetchShowDetails(showId);
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
      <div className="w-full bg-gray-900 p-4 rounded-lg text-center text-gray-400">
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
                  key={seat._id}
                  variant={status === 'selected' ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    status === 'locked'
                      ? 'bg-gray-700 cursor-not-allowed'
                      : status === 'selected'
                      ? 'bg-cinema-red hover:bg-red-700'
                      : status === 'booked'
                      ? 'bg-gray-800 cursor-not-allowed'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handleSeatClick(seat._id)}
                  disabled={status === 'locked' || status === 'booked'}
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
          <span className="text-sm text-gray-400">Selected ({selectedSeats.length}/10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <span className="text-sm text-gray-400">Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
          <span className="text-sm text-gray-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-600 rounded"></div>
          <span className="text-sm text-gray-400">Available</span>
        </div>
      </div>
    </div>
  );
};