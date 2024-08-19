import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '@/api/axiosInstance';
import useAuthStore from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface CalendarSectionProps {
  counselorId: number;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  setAvailableTimes: (times: { id: number; time: number }[]) => void;
}

interface WorkTime {
  id: number;
  counselorId: number;
  date: string;
  time: number;
  isReserved: boolean;
  isWorkTime: boolean;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  counselorId,
  selectedDate,
  setSelectedDate,
  setAvailableTimes,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleEventClick = async (info: { event: { startStr: string } }) => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      navigate('/');
      return;
    }

    const clickedDate = info.event.startStr;
    setSelectedDate(clickedDate);
    await fetchWorkTimes(clickedDate);
  };

  const fetchWorkTimes = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance<WorkTime[]>({
        method: 'get',
        url: `p/counselor/${counselorId}/worktime`,
        params: { date },
      });

      const availableTimes = response.data
        .filter(wt => !wt.isReserved && wt.isWorkTime)
        .map(wt => ({ id: wt.id, time: wt.time }));

      setAvailableTimes(availableTimes);
    } catch (error) {
      console.error('Error fetching work times:', error);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEventContent = (eventInfo: { event: { title: string } }) => (
    <div className="flex justify-center items-center h-full">
      <button
        className="btn btn-xs btn-primary text-xs p-1"
        // onClick={e => {
        //   e.stopPropagation(); // 이벤트 버블링 방지
        //   if (!isAuthenticated) {
        //     alert('로그인 후 이용해주세요.');
        //     navigate('/');
        //   }
        // }}
      >
        {eventInfo.event.title}
      </button>
    </div>
  );

  const getEventDates = () => {
    const events = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 27);

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      events.push({
        title: '예약하기',
        start: new Date(d),
        allDay: true,
      });
    }

    return events;
  };

  return (
    <div>
      <div className="flex items-end border-b-4 border-b-orange-400 mb-4 space-x-5">
        <div className="text-xl font-bold">날짜 선택</div>
        <div className="text-sm">예약 가능 날짜 중에 선택해주세요.</div>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={getEventDates()}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
          }}
          eventColor="#fff7ed"
          titleFormat={{ year: 'numeric', month: 'numeric' }}
          height="auto"
          contentHeight="auto"
        />
      </div>
      {selectedDate && (
        <div className="mt-2 text-sm text-orange-500">
          선택된 날짜: {new Date(selectedDate).toLocaleDateString()}
        </div>
      )}
      {isLoading && <div className="mt-2 text-sm">로딩 중...</div>}
    </div>
  );
};

export default CalendarSection;
