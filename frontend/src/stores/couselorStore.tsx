import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '@/api/axiosInstance';
import useAuthStore from '@/stores/authStore';

interface CounselorState {
  id: number | null; // 새로 추가된 필드
  name: string | null;
  email: string | null;
  nickname: string | null;
  birth: string | null;
  tel: string | null;
  gender: string | null;
  level: number | null;
  license: string | null;
  intro: string | null;
  introDetail: string | null;
  img: string | null;
  reviewCount: number | null; // 새로 추가된 필드
  reviewRate: number | null; // 새로 추가된 필드
  isLoading: boolean;
  error: string | null;
}

interface UpdateCounselorInfo {
  nickname: string | null;
  birth: string | null;
  tel: string | null;
  gender: string | null;
}

const useCounselorStore = create<
  CounselorState & {
    fetchCounselorInfo: () => Promise<void>;
    updateCounselorInfo: (profileData: UpdateCounselorInfo) => Promise<void>;
    updateIntro: (intro: string) => Promise<void>;
    updateIntroDetail: (introDetail: string) => Promise<void>;
    updateImg: (img: File) => Promise<void>;
    clearCounselorInfo: () => void;
  }
>()(
  persist(
    (set, get) => ({
      id: null, // 초기 상태에 추가
      name: null,
      email: null,
      nickname: null,
      birth: null,
      tel: null,
      gender: null,
      level: null,
      license: null,
      intro: null,
      introDetail: null,
      img: null,
      reviewCount: null, // 초기 상태에 추가
      reviewRate: null, // 초기 상태에 추가
      isLoading: false,
      error: null,

      fetchCounselorInfo: async () => {
        set({ isLoading: true });
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          set({ error: 'No access token available', isLoading: false });
          return;
        }
        try {
          const [counselorResponse, memberResponse] = await Promise.all([
            axiosInstance.get('/c/member/counselor', {
              headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axiosInstance.get('/m/member', { headers: { Authorization: `Bearer ${accessToken}` } }),
          ]);

          set({
            ...counselorResponse.data,
            ...memberResponse.data,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      updateCounselorInfo: async (profileData: UpdateCounselorInfo) => {
        set({ isLoading: true });
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          set({ error: 'No access token available', isLoading: false });
          return;
        }
        try {
          await axiosInstance.patch('/m/member', profileData, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          set(state => ({
            ...state,
            ...profileData,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      updateIntro: async (intro: string) => {
        set({ isLoading: true });
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          set({ error: 'No access token available', isLoading: false });
          return;
        }
        try {
          await axiosInstance.patch(
            '/c/member/counselor/intro',
            { intro },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          set(state => ({ ...state, intro, isLoading: false, error: null }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      updateIntroDetail: async (introDetail: string) => {
        set({ isLoading: true });
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          set({ error: 'No access token available', isLoading: false });
          return;
        }
        try {
          await axiosInstance.patch(
            '/c/member/counselor/intro-detail',
            { introDetail },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          set(state => ({ ...state, introDetail, isLoading: false, error: null }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      updateImg: async (img: File) => {
        set({ isLoading: true });
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          set({ error: 'No access token available', isLoading: false });
          return;
        }
        try {
          const formData = new FormData();
          formData.append('file', img);
          const response = await axiosInstance.patch('/c/member/counselor/img', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          set(state => ({ ...state, img: response.data.img, isLoading: false, error: null }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },

      clearCounselorInfo: () => {
        set({
          id: null, // clearCounselorInfo에 추가
          name: null,
          email: null,
          nickname: null,
          birth: null,
          tel: null,
          gender: null,
          level: null,
          license: null,
          intro: null,
          introDetail: null,
          img: null,
          reviewCount: null, // clearCounselorInfo에 추가
          reviewRate: null, // clearCounselorInfo에 추가
          error: null,
        });
      },
    }),
    {
      name: 'counselor-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCounselorStore;
