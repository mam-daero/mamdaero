import React, { useRef, useEffect } from 'react';
import { FaBell, FaTrash, FaTimes } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  fetchNotifications,
  readNotification,
  deleteAllNotifications,
  deleteNotification,
} from '@/api/alarm';

interface Notification {
  id: number;
  eventId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  eventSource: string;
}

const AlarmModal: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery<Notification[], AxiosError>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const eventSourceLabels = {
    RESERVATION: '예약',
    COUNSELOR_BOARD: '슈퍼비전',
    BOARD: '커뮤니티',
  };

  const markAsReadMutation = useMutation<void, AxiosError, number>({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: error => {
      alert('알람을 불러오는 동안 오류가 발생했습니다.');
    },
  });

  const deleteAllNotificationsMutation = useMutation<void, AxiosError>({
    mutationFn: deleteAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteNotificationMutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleNotificationClick = (notificationId: number) => {
    if (notifications) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        markAsReadMutation.mutate(notificationId);
      }
    }
  };

  const handleDeleteAllNotifications = () => {
    if (window.confirm('전체 알람을 삭제하시겠습니까?')) {
      deleteAllNotificationsMutation.mutate();
    }
  };

  return (
    <dialog id="alarm_modal" className="modal">
      <div className="modal-box bg-white p-10 rounded-lg w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold mr-2">알림</h2>
          <div>
            <button
              onClick={handleDeleteAllNotifications}
              className="text-red-500 hover:text-red-700 mt-1"
            >
              <FaTrash className="text-md" />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-md">알림이 없습니다.</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className="border-b py-4 px-2 flex items-start hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <p
                    className={`text-md ${notification.isRead ? 'text-gray-600' : 'font-semibold'}`}
                  >
                    <span className="font-bold mr-2 text-gray-500">
                      [
                      {eventSourceLabels[
                        notification.eventSource as keyof typeof eventSourceLabels
                      ] || ''}
                      ]
                    </span>
                    {notification.content}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotificationMutation.mutate(notification.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AlarmModal;
