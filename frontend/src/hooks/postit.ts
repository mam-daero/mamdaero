import {
  complaintPostit,
  createPostit,
  deletePostit,
  likePostit,
  updatePostit,
} from '@/api/postit';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useComplaintPostit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: complaintPostit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postits'] });
    },
  });
};

export const useLikePostit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePostit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postits'] });
    },
  });
};

export const useCreatePostit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postits'] });
    },
  });
};

export const useUpdatePostit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postits'] });
    },
  });
};

export const useDeletePostit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, id }: { questionId: number; id: number }) =>
      deletePostit(questionId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postits'] });
    },
  });
};
