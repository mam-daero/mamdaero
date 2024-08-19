import axiosInstance from './axiosInstance';

/**
 * 일기 목록 조회
 */
export const getEmotionDiaryList = async (year: number, month: number) => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/m/diary',
    params: {
      year,
      month,
    },
  });

  return response.data;
};

/**
 * 일기 상세 조회
 */
export const getEmotionDiary = async (diaryId: number) => {
  const response = await axiosInstance({
    method: 'GET',
    url: `/m/diary${diaryId}`,
  });

  return response.data;
};

/**
 * 일기 작성
 */

export interface CreateEmotionDiaryRequest {
  content: string;
  date: Date | string;
  isOpen: boolean;
  emotion: string;
}

export const createEmotionDiary = (data: CreateEmotionDiaryRequest) => {
  return axiosInstance({
    method: 'POST',
    url: '/m/diary',
    data,
  });
};

export interface UpdateEmotionDiaryRequest {
  content: string;
  isOpen: boolean;
  emotion: string;
  date: Date | string;
}
/**
 * 일기 수정
 */

export const updateEmotionDiary = (diaryId: number, data: UpdateEmotionDiaryRequest) => {
  return axiosInstance({
    method: 'PATCH',
    url: `/m/diary/${diaryId}`,
    data,
  });
};

/**
 * 일기 삭제
 */
export const deleteEmotionDiary = (diaryId: number) => {
  return axiosInstance({
    method: 'DELETE',
    url: `/m/diary/${diaryId}`,
  });
};
