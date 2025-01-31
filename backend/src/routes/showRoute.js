import express from "express";
import {
  createShow,
  updateShow,
  deleteShow,
  getShowById,
  getShowsByTheater,
  getShowsByMovie,

  // getSeatsByShow,
  getShowDetails,
  lockSeats,
  releaseSeats,
  reserveSeats,
  completePayment,
  cancelPayment,
  createPaymentIntent,
  handleStripeWebhook,
} from "../controllers/show.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";
import Theater from "../models/theater.model.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create a new show for a theater
router.post("/theater/:theaterId/shows", createShow);

// Update a show
router.put("/theater/shows/:showId", updateShow);

// Delete a show
router.delete("/theater/shows/:showId", deleteShow);

// Get a specific show
router.get("/theater/shows/:showId", getShowById);

// Get all shows for a theater
router.get("/theater/:theaterId/shows", getShowsByTheater);

// Get all shows for a movie
router.get("/theater/shows/movie/:movieId", getShowsByMovie);

// Get show details
router.get("/shows/:id", getShowDetails);

// Lock seats
router.post("/shows/:id/lock-seats", lockSeats);

// Release seats
router.post("/shows/:id/release-seats", releaseSeats);

router.post("/shows/:showId/reserve-seats", protectRoute, reserveSeats);

router.post(
  "shows/:showId/create-payment-intent",
  protectRoute,
  createPaymentIntent
);
router.post(
  "shows/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
router.post("shows/:showId/cancel-payment", protectRoute, cancelPayment);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { showId, seatIds, totalAmount, userId } = req.body; // Include userId from frontend

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Movie Tickets",
              description: `Seats: ${seatIds.join(", ")}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect to success page
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        showId,
        seatIds: JSON.stringify(seatIds), // Convert to string since metadata requires strings
        userId,
        totalAmount,
      },
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});
router.post("/payment-success", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const existingBooking = await Booking.findOne({ sessionId });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Booking already confirmed for this session." });
    }
    console.log("Session ID:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const { showId, seatIds, userId, totalAmount } = session.metadata;
    // console.log("non parsedSeatIds" , seatIds);
    const parsedSeatIds = JSON.parse(seatIds);
    // console.log("parsedSeatIds" , parsedSeatIds);
    // Check if booking already exists (to prevent duplicates)
    // const existingBooking = await Booking.findOne({ userId, showId, seats: { $all: parsedSeatIds } });
    // if (existingBooking) {
    //   return res.status(200).json({ message: "Booking already confirmed!" });
    // }

    // Convert seatIds into an array of seat objects with seatNumber and price
    const seatObjects = parsedSeatIds.map((seatId) => ({
      seatNumber: seatId.toString(),
      price: parseFloat(11.5), // Static price per seat
    }));
    // console.log("seatObjects" , seatObjects);
    // Create a new booking
    const booking = new Booking({
      sessionId,
      userId,
      showId,
      seats: seatObjects,
      totalAmount: parseFloat(totalAmount),
      status: "confirmed",
    });

    await booking.save();

    // Update seats as booked in the show document
    const theater = await Theater.findOne({ "shows._id": showId });
    // if (!theater) {
    //   return res.status(404).json({ message: 'Show not found' });
    // }

    const show = theater.shows.id(showId);
    const currentTime = new Date();
    const lockUntil = new Date(currentTime.getTime() + 2 * 60000); // 2 minutes

    // Check if seats are available
    // const unavailableSeats = show.seats.filter(
    //   seat => seatIds.includes(seat._id.toString()) &&
    //   (seat.status !== 'available' ||
    //    (seat.status === 'locked' && seat.lockedBy !== userId.toString()))
    // );

    // if (unavailableSeats.length > 0) {
    //   return res.status(400).json({
    //     message: 'One or more seats are not available'
    //   });
    // }

    // Lock the seats
    parsedSeatIds.forEach((seatId) => {
      const seat = show.seats.id(seatId);
      seat.status = "booked";
      seat.lockedAt = currentTime;
      seat.lockedUntil = lockUntil;
      seat.lockedBy = userId;
    });

    await theater.save();

    res.status(200).json({ message: "Booking confirmed!" });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ message: "Payment verification failed." });
  }
});

export default router;
