import axiosInstance from './axiosInstance';

export interface CounselorItem {
  counselorItemId: number;
  name: string;
  description: string;
  fee: number;
}

export const getCounselorItems = async () => {
  const response = await axiosInstance.get<CounselorItem[]>('/c/counselor-item');
  return response.data;
};

export const createCounselorItem = async (item: Omit<CounselorItem, 'counselorItemId'>) => {
  const response = await axiosInstance.post<CounselorItem>('/c/counselor-item', item);
  return response.data;
};

export const updateCounselorItem = async (item: CounselorItem) => {
  const response = await axiosInstance.patch<CounselorItem>(
    `/c/counselor-item/${item.counselorItemId}`,
    item
  );
  return response.data;
};

export const deleteCounselorItem = async (itemId: number) => {
  await axiosInstance.delete(`/c/counselor-item/${itemId}`);
};
