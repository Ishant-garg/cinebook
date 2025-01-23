
import Theater  from "../models/theater.model.js";

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
    const theater = await Theater.findById(req.params.id).populate("shows.movieId");
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
      return res.status(404).json({ message: "No theaters found for this movie" });
    }

    res.status(200).json({ theaters });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
