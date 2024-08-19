import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/pages/mycounsel/props/reservationDetail';
import { fetchReservationDetail } from '@/pages/mycounsel/props/reservationApis';

import Button from '@/components/button/Button';
import ChatModal from '@/components/modal/ChatModal';
import ReservationDetailModal from '@/components/modal/ReservationDetailModal';

const CounselorCompletedCard: React.FC<Reservation> = ({
  reservationId,
  date,
  formatTime,
  status,
  memberName,
}) => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [reservationDetail, setReservationDetail] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const detail = await fetchReservationDetail(reservationId);
        setReservationDetail(detail);
      } catch (error) {
        console.error('Error fetching reservation detail:', error);
      }
    };

    fetchDetail();
  }, [reservationId]);

  const handleOpenDetailModal = () => {
    if (reservationDetail) {
      setIsDetailModalOpen(true);
    } else {
      console.error('Reservation detail not available');
    }
  };

  return (
    <div className="border-b-2 border-blue-300 p-6">
      <h3 className="text-xl font-bold mb-3">{memberName} 님</h3>
      <div className="grid grid-cols-7 gap-4">
        <div className="text-gray-500 col-span-1 space-y-3">
          <p>상담ID</p>
          <p>일자</p>
          <p>시간</p>
          <p>현재 상태</p>
        </div>
        <div className="font-apple-sdgothic-semi-bold col-span-4 space-y-3">
          <div className="flex gap-4 items-center">
            {reservationId}
            <Button
              label="상세보기"
              onClick={handleOpenDetailModal}
              size="xs"
              shape="rounded"
              color="extragray"
              textSize="xs"
            />
          </div>
          <p>{date}</p>
          <p>{formatTime}</p>
          <p className="text-green-600 font-bold">{status}</p>
        </div>
        <div className="flex flex-col col-span-2 items-center mt-4 gap-3">
          <Button
            label="상담 기록 보기"
            onClick={() => {
              if (reservationDetail && reservationDetail.memberId) {
                navigate(`/mycounsel/record/${reservationDetail.memberId}`);
              } else {
                console.error('Member ID not available');
              }
            }}
            size="lg"
            shape="rounded"
            color="blue"
          />
          <Button
            label="1:1 메신저 채팅"
            onClick={() => setIsChatModalOpen(true)}
            size="lg"
            shape="rounded"
            color="gray"
          />
        </div>
      </div>
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        memberName={memberName}
        reservationId={reservationId.toString()}
        user="counselor"
      />
      {reservationDetail && (
        <ReservationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          reservationDetail={reservationDetail}
        />
      )}
    </div>
  );
};

export default CounselorCompletedCard;
