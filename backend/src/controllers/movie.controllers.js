import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js";

// Create a new movie
export const createMovie = async (req, res) => {
    // console.log(req.body);
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ movie });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie updated successfully", movie });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllBookings = async (req , res) =>{
   
  const userId = req.user._id;
  if(!userId){
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const bookings = await Booking.find({ userId });
    res.status(200).json({ bookings });
 
  }
  catch(error){
    res.status(500).json({ message: "Server error", error: error.message });  
  }
}