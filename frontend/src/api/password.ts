import axiosInstance from './axiosInstance';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    message: string;
  };
}

export const changePassword = async (data: PasswordChangeData): Promise<ApiResponse> => {
  const response = await axiosInstance({
    url: '/cm/member/password-modify',
    method: 'PATCH',
    data,
  });
  return response.data;
};
