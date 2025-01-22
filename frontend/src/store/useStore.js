import { create } from 'zustand';

const useStore = create((set) => ({
  selectedMovie: null,
  selectedTheatre: null,
  selectedShowtime: null,
  selectedSeats: [],
  
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setSelectedTheatre: (theatre) => set({ selectedTheatre: theatre }),
  setSelectedShowtime: (showtime) => set({ selectedShowtime: showtime }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  
  resetBooking: () => set({
    selectedTheatre: null,
    selectedShowtime: null,
    selectedSeats: []
  })
}));

export default useStore;