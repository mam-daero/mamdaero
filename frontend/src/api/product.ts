import axiosInstance from './axiosInstance';

// CounselorItem 인터페이스 정의
export interface CounselorItem {
  counselor_item_id: number;
  counselor_id: number;
  name: string;
  description: string | null;
  fee: number;
  is_delete: boolean;
}

// CreateCounselorItemData 인터페이스 정의
export interface CreateCounselorItemData {
  name: string;
  description: string | null;
  fee: number;
  counselor_id: number;
}

// UpdateCounselorItemData 인터페이스 정의
export interface UpdateCounselorItemData {
  name?: string;
  description?: string | null;
  fee?: number;
}

// 상담사의 모든 상담 상품 조회
export const fetchCounselorItems = async (counselorId: number): Promise<CounselorItem[]> => {
  const response = await axiosInstance({
    url: `/p/counselor-item/${counselorId}`,
    method: 'GET',
  });
  return response.data;
};

// 상담사의 상담 상품 목록 조회 (페이지네이션 포함)
export const fetchCounselorItemList = async (page: number = 1): Promise<CounselorItem[]> => {
  const response = await axiosInstance({
    url: '/c/counselor-item',
    method: 'GET',
    params: { page },
  });
  return response.data;
};

// 새 상담 상품 생성
export const createCounselorItem = async (
  itemData: CreateCounselorItemData
): Promise<CounselorItem> => {
  const response = await axiosInstance({
    url: '/c/counselor-item',
    method: 'POST',
    data: itemData,
  });
  return response.data;
};

// 상담 상품 수정
export const updateCounselorItem = async (
  itemId: number,
  itemData: UpdateCounselorItemData
): Promise<CounselorItem> => {
  const response = await axiosInstance({
    url: `/c/counselor-item/${itemId}`,
    method: 'PATCH',
    data: itemData,
  });
  return response.data;
};

// 상담 상품 삭제
export const deleteCounselorItem = async (itemId: number): Promise<void> => {
  await axiosInstance({
    url: `/c/counselor-item/${itemId}`,
    method: 'DELETE',
  });
};

// React Query 훅을 위한 타입 정의 (옵션)
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export const useCounselorItems = (counselorId: number) => {
//   return useQuery<CounselorItem[]>(['counselorItems', counselorId], () => fetchCounselorItems(counselorId));
// };

// export const useCounselorItemList = (page: number) => {
//   return useQuery<CounselorItem[]>(['counselorItemList', page], () => fetchCounselorItemList(page));
// };

// export const useCreateCounselorItem = () => {
//   const queryClient = useQueryClient();
//   return useMutation(createCounselorItem, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('counselorItems');
//     },
//   });
// };

// export const useUpdateCounselorItem = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     ({ itemId, data }: { itemId: number; data: UpdateCounselorItemData }) =>
//       updateCounselorItem(itemId, data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('counselorItems');
//       },
//     }
//   );
// };

// export const useDeleteCounselorItem = () => {
//   const queryClient = useQueryClient();
//   return useMutation(deleteCounselorItem, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('counselorItems');
//     },
//   });
// };
