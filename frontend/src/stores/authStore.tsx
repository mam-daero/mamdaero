import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/api/axiosInstance';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  role: string | null;
  email: string | null;
  login: (accessToken: string, role: string, email: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRole: () => string | null;
  getEmail: () => string | null;
  isCounselor: () => boolean;
  isClient: () => boolean;
  isAdmin: () => boolean;
}

// const logoutAPI = async () => {
//   try {
//     await axiosInstance({
//       method: 'post',
//       url: '/cma/member/logou',
//     });
//   } catch (error) {
//     alert('로그아웃에 실패했습니다.');
//   }
// };

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      role: null,
      email: null,
      login: async (accessToken: string, role: string, email: string) => {
        set({
          isAuthenticated: true,
          accessToken,
          role,
          email,
        });
        if (role !== '관리자') {
          // 동적 임포트를 사용하여 useMemberStore 가져오기
          const { default: useMemberStore } = await import('@/stores/memberStore');
          useMemberStore.getState().fetchMember();
        }
      },
      logout: async () => {
        // await logoutAPI();

        set({
          isAuthenticated: false,
          accessToken: null,
          role: null,
          email: null,
        });
        const { default: useMemberStore } = await import('@/stores/memberStore');
        useMemberStore.getState().clearMember();
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('member-storage');
        localStorage.removeItem('counselor-storage');
      },
      getAccessToken: () => get().accessToken,
      getRole: () => get().role,
      getEmail: () => get().email,
      isCounselor: () => get().role?.includes('상담사') ?? false,
      isClient: () => get().role?.includes('내담자') ?? false,
      isAdmin: () => get().role?.includes('관리자') ?? false,
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
