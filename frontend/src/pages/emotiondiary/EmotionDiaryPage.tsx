import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Emotion, getEmotionImage } from '@/pages/emotiondiary/emotion';
import DiaryWriteModal from '@/components/modal/DiaryWriteModal';
import DiaryEditModal from '@/components/modal/DiaryEditModal';
import DiaryViewModal from '@/components/modal/DiaryViewModal';
import { sampleDiaries } from '@/pages/emotiondiary/sampleData';
import EmotionStatisticsBar from '@/components/navigation/EmotionStatisticsBar';
import EmotionBar from '@/components/navigation/EmotionBar';
import { DiaryResponse, useGetEmotionDiaryList } from '@/hooks/emotionDiary';
import dayjs from 'dayjs';
import useMemberStore from '@/stores/memberStore';
import useAuthStore from '@/stores/authStore';
const getCurrentDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

const EmotionDiaryPage: React.FC = () => {
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const { name } = useMemberStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<DiaryResponse | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const calendarRef = useRef<FullCalendar | null>(null);


  const { data: diaryList = [], isLoading: isDairyListLoading } = useGetEmotionDiaryList(
    date.year,
    date.month
  );

  // 이전 달로 이동 버튼 클릭 시
  const onCilckPrev = () => {
    if (!calendarRef.current) return;
    calendarRef.current?.getApi().prev();
    const prevDate = calendarRef.current?.getApi().getDate();
    setDate({
      year: prevDate.getFullYear(),
      month: prevDate.getMonth() + 1,
    });
  };

  // 다음 달로 이동 버튼 클릭 시
  const onClickNext = () => {
    if (!calendarRef.current) return;
    calendarRef.current?.getApi().next();
    const nextDate = calendarRef.current?.getApi().getDate();
    setDate({
      year: nextDate.getFullYear(),
      month: nextDate.getMonth() + 1,
    });
  };

  const handleEventClick = (arg: EventClickArg) => {
    const diary = arg.event.extendedProps as DiaryResponse;
    if (diary) {
      setSelectedDiary(diary);
      setIsViewModalOpen(true);
    }
  };

  const handleWriteDiaryClick = () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
    } else {
      const currentDate = getCurrentDate();
      const isDiaryExist = diaryList?.some(diary => diary.date === currentDate);
      if (!isDiaryExist) {
        setSelectedDate(currentDate);
        setIsWriteModalOpen(true);
      } else {
        alert('오늘 일기는 이미 작성되었습니다.');
      }
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="flex w-full justify-center items-center">
      <img
        src={eventInfo.event.title}
        alt="emotion"
        className="w-full h-full object-contain cursor-pointer"
        style={{ width: '50%', height: '50%' }}
      />
    </div>
  );

  return (
    <div>
      <EmotionBar subtitle="오늘의 감정을 기록해보세요!" />
      {showAlert && (
        <div role="alert" className="alert alert-error my-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <div className="container p-4 flex space-x-16">
        {/* 캘린더 */}
        <div className="w-3/4 ">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={diaryList?.map(diary => ({
              id: '' + diary.id,
              date: diary.date,
              title: getEmotionImage(diary.emotion),
              extendedProps: diary,
            }))}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            eventColor="#fff7ed" // 이벤트 컬러 변경
            titleFormat={{ year: 'numeric', month: 'numeric' }}
            height="auto"
            customButtons={{
              prev: {
                click: onCilckPrev,
              },
              next: {
                click: onClickNext,
              },
            }}
          />

          <DiaryWriteModal
            isOpen={isWriteModalOpen}
            date={selectedDate || getCurrentDate()}
            onClose={() => setIsWriteModalOpen(false)}
          />
          {selectedDiary && (
            <>
              <DiaryEditModal
                isOpen={isEditModalOpen}
                diary={selectedDiary}
                onClose={() => setIsEditModalOpen(false)}
              />
              <DiaryViewModal
                isOpen={isViewModalOpen}
                diary={selectedDiary}
                onClose={() => setIsViewModalOpen(false)}
                onEdit={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              />
            </>
          )}
        </div>
        {/* 카드 */}
        <div className="w-2/5">
          <div className="card bg-base-100 shadow-xl p-4">
            <div className="card-body">

              {isAuthenticated ? (
                <h2 className="card-title text-2xl font-bold mb-2">{name}님</h2>
              ) : (
                <div className="card-title">로그인 후 일기를 작성해 보세요!</div>
              )}
              <p className="my-2">오늘 하루는 어떤 기분이었나요?</p>
              <button
                className="btn bg-orange-200 hover:bg-orange-300 text-gray-700 w-full"
                onClick={handleWriteDiaryClick}
              >
                오늘의 일기 쓰기
              </button>
              <div className="mt-4">
                <EmotionStatisticsBar diaries={diaryList ?? []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDiaryPage;
