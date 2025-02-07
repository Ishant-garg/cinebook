import Theater from "../models/theater.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);    
 
// Create a new show for a theater
export const createShow = async (req, res) => {
     
  try {
    const { theaterId } = req.params;
   
    const { movieId, showTime, endTime, seatPricing } = req.body;
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }
    const totalRows = 2; // Example: 10 rows
    const seatsPerRow = 5; // Example: 20 seats per row
    const seatTypeDistribution = {
      A: "vip",
      B: "vip",
      C: "premium",
      D: "premium",
      E: "standard",
      F: "standard",
      G: "standard",
      H: "standard",
     
    };

    // Generate the seat array
    const seats = generateSeats(totalRows, seatsPerRow, seatTypeDistribution);    
    const newShow = {
      movieId,
      showTime,
      endTime,
      seatPricing,
      seats,  
    };
    
    theater.movies.push(movieId);
    theater.shows.push(newShow); 
    await theater.save();
 
    res.status(201).json({ 
      message: "Show created successfully", 
      show: theater.shows[theater.shows.length - 1] 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//     try {
//       const { theaterId } = req.params;
//       const { movieId, showTime, endTime, seatPricing } = req.body;
  
//       // Validate theater exists
//       const theater = await Theater.findById(theaterId);
//       if (!theater) {
//         return res.status(404).json({ message: "Theater not found" });
//       }
  
//       // Validate required fields
//       if (!movieId || !showTime || !endTime || !seatPricing) {
//         return res.status(400).json({ message: "All fields are required" });
//       }
  
//       // Generate seats array based on seatPricing
//       const seats = [];
//       seatPricing.forEach((pricing) => {
//         const { seatType, price, count } = pricing;
//         for (let i = 0; i < 10; i++) { 
//           seats.push({
//             seat: {
//               seatNumber: `${seatType}-${i + 1}`, // Example: "VIP-1"
//               type: seatType,
//               price: price,
//             },
//             status: "available",
//           });
//         }
//       });
  
//       // Create a new show
//       const newShow = {
//         movieId,
//         showTime: new Date(showTime),
//         endTime: new Date(endTime),
//         seats,
//       };
  
//       // Push show into theater and save
//       theater.shows.push(newShow);
//       await theater.save();
  
//       // Respond with the new show details
//       res.status(201).json({
//         message: "Show created successfully",
//         show: theater.shows[theater.shows.length - 1],
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   };
  
// Update a show
export const updateShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const updateData = req.body;

    const theater = await Theater.findOne({ "shows._id": showId });
    if (!theater) {
      return res.status(404).json({ message: "Show not found" });
    }

    const showIndex = theater.shows.findIndex(show => show._id.toString() === showId);
    if (showIndex === -1) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Update show fields
    Object.assign(theater.shows[showIndex], updateData);
    await theater.save();

    res.status(200).json({ 
      message: "Show updated successfully", 
      show: theater.shows[showIndex] 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a show
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const theater = await Theater.findOne({ "shows._id": showId });
    if (!theater) {
        return res.status(404).json({ message: "Show not found" });
    }
    
    theater.shows = theater.shows.filter(show => show._id.toString() !== showId);
    // console.log("Filtered Shows:", theater.shows); // Check the updated shows array
    theater.shows = theater.shows.map(show => {
        if (!show.endTime) {
          show.endTime = new Date(); // Set a default endTime if missing
        }
        return show;
      });
      await theater.save();
      
    await theater.save();
    

    res.status(200).json({ message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific show
export const getShowById = async (req, res) => { 
  try {
    const { showId } = req.params;

    const theater = await Theater.findOne({ "shows._id": showId })
      .populate("shows.movieId");

    if (!theater) {
      return res.status(404).json({ message: "Show not found" });
    }

    const show = theater.shows.find(show => show._id.toString() === showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ show });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all shows for a theater
export const getShowsByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const theater = await Theater.findById(theaterId)
      .populate("shows.movieId");

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json({ shows: theater.shows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all shows for a movie
export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const theaters = await Theater.find({ "shows.movieId": movieId })
      .populate("shows.movieId");

    const shows = theaters.reduce((acc, theater) => {
      const movieShows = theater.shows.filter(show => 
        show.movieId._id.toString() === movieId
      ).map(show => ({
        ...show.toObject(),
        theaterName: theater.name,
        theaterId: theater._id
      }));
      return [...acc, ...movieShows];
    }, []);

    res.status(200).json({ shows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// helpers/seatHelper.js
export function generateSeats(totalRows, seatsPerRow, seatTypeDistribution) {
    const seats = [];
    const alphabet = "ABCDEFGH";
  
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const row = alphabet[rowIndex];
      const seatType = seatTypeDistribution[row] || "standard";
  
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seats.push({
          row: row,
          number: seatNumber,
          type: seatType,
          isAvailable: true,
        });
      }
    }
  
    return seats;
  }
  

 
  
export const getSeatsByShow = async (req, res) => {
    const { id } = req.params;
 
    try {
      const show = await Show.findById(id).populate('seats');
      // console.log(show);
      res.status(200).json(show.seats); // Return the seat data for this show
    } catch (error) {
      res.status(500).json({ message: 'Error fetching seats', error });
    }
}

 

// Get show details
export const getShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim(); 

    const theater = await Theater.findOne({
      'shows._id': cleanId
    }).populate('movies');
    
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(cleanId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const movie = theater.movies.find(m => m._id.equals(show.movieId));
    // console.log("mm " , movie.title);
    res.json({
      id: show._id,
      movieTitle: movie ? movie.title : 'Unknown Movie',
      theaterName: theater.name,
      showTime: show.showTime,
      seats: show.seats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
 
//     const cleanId = id.trim();

//     const theater = await Theater.findOne({
//       'shows._id': cleanId
//     }).populate('movies');

//     if (!theater) {
//       return res.status(404).json({ message: 'Show not found' });
//     }

//     const show = theater.shows.id(cleanId);
//     if (!show) {
//       return res.status(404).json({ message: 'Show not found' });
//     }

//     const movie = theater.movies.find(m => m._id.equals(show.movieId));

//     // Process seats
//     const processedSeats = show.seats.map(seat => {
//       if (seat.lockedBy && seat.lockedBy.toString() === userId) {
//         return { ...seat.toObject(), status: "selected" }; // Mark as selected for this user
//       }
//       return seat; // Keep original status for others
//     });

//     res.json({
//       id: show._id,
//       movieTitle: movie ? movie.title : 'Unknown Movie',
//       theaterName: theater.name,
//       showTime: show.showTime,
//       seats: processedSeats
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Lock seats
export const lockSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body;
    
    const theater = await Theater.findOne({
      'shows._id': id
    });

    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if seats are available
    const requestedSeats = show.seats.filter(seat => seatIds.includes(seat._id.toString()));
    const unavailableSeats = requestedSeats.filter(seat => 
      seat.status !== 'available' && 
      !(seat.status === 'locked' && seat.lockedUntil < new Date())
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: 'One or more seats are not available' });
    }

    // Lock the seats for 10 seconds
    const lockExpiry = new Date(Date.now() + 2 * 60000); 
    requestedSeats.forEach(seat => {
      seat.status = 'locked';
      seat.lockedAt = new Date();
      seat.lockedUntil = lockExpiry;
    });

    await theater.save();
    res.json({ message: 'Seats locked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Release seats
export const releaseSeats = async (req, res) => {
  try {
    const { id } = req.params; // ID refers to the show ID

    const theater = await Theater.findOne({
      'shows._id': id,
    });

    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Get the current time
    const currentTime = new Date();

    // Update all locked seats with expired locks
    show.seats.forEach((seat) => {
      const lockedUntilTime = seat.lockedUntil ? new Date(seat.lockedUntil).getTime() : null;

      // Debugging logs
      // console.log(
      //   `Seat ID: ${seat._id}, LockedUntil: ${seat.lockedUntil}, CurrentTime: ${currentTime}, Comparison: ${
      //     lockedUntilTime && lockedUntilTime > currentTime.getTime()
      //   }`
      // );

      // Only unlock seats if lockedUntil is defined and expired
      if (seat.status === 'locked' && lockedUntilTime && lockedUntilTime <= currentTime.getTime()) {
        console.log(`Unlocking Seat ID: ${seat._id}`);
        seat.status = 'available';
        seat.lockedAt = null;
        seat.lockedUntil = null;
        seat.lockedBy = null;
      }
    });

    // Save the updated theater data
    await theater.save();

    res.json({ message: 'Locked seats with expired locks have been released successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const reserveSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds } = req.body;
    const userId = req.user._id; // From auth middleware

    const theater = await Theater.findOne({ 'shows._id': showId });
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(showId);
    const currentTime = new Date();
    const lockUntil = new Date(currentTime.getTime() + 2 * 60000); // 2 minutes

    // Check if seats are available
    const unavailableSeats = show.seats.filter(
      seat => seatIds.includes(seat._id.toString()) && 
      (seat.status !== 'available' || 
       (seat.status === 'locked' && seat.lockedBy !== userId.toString()))
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'One or more seats are not available' 
      });
    }

    // Lock the seats
    seatIds.forEach(seatId => {
      const seat = show.seats.id(seatId);
      seat.status = 'locked';
      seat.lockedAt = currentTime;
      seat.lockedUntil = lockUntil;
      seat.lockedBy = userId;
    });

    await theater.save();
    res.json({ message: 'Seats reserved successfully' });
  } catch (error) {
    console.error('Error reserving seats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
 


 // Complete payment and book seats
 export const  completePayment = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds } = req.body;
    const userId = req.user._id;

    const theater = await Theater.findOne({ 'shows._id': showId });
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(showId);
    
    // Verify seats are locked by this user
    const invalidSeats = show.seats.filter(
      seat => seatIds.includes(seat._id.toString()) && 
      (seat.status !== 'locked' || seat.lockedBy !== userId.toString())
    );

    if (invalidSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Seats are no longer reserved' 
      });
    }

    // Mark seats as booked
    seatIds.forEach(seatId => {
      const seat = show.seats.id(seatId);
      seat.status = 'booked';
      seat.lockedAt = null;
      seat.lockedUntil = null;
      seat.lockedBy = userId;
    });

    await theater.save();
    res.json({ message: 'Payment completed and seats booked successfully' });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Cancel payment and release seats
export const cancelPayment = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds } = req.body;
    const userId = req.user._id;

    const theater = await Theater.findOne({ 'shows._id': showId });
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(showId);

    // Release only seats locked by this user
    seatIds.forEach(seatId => {
      const seat = show.seats.id(seatId);
      if (seat.status === 'locked' && seat.lockedBy === userId.toString()) {
        seat.status = 'available';
        seat.lockedAt = null;
        seat.lockedUntil = null;
        seat.lockedBy = null;
      }
    });

    await theater.save();
    res.json({ message: 'Seats released successfully' });
  } catch (error) {
    console.error('Error canceling payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create payment intent for Stripe
export const createPaymentIntent =  async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds } = req.body;
    const userId = req.user._id;

    const theater = await Theater.findOne({ 'shows._id': showId });
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(showId);
    
    // Verify seats are locked by this user
    const invalidSeats = show.seats.filter(
      seat => seatIds.includes(seat._id.toString()) && 
      (seat.status !== 'locked' || seat.lockedBy !== userId.toString())
    );

    if (invalidSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Seats are no longer reserved' 
      });
    }

    // Calculate amount (in cents for Stripe)
    const amount = seatIds.length * 1150; // $11.50 per seat ($10 + $1.50 fee)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        showId,
        seatIds: JSON.stringify(seatIds),
        userId: userId.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle Stripe webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { showId, seatIds, userId } = paymentIntent.metadata;

    try {
      const theater = await Theater.findOne({ 'shows._id': showId });
      if (!theater) {
        return res.status(404).json({ message: 'Show not found' });
      }

      const show = theater.shows.id(showId);
      const parsedSeatIds = JSON.parse(seatIds);

      // Mark seats as booked
      parsedSeatIds.forEach(seatId => {
        const seat = show.seats.id(seatId);
        if (seat && seat.lockedBy === userId) {
          seat.status = 'booked';
          seat.lockedAt = null;
          seat.lockedUntil = null;
          seat.lockedBy = userId;
        }
      });

      await theater.save();
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  }

  res.json({ received: true });
}
export const unlockSeat = async (req, res) => {
  try {
    const { showId, seatId } = req.body;
    const userId = req.user._id;  

    // Find the theater with the show
    const theater = await Theater.findOne({
      'shows._id': showId
    });

    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Get the show
    const show = theater.shows.id(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Find the seat
    const seat = show.seats.id(seatId);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    // Verify that the seat is locked by the requesting user
    if (seat.status !== 'locked' || !seat.lockedBy?.equals(userId)) {
      return res.status(403).json({ 
        message: 'You can only unlock seats that are locked by you' 
      });
    }

    // Update the seat status
    seat.status = 'available';
    seat.lockedBy = null;
    seat.lockedAt = null;
    seat.lockedUntil = null;

    // Save the changes
    await theater.save();

    res.json({ 
      message: 'Seat unlocked successfully',
      seat: {
        _id: seat._id,
        status: seat.status
      }
    });

  } catch (error) {
    console.error('Error unlocking seat:', error);
    res.status(500).json({ message: 'Server error' });
  }
};