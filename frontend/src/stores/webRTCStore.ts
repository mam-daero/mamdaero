// src/store/useWebRTCStore.ts
import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import useAuthStore from './authStore';

interface WebRTCState {
  reservationId: number;
  setReservationId: (reservationId: number) => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  reservationId: 0,
  setReservationId: reservationId => set({ reservationId }),
}));
