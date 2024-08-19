import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCounselorItems,
  createCounselorItem,
  updateCounselorItem,
  deleteCounselorItem,
  CounselorItem,
} from '@/api/counselorItem';

export const useCounselorItems = () => {
  return useQuery({
    queryKey: ['counselorItems'],
    queryFn: getCounselorItems,
  });
};

export const useCreateCounselorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCounselorItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorItems'] });
    },
  });
};

export const useUpdateCounselorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCounselorItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorItems'] });
    },
  });
};

export const useDeleteCounselorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCounselorItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorItems'] });
    },
  });
};
