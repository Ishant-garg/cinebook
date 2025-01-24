import mongoose from "mongoose";

// Define the seat schema
const seatSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['available', 'locked', 'booked'],
    default: 'available'
  },
  lockedAt: Date,
  lockedUntil: Date,
  lockedBy: String // Add userId for tracking
});

// Define the show schema
const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
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
  seats: [seatSchema], // Embed the seat schema here
});

// Middleware to clean up expired locks
showSchema.pre("save", function (next) {
  const currentTime = new Date();
  if (this.seats) {
    this.seats.forEach((seat) => {
      if (seat.status === "locked" && seat.lockedUntil && seat.lockedUntil < currentTime) {
        seat.status = "available";
        seat.lockedAt = null;
        seat.lockedUntil = null;
        seat.lockedBy = null;
      }
    });
  }
  next();
});

// Define the theater schema
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
      ref: "Movie",
    },
  ],
  shows: [showSchema], // Shows already link specific movies to time slots
});

// Create the model
const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;
