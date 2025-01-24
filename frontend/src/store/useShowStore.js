import { create } from 'zustand';
import axiosInstance from  '../lib/axios'; // Import custom axios instance

const useShowStore = create((set, get) => ({
  showDetails: null,
  selectedSeats: [],
  isLoading: false,
  error: null,

  // Fetch Show Details using Axios
  fetchShowDetails: async (showId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/shows/${showId}`);
      set({ showDetails: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Lock Seats logic, with check for 10-seat limit
  lockSeats: async (showId, seatIds) => {
    try {
      // Check if adding these seats would exceed the 10-seat limit
      const currentSelected = get().selectedSeats;
      if (currentSelected.length + seatIds.length > 10) {
        alert('You can only select up to 10 seats at a time');
        return false;
      }

      const response = await axiosInstance.post(`/shows/${showId}/lock-seats`, {
        seatIds,
      });
      
      if (response.status === 200) {
        await get().fetchShowDetails(showId); // Refresh show details
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error locking seats:', error);
      return false;
    }
  },

  // Select seats and update selectedSeats state
  selectSeats: async (showId, seatIds) => {
    const success = await get().lockSeats(showId, seatIds);
    if (success) {
      set(state => ({
        selectedSeats: [...state.selectedSeats, ...seatIds]
      }));
    }
    return success;
  },

  // Release seats and update selectedSeats state
  releaseSeats: async (showId, seatIds) => {
    try {
      await axiosInstance.post(`/shows/${showId}/release-seats`, {
        seatIds,
      });

      await get().fetchShowDetails(showId); // Refresh show details
      set(state => ({
        selectedSeats: state.selectedSeats.filter(id => !seatIds.includes(id))
      }));
    } catch (error) {
      console.error('Error releasing seats:', error);
    }
  },

  // Clear all selected seats and release them
  clearSelection: () => {
    const { showDetails, releaseSeats } = get();
    if (showDetails && get().selectedSeats.length > 0) {
      releaseSeats(showDetails.id, get().selectedSeats);
    }
    set({ selectedSeats: [] });
  },
}));

export default useShowStore;
