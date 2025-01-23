import mongoose from "mongoose";
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard'
  },
  price: {
    type: Number,
    required: true,
  }
});
const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  showTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  seats: [{ 
    seat: seatSchema,
    status: {
      type: String,
      enum: ['available', 'locked', 'booked'],
      default: 'available'
    },
    lockedAt: Date,
    lockedBy: String
  }]
});
const theaterSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    shows: [showSchema], // Shows already link specific movies to time slots
  });
  
const Theater = mongoose.model('Theater', theaterSchema);
export default Theater;