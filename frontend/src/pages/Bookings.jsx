import { Layout } from "@/components/Layout";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";
import { formatDistance } from "date-fns";
import { Ticket, Calendar, CreditCard, User } from "lucide-react";

const Bookings = () => {
  const { fetchAllBookings, bookings } = useMovieStore();
  
  useEffect(() => {
    fetchAllBookings();
  }, []);

  const formatDate = (date ) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  const StatusBadge = ({ status } ) => {
    const getStatusColor = (status ) => {
      switch (status.toLowerCase()) {
        case 'confirmed':
          return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'pending':
          return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'cancelled':
          return 'bg-red-500/10 text-red-500 border-red-500/20';
        default:
          return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      }
    };

    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cinema-dark text-cinema-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-cinema-light">My Bookings</h1>
            <div className="text-sm text-cinema-light/60">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-cinema-gray rounded-lg p-6 shadow-lg border border-cinema-light/10 hover:border-cinema-light/20 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-cinema-red" />
                      <span className="text-lg font-medium">Booking ID: {booking._id.slice(-8)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-cinema-light/70">
                        <Calendar className="w-4 h-4" />
                        <span>Booked {formatDate(booking.bookingDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-cinema-light/70">
                        <User className="w-4 h-4" />
                        <span>User ID: {booking.userId.slice(-8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={booking.status} />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cinema-light/70" />
                      <span className="text-xl font-bold">${booking.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cinema-light/10">
                  <div className="text-sm text-cinema-light/70 mb-2">Seats:</div>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map((seat) => (
                      <div
                        key={seat._id}
                        className="px-3 py-1.5 bg-cinema-dark rounded-md text-sm border border-cinema-light/10"
                      >
                        Seat {seat.seatNumber.slice(-4)} - ${seat.price}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-12 bg-cinema-gray rounded-lg border border-cinema-light/10">
                <Ticket className="w-12 h-12 text-cinema-light/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-cinema-light/70 mb-2">No Bookings Found</h3>
                <p className="text-sm text-cinema-light/50">
                  You haven't made any bookings yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;