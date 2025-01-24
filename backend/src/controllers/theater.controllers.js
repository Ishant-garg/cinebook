 
import mongoose from "mongoose";
import Theater from "../models/theater.model.js";

// Create a new theater
export const createTheater = async (req, res) => {
  try {
    const { name, location, totalSeats, shows } = req.body;

    const theater = new Theater({
      name,
      location,
      totalSeats,
      shows,
    });

    await theater.save();
    res.status(201).json({ message: "Theater created successfully", theater });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all theaters
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().populate("shows.movieId");
    res.status(200).json({ theaters });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific theater by ID
export const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id).populate(
      "shows.movieId"
    );
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }
    res.status(200).json({ theater });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a theater
export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json({ message: "Theater updated successfully", theater });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a theater
export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json({ message: "Theater deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all theaters showing a specific movie
export const getTheatersByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const theaters = await Theater.find({ "shows.movieId": movieId }).populate(
      "shows.movieId"
    );

    if (!theaters || theaters.length === 0) {
      return res
        .status(200)
        .json({ message: "No theaters found for this movie" });
    }

    res.status(200).json({ theaters });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch theaters and filter their shows based
// export const getTheatersByDateAndMovie = async (req, res) => {
//   try {
//     const { date, movieId } = req.query;

//     // Validate date parameter
//     if (!date) {
//       return res.status(400).json({ message: "Date parameter is required." });
//     }

//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate)) {
//       return res.status(400).json({ message: "Invalid date format." });
//     }

//     // Query theaters based on movieId
//     const query = movieId ? { movies: movieId } : {};

//     const theaters = await Theater.find(query)
//       .select("name location shows")
//       .lean();

//     // Filter shows based on the provided date
//     const filteredTheaters = theaters.map((theater) => {
//       const filteredShows = theater.shows.filter(
//         (show) =>
//           (!movieId || show.movieId.toString() === movieId) && // Match movieId if provided
//           show.showTime >= new Date(parsedDate.setHours(0, 0, 0)) && // Start of the day
//           show.showTime <= new Date(parsedDate.setHours(23, 59, 59)) // End of the day
//       );

//       return filteredShows.length > 0
//         ? {
//             ...theater,
//             shows: filteredShows.map((show) => ({
//               _id: show._id,
//               movieId: show.movieId,
//               showTime: show.showTime,
//               endTime: show.endTime,
//               availableSeats: show.seats.filter((s) => s.status === "available").length,
//             })),
//           }
//         : null;
//     });

//     // Remove theaters with no matching shows
//     const result = filteredTheaters.filter((theater) => theater !== null);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error fetching theaters by date and movie:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
// export const getTheatersByDateAndMovie = async (req, res) => {
//   try {
//     const { date, movieId } = req.query;
//     //  console.log(req.query);
//     if (!date || !movieId) {
//       return res.status(400).json({ message: "Date and movieId are required" });
//     }
//     const movieIdObject = new mongoose.Types.ObjectId(movieId);

//     const theaters = await Theater.find({
//       shows: {
//         $elemMatch: {
//           movieId : movieIdObject,
//           showTime: {
//             $gte: new Date(date), // Start of the day
//             $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)), // End of the day
//           },
//         },
//       },
//     });

//     if (theaters.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No theaters found for the given movie and date." });
//     }

//     // console.log("theaters", theaters);

//     res.status(200).json(theaters);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
 
 
 

export const getTheatersByDateAndMovie = async (req, res) => {
  try {
    const { date, movieId } = req.query;

    if (!date || !movieId) {
      return res.status(400).json({ message: "Date and movieId are required" });
    }

    // Ensure movieId is valid
    if (!mongoose.mongo.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movieId format" });
    }

    const movieIdObject = new mongoose.mongo.ObjectId(movieId);
    const startDate = new Date(date);
    const endDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));

    // Updated query to properly filter and project only matching shows
    const theaters = await Theater.aggregate([
      {
        $match: {
          "shows": {
            $elemMatch: {
              movieId: movieIdObject,
              showTime: {
                $gte: startDate,
                $lt: endDate
              }
            }
          }
        }
      },
      {
        $addFields: {
          "shows": {
            $filter: {
              input: "$shows",
              as: "show",
              cond: {
                $and: [
                  { $eq: ["$$show.movieId", movieIdObject] },
                  { $gte: ["$$show.showTime", startDate] },
                  { $lt: ["$$show.showTime", endDate] }
                ]
              }
            }
          }
        }
      }
    ]);

    if (theaters.length === 0) {
      return res
        .status(404)
        .json({ message: "No theaters found for the given movie and date." });
    }

    res.status(200).json(theaters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
