import {
  createEmotionDiary,
  CreateEmotionDiaryRequest,
  deleteEmotionDiary,
  getEmotionDiary,
  getEmotionDiaryList,
  updateEmotionDiary,
  UpdateEmotionDiaryRequest,
} from '@/api/emotionDiary';
import { Emotion } from '@/pages/emotiondiary/emotion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface DiaryResponse {
  id: number;
  emotion: Emotion;
  content: string;
  date: string;
  isOpen: boolean;
}

export const useGetEmotionDiaryList = (year: number, month: number) => {
  return useQuery({
    queryKey: ['emotionDiaryList', year, month],
    queryFn: () => getEmotionDiaryList(year, month),
    select: ({ content }: { content: DiaryResponse[] }) => content,
  });
};

export const useGetEmotionDiary = (diaryId: number) => {
  return useQuery({
    queryKey: ['emotionDiary', diaryId],
    queryFn: () => getEmotionDiary(diaryId),
  });
};

export const useCreateEmotionDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmotionDiaryRequest) => createEmotionDiary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotionDiaryList'] });
    },
  });
};

export const useUpdateEmotionDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ diaryId, data }: { diaryId: number; data: UpdateEmotionDiaryRequest }) =>
      updateEmotionDiary(diaryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotionDiaryList'] });
    },
  });
};

export const useDeleteEmotionDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (diaryId: number) => deleteEmotionDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotionDiaryList'] });
    },
  });
};
