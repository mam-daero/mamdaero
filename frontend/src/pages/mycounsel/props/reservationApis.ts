import axiosInstance from '@/api/axiosInstance';
import { Reservation, createReservation } from '@/pages/mycounsel/props/reservationDetail';

export const fetchReservation = async (): Promise<Reservation[]> => {
  const response = await axiosInstance({
    method: 'get',
    url: 'cm/reservation',
    params: {
      size: 100,
    },
  });
  console.log(response.data.data);
  return response.data.data.map((item: Omit<Reservation, 'formatTime'>) => createReservation(item));
};

export const fetchCompletedReservation = async (): Promise<Reservation[]> => {
  const response = await axiosInstance({
    method: 'get',
    url: 'cm/consult',
    params: {
      size: 100,
    },
  });
  return response.data.data.map((item: Omit<Reservation, 'formatTime'>) => createReservation(item));
};

export const fetchReservationDetail = async (reservationId: number): Promise<Reservation> => {
  const response = await axiosInstance({
    method: 'get',
    url: `cm/reservation/${reservationId}`,
  });
  return createReservation(response.data);
};

export const deleteReservation = async (reservationId: number) => {
  try {
    const response = await axiosInstance({
      method: 'delete',
      url: `cm/reservation/${reservationId}`,
    });
    return response.data;
  } catch (error) {
    alert(`Error canceling reservation: ${error}`);
    throw error;
  }
};
