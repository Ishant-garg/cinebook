import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useTheaterStore = create((set) => ({
  theaters: [],
  showsByTheater: {}, // Object to store shows for each theater
  selectedDate: new Date(),
  isLoading: false,
  error: null,

  // Fetch theaters by date
  fetchTheatersByDate: async (date, movieId) => {
    set({ isLoading: true, error: null  , theaters: [] });
    try {
      const response = await axiosInstance.get(`/theaters`, { 
        params: { date, movieId } // Include movieId as a parameter
      });
      const theaters = response.data;
      const showsByTheater = theaters.reduce((acc, theater) => {
        acc[theater._id] = theater.shows || []; // Add shows for each theater
        return acc;
      }, {});
      set({ theaters, showsByTheater, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },
  

  // Fetch shows for a specific theater
  fetchShowsByTheater: async (theaterId, date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/theater/${theaterId}/shows`, {
        params: { date },
      });
      console.log(response.data);
      set((state) => {
        console.log("Current state:", state.showsByTheater);
        return {
          showsByTheater: { ...state.showsByTheater, [theaterId]: response.data },
          isLoading: false,
        };
      });
      
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // fetchShowsByCriteria : async (theaterId , movieId , date) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axiosInstance.get(`/shows`, {
  //       params: { movieId , date , theaterId },
  //     });
  //     console.log(response.data);
  //     set((state) => {
  //       console.log("Current state:", state.showsByTheater);
  //       return {
  //         showsByTheater: { ...state.showsByTheater, [theaterId]: response.data },
  //         isLoading: false,
  //       };
  //     });
      
  //   } catch (error) {
  //     set({ isLoading: false, error: error.message });
  //   }
  // },
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useTheaterStore;
