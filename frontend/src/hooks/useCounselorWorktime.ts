import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import useCounselorStore from '@/stores/couselorStore';
import dayjs from 'dayjs';

interface WorkTime {
  id: number;
  counselorId: number;
  date: string;
  time: number;
  isReserved: boolean;
  isWorkTime: boolean;
}

const fetchWorkTimes = async (counselorId: number, date: string) => {
  const response = await axiosInstance.get<WorkTime[]>(
    `/p/counselor/${counselorId}/worktime?date=${date}`
  );
  return response.data;
};

const updateWorkTimes = async (workTimes: { workTimeId: number; isWorkTime: boolean }[]) => {
  const response = await axiosInstance.patch<WorkTime[]>('/c/counselor/worktime', workTimes);
  return response.data;
};

export const useCounselorWorktime = () => {
  const counselorId = useCounselorStore(state => state.id);
  const queryClient = useQueryClient();

  // 오늘 날짜부터 27일 후까지의 날짜 배열 생성 (총 28일)
  const dates = Array.from({ length: 28 }, (_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));

  const worktimeQueries = useQueries({
    queries: dates.map(date => ({
      queryKey: ['worktime', counselorId, date],
      queryFn: () =>
        counselorId ? fetchWorkTimes(counselorId, date) : Promise.reject('No counselor ID'),
      enabled: !!counselorId,
    })),
  });

  const updateWorkTimeMutation = useMutation({
    mutationFn: updateWorkTimes,
    onSuccess: (_, variables) => {
      variables.forEach(({ workTimeId }) => {
        const date = worktimeQueries.find(query => query.data?.some(wt => wt.id === workTimeId))
          ?.data?.[0]?.date;
        if (date) {
          queryClient.invalidateQueries({ queryKey: ['worktime', counselorId, date] });
        }
      });
    },
  });

  const isLoading = worktimeQueries.some(query => query.isLoading);
  const isError = worktimeQueries.some(query => query.isError);
  const workTimes = worktimeQueries.flatMap(query => query.data || []);

  return {
    workTimes,
    isLoading,
    isError,
    updateWorkTimes: updateWorkTimeMutation.mutate,
  };
};
