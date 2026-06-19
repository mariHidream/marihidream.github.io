
import { create } from 'zustand';

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface BookingSession {
    currentStep : BookingStep;
    selectedMovieId : number | null;
    selectedMovieTitle : string | null;
    selectedDate : string | null;
    selectedTheater : string | null;
    selectedSeats : string[];
    totalPrice: number;

    //action
    setStep : (step: BookingStep) => void;
    nextStep : () => void;
    prevStep : () => void;
    selectMovie : () => void;
    selectDate : () => void;
    selectTheater : () => void;
    toggleSeat: (seat: string) => void;
    setTotalPrice : (price : string) => void;
    resetBooking : () => void;
}


export const useMovieBookingStore = create<BookingSession>((set) => ({
  currentStep: 1,
  selectedMovieId: null,
  selectedMovieTitle: null,
  selectedDate: null,
  selectedTheater: null,
  selectedSeats: [],
  totalPrice: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: (state.currentStep + 1) as BookingStep })),
  prevStep: () => set((state) => ({ currentStep: (state.currentStep - 1) as BookingStep })),
  
  selectMovie: (id, title) => set({ selectedMovieId: id, selectedMovieTitle: title, currentStep: 2 }), // 영화 선택 시 자동 스텝업
  selectDate: (date) => set({ selectedDate: date }),
  selectTheater: (theater) => set({ selectedTheater: theater }),
  
  toggleSeat: (seat) => set((state) => {
    const isSelected = state.selectedSeats.includes(seat);
    const updatedSeats = isSelected
      ? state.selectedSeats.filter((s) => s !== seat)
      : [...state.selectedSeats, seat];
    return { selectedSeats: updatedSeats };
  }),
  
  setTotalPrice: (price) => set({ totalPrice: price }),
  
  resetBooking: () => set({
    currentStep: 1,
    selectedMovieId: null,
    selectedMovieTitle: null,
    selectedDate: null,
    selectedTheater: null,
    selectedSeats: [],
    totalPrice: 0
  })
}));