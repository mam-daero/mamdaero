import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Reservation } from '@/pages/mycounsel/props/reservationDetail';
import {
  fetchReservation,
  fetchCompletedReservation,
} from '@/pages/mycounsel/props/reservationApis';
import CounselorReservationStatusCard from '@/components/card/mycounsel/CounselorReservationStatusCard';
import CounselorCompletedCard from '@/components/card/mycounsel/CounselorCompletedCard';
import MyCounselBar from '@/components/navigation/MyCounselBar';

const CounselHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservation' | 'completed'>('reservation');

  const reservationsQuery = useQuery<Reservation[], Error>({
    queryKey: ['reservations'],
    queryFn: fetchReservation,
    enabled: activeTab === 'reservation',
  });

  const completedReservationsQuery = useQuery<Reservation[], Error>({
    queryKey: ['completedReservations'],
    queryFn: fetchCompletedReservation,
    enabled: activeTab === 'completed',
  });

  const isLoading =
    (activeTab === 'reservation' && reservationsQuery.isLoading) ||
    (activeTab === 'completed' && completedReservationsQuery.isLoading);

  const error =
    (activeTab === 'reservation' && reservationsQuery.error) ||
    (activeTab === 'completed' && completedReservationsQuery.error);

  return (
    <div className="flex flex-col min-h-screen">
      <MyCounselBar
        title1="맘대로"
        title2="상담내역"
        subtitle="상담 예약 현황과 지금까지 완료된 상담을 확인하세요!"
        user="counselor"
      />
      <div className="sticky bg-blue-50 top-0 z-10">
        <div role="tablist" className="tabs tabs-lg font-bold border-b-4 border-b-blue-300">
          <a
            className={`tab tab-lg h-14 ${activeTab === 'reservation' ? 'tab-active bg-blue-200 rounded-t-md' : 'bg-blue-50'}`}
            onClick={() => setActiveTab('reservation')}
          >
            예약 현황
          </a>
          <a
            className={`tab tab-lg h-14 ${activeTab === 'completed' ? 'tab-active bg-blue-200 rounded-t-md' : 'bg-blue-50'}`}
            onClick={() => setActiveTab('completed')}
          >
            완료된 상담
          </a>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-4">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">Error: {error.message}</p>
      ) : activeTab === 'reservation' ? (
        <div className="px-4">
          {reservationsQuery.data && reservationsQuery.data.length > 0 ? (
            reservationsQuery.data.map(reservation => (
              <CounselorReservationStatusCard key={reservation.reservationId} {...reservation} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">예약된 상담이 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="px-4">
          {completedReservationsQuery.data && completedReservationsQuery.data.length > 0 ? (
            completedReservationsQuery.data.map(reservation => (
              <CounselorCompletedCard key={reservation.reservationId} {...reservation} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">완료된 상담이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CounselHistory;
