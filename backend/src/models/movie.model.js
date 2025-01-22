import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  languages: [{
    type: String,
    required: true,
  }],
  genres: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    required: true,
  },
  certification: {
    type: String,
    required: true,
  },
  trailerVideoId: {
    type: String,
    required: true,
  }
});
const Movie = mongoose.model('Movie', movieSchema);

export default Movie