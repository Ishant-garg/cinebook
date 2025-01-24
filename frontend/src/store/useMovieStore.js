import { create } from 'zustand';
import axiosInstance from '../lib/axios';

const useMovieStore = create((set) => ({
  movies: [],
  movieDetails: {}, // New state for holding movie details
  isLoading: false,
  error: null,

  // Fetch all movies
  fetchMovies: async () => {
    set({ isLoading: true, error: null }); // Set loading state before making API call
    try {
      const response = await axiosInstance.get('/movie'); // Adjust the API endpoint as needed
      set({ movies: response.data.movies, isLoading: false }); // Store fetched data and stop loading
    } catch (error) {
      set({ isLoading: false, error: error.message }); // Handle any error that occurs
    }
  },

  // Fetch movie details by ID
  fetchMovieDetails: async (movieId) => {
    set({ isLoading: true, error: null }); // Set loading state before making API call
    try {
      const response = await axiosInstance.get(`/movie/${movieId}`); // Adjust the API endpoint as needed
    //   console.log("res" , response.data.movie)
      set({ movieDetails: response.data.movie, isLoading: false }); // Store fetched movie details
    } catch (error) {
      set({ isLoading: false, error: error.message }); // Handle any error that occurs
    }
  },
}));

export default useMovieStore;
