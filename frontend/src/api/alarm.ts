import axiosInstance from '@/api/axiosInstance';

export const fetchNotifications = async () => {
  const response = await axiosInstance({
    method: 'get',
    url: 'cm/notification',
  });
  console.log('response', response.data.data);
  return response.data.data;
};

export const readNotification = async (notificationId: number) => {
  const response = await axiosInstance({
    method: 'patch',
    url: `cm/notification/${notificationId}`,
  });
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await axiosInstance({
    method: 'delete',
    url: 'cm/notification',
  });
  return response.data;
};

export const deleteNotification = async (notificationId: number) => {
  const response = await axiosInstance({
    method: 'delete',
    url: `cm/notification/${notificationId}`,
  });
  return response.data;
};
