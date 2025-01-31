import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
    {
      sessionId: { type: String, unique: true, required: true }, // UNIQUE Session ID

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater.shows',
        required: true,
      },
      seats: [
        {
          seatNumber: String,
          price: Number,
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      bookingDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
      },
    },
    {
      timestamps: true,
    }
  );
  
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking
