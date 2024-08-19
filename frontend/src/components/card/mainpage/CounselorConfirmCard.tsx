import React from 'react';
import { ImClock } from 'react-icons/im';
import { useQuery } from '@tanstack/react-query';
import useMemberStore from '@/stores/memberStore';
import { fetchReservation } from '@/pages/mycounsel/props/reservationApis';
import { Reservation } from '@/pages/mycounsel/props/reservationDetail';
import Button from '@/components/button/Button';
import { useNavigate } from 'react-router-dom';

const ReservConfirmCard: React.FC = () => {
  const { name } = useMemberStore();
  const navigate = useNavigate();
  const goMyCounsel = () => {
    navigate('/mycounsel/cs');
  };

  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery<Reservation[], Error>({
    queryKey: ['reservations'],
    queryFn: fetchReservation,
    select: res => res?.filter(reservation => reservation.status === '예약완료').reverse(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const displayedReservations = reservations?.slice(0, 4) || [];
  const hasReservations = displayedReservations.length > 0;

  return (
    <div
      className="p-8 max-w-sm bg-gray-50 rounded-lg shadow-lg"
      style={{ width: '384px', height: '404px' }}
    >
      <div className="flex w-full justify-center space-x-2 mb-6">
        <ImClock size={50} color="gray" />
      </div>
      <div className="text-xl font-bold text-center w-full truncate">
        <span className="text-blue-600 mr-2 text-3xl">{name}</span>
        <span>상담사님!</span>
        <h2>상담 예약 내역을 확인하세요!</h2>
        <div className="space-y-4">
          <div className="text-base mt-4">
            <ul className="space-y-2 text-center">
              {displayedReservations.length > 0 ? (
                displayedReservations.map(reservation => (
                  <li key={reservation.reservationId}>
                    {reservation.date} {reservation.formatTime} <u>{reservation.memberName}</u> 님
                  </li>
                ))
              ) : (
                <li>오늘 예약된 상담이 없습니다.</li>
              )}
            </ul>
          </div>
          {hasReservations && (
            <div>
              <Button
                label="예약 내역 자세히보기"
                onClick={goMyCounsel}
                size="목록보기"
                textSize="sm"
                color="blue"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservConfirmCard;
