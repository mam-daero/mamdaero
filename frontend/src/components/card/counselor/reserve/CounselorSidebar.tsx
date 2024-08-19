import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DefaultProfile from '@/assets/DefaultProfile.jpg';
import Button from '@/components/button/Button';
import axiosInstance from '@/api/axiosInstance';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

interface Product {
  counselorItemId: number;
  name: string;
  fee: number;
  description: string;
}

interface ReservationData {
  workTimeId: number;
  situationIds: number[];
  symptomIds: number[];
  isDiaryShared: boolean;
  isTestShared: boolean;
  requirement: string;
  counselorItemId?: number;
}

interface CounselorSidebarProps {
  username: string;
  counselorId: number;
  getReservationData: () => ReservationData | null;
  counselorImg: string;
}

const fetchProducts = async (counselorId: number): Promise<Product[]> => {
  const response = await axiosInstance({
    method: 'get',
    url: `p/counselor-item/${counselorId}`,
  });
  return response.data;
};

const createReservation = async (reservationData: ReservationData) => {
  const response = await axiosInstance({
    method: 'post',
    url: 'm/reservation',
    data: reservationData,
  });
  return response.data;
};

const CounselorSidebar: React.FC<CounselorSidebarProps> = ({
  username,
  counselorId,
  getReservationData,
  counselorImg,
}) => {
  const navigate = useNavigate();
  const { isClient, isAuthenticated } = useAuthStore();
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ['counselorProducts', counselorId],
    queryFn: () => fetchProducts(counselorId),
  });
  // 원화
  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat('ko-KR', {
        style: 'decimal',
        maximumFractionDigits: 0,
      }).format(amount) + '원'
    );
  };

  // 예약
  const handleReservation = async (counselorItemId: number) => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      navigate('/');
      return;
    }

    if (isAuthenticated && !isClient) {
      alert('일반 회원만 예약 가능합니다.');
    }

    const reservationData = getReservationData();
    if (reservationData) {
      try {
        await createReservation({ ...reservationData, counselorItemId });
        navigate('/mycounsel');
        alert('예약이 완료되었습니다.');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.data === 'RES001') {
            alert('존재하지 않는 예약 정보입니다.');
          } else if (axiosError.response?.data === 'RES002') {
            alert('이미 예약된 시간입니다.');
          } else if (axiosError.response?.data === 'RES003') {
            alert('증상 정보를 입력해주세요.');
          } else if (axiosError.response?.data === 'RES004') {
            alert('상황 정보를 입력해주세요.');
          }
        } else {
          alert('예약 중 알 수 없는 오류가 발생했습니다.');
        }
      }
    }
  };

  if (isLoading) return <div>상품 정보를 불러오는 중...</div>;
  if (error) return <div>상품을 불러오는 데 실패했습니다. 다시 시도해 주세요.</div>;

  return (
    <div className="sticky top-20 overflow-auto">
      <img
        src={counselorImg || DefaultProfile}
        alt={`${username} 프로필 이미지`}
        className="w-full h-64 object-cover rounded-lg"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; // 무한 루프 방지
          target.src = DefaultProfile;
        }}
      />
      <div className="flex my-4 justify-start">
        <div className="flex items-end">
          <div className="text-3xl font-bold">{username}</div>
          <div className="text-base font-bold ml-2">상담사</div>
        </div>
      </div>
      <div>
        <div className="text-xl font-bold border-b-4 border-primary pb-2 mb-4">상품선택</div>
        {products && products.length > 0 ? (
          products.map(product => (
            <div
              key={product.counselorItemId}
              className="mb-3 collapse collapse-plus bg-white border border-orange-400 shadow-sm rounded-lg"
            >
              <input
                type="checkbox"
                className="peer"
                checked={expandedProduct === product.name}
                onChange={() =>
                  setExpandedProduct(expandedProduct === product.name ? null : product.name)
                }
              />
              <div className="collapse-title text-base font-medium">
                <div className="font-bold">{product.name}</div>
                <div>{formatCurrency(product.fee)}</div>
              </div>
              <div className="collapse-content">
                <p className="mb-4">{product.description}</p>
                <div className="flex justify-center">
                  <Button
                    label="예약하기"
                    onClick={() => handleReservation(product.counselorItemId)}
                    color="orange"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>등록된 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CounselorSidebar;
