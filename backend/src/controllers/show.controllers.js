import Theater from "../models/theater.model.js";

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
// export const createShow = async (req, res) => {
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
  

 export const getShowsByCriteria = async (req, res) => {
    try {
      const { theaterId, movieId, date } = req.query;
  
      // Validate required parameters
      if (!theaterId || !movieId || !date) {
        return res.status(400).json({ error: "Theater ID, movie ID, and date are required." });
      }
  
      // Convert the date string to a Date object and extract start/end of the day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
  
      // Find the theater by ID and filter shows matching the movieId and showTime range
      const theater = await Theater.findOne(
        {
          _id: theaterId,
          "shows.movieId": movieId,
          "shows.showTime": { $gte: startOfDay, $lte: endOfDay },
        },
        {
          "shows.$": 1, // Only include the matching show in the result
        }
      );
  
      if (!theater || !theater.shows || theater.shows.length === 0) {
        return res.status(404).json({ error: "No shows found for the given criteria." });
      }
  
      res.status(200).json({ shows: theater.shows });
    } catch (error) {
      console.error("Error fetching shows:", error);
      res.status(500).json({ error: "An error occurred while fetching shows." });
    }
  };
  
  export const getSeatsByShow = async (req, res) => {
    const { id } = req.params;
 
    try {
      const show = await Show.findById(id).populate('seats');
      console.log(show);
      res.status(200).json(show.seats); // Return the seat data for this show
    } catch (error) {
      res.status(500).json({ message: 'Error fetching seats', error });
    }
  }

 

// Get show details
export const getShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // return res.status(200).json({ message: 'Show details' });
    const theater = await Theater.findOne({
      'shows._id': id
    }).populate('movies');
    
    if (!theater) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const show = theater.shows.id(id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const movie = theater.movies.find(m => m._id.equals(show.movieId));

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
    const lockExpiry = new Date(Date.now() + 10000); // 10 seconds from now
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
export const releaseSeats =  async (req, res) => {
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

    // Release the seats
    show.seats.forEach(seat => {
      if (seatIds.includes(seat._id.toString())) {
        seat.status = 'available';
        seat.lockedAt = null;
        seat.lockedUntil = null;
      }
    });

    await theater.save();
    res.json({ message: 'Seats released successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};