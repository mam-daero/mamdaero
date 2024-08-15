import axiosInstance from './axiosInstance';

export const completeConsult = (reservationId: number) => {
  return axiosInstance({
    url: `/c/reservation/${reservationId}`,
    method: 'PATCH',
  });
};
