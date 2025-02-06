import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
 
const useShowStore = create((set, get) => ({
  showDetails: null,
  selectedSeats: [],
  isLoading: false,
  error: null,

  // Fetch show details
  fetchShowDetails: async (showId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/shows/${showId}`);
      set({ showDetails: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch show details');
      return null;
    }
  },

  // Select a seat, with a limit of 10 seats per selection
  selectSeat: (seatId) => {
    set((state) => {
      const currentSelected = state.selectedSeats;

      if (currentSelected.includes(seatId)) {
        return {
          selectedSeats: currentSelected.filter((id) => id !== seatId),
        };
      }

      if (currentSelected.length >= 10) {
        toast.error('You can only select up to 10 seats at a time.');
        return state;
      }

      return {
        selectedSeats: [...currentSelected, seatId],
      };
    });
  },

  // Reserve seats but keep them in the state (no clearing)
  reserveSeats: async (showId) => {
    try {
      const seatIds = get().selectedSeats;
      if (seatIds.length === 0) return false;

      const response = await axiosInstance.post(`/shows/${showId}/reserve-seats`, {
        seatIds,
      });
      console.log('response', response);
      if (response.status === 200) {
        // Do not clear the seats here. Just fetch show details
        await get().fetchShowDetails(showId);
        return true;
      }

      toast.error('Failed to reserve seats. Please try again.');
      return false;
    } catch (error) {
      console.error('Error reserving seats:', error);
      toast.error(error.response?.data?.message || 'Failed to reserve seats');
      return false;
    }
  },

  // Create payment intent (called when user clicks Proceed to Payment)
  createPaymentIntent: async (showId) => {
    try {
      const seatIds = get().selectedSeats;
      if (seatIds.length === 0) {
        throw new Error('No seats selected. Please select seats to continue.');
      }

      const response = await axiosInstance.post(`/shows/${showId}/create-payment-intent`, {
        seatIds,
      });

      if (!response.data.clientSecret) {
        throw new Error('Payment intent creation failed. Please try again.');
      }

      return response.data; // Return data with clientSecret
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error(error.response?.data?.message || 'Failed to create payment');
      throw error; // Ensure the error is propagated
    }
  },

  // Cancel payment and reset selection
  cancelPayment: async (showId) => {
    try {
      const seatIds = get().selectedSeats;
      if (seatIds.length === 0) return;

      await axiosInstance.post(`/shows/${showId}/cancel-payment`, { seatIds });
      // Do not clear the selected seats here; only reset if needed
      await get().fetchShowDetails(showId);
    } catch (error) {
      console.error('Error canceling payment:', error);
      toast.error('Failed to cancel payment');
    }
  },

  // Clear selected seats explicitly (called when user cancels selection)
  clearSelection: () => {
    set({ selectedSeats: [] });
  },

  // Release locked seats after timeout or if user cancels
  releaseLockedSeats: async (showId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post(`/shows/${showId}/release-seats`);
      if (response.status === 200) {
        toast.success('Locked seats released successfully.');
        await get().fetchShowDetails(showId);
      }
    } catch (error) {
      console.error('Error releasing locked seats:', error);
      toast.error('Failed to release locked seats');
    } finally {
      set({ isLoading: false });
    }
  },
  unlockSeat : async (showId, seatId) => {
    try {
      const response = await axiosInstance.post(`/seats/unlock`, { seatId , showId}); 
      if (response.status === 200) {
        toast.success('Seat unlocked successfully.');
        await get().fetchShowDetails(showId);
      }
    } catch (error) {
      console.error('Error unlocking seat:', error);
      toast.error('Failed to unlock seat');
    }
  },

  // Handle error state with toast notification
  handleError: (errorMessage) => {
    set({ error: errorMessage });
    toast.error(errorMessage || 'An unexpected error occurred. Please try again.');
  },
}));

export default useShowStore;
