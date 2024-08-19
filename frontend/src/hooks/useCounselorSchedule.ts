import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

export interface WorkSchedule {
  workScheduleId: number;
  counselorId: number;
  day: number;
  startTime: number;
  endTime: number;
}

export const getCounselorSchedule = async (day: number) => {
  const response = await axiosInstance.get<WorkSchedule[]>(`/c/counselor/schedule?day=${day}`);
  return response.data;
};

export const createCounselorSchedule = async (
  schedules: Omit<WorkSchedule, 'workScheduleId' | 'counselorId'>[]
) => {
  const response = await axiosInstance.post<WorkSchedule[]>('/c/counselor/schedule', schedules);
  return response.data;
};

export const deleteCounselorSchedule = async (scheduleId: number) => {
  await axiosInstance.delete(`/c/counselor/schedule/${scheduleId}`);
};

export const useAllCounselorSchedules = () => {
  const days = [1, 2, 3, 4, 5, 6, 7];
  return useQueries({
    queries: days.map(day => ({
      queryKey: ['counselorSchedule', day],
      queryFn: () => getCounselorSchedule(day),
    })),
  });
};

export const useCreateCounselorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCounselorSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorSchedule'] });
    },
  });
};

export const useDeleteCounselorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCounselorSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorSchedule'] });
    },
  });
};
