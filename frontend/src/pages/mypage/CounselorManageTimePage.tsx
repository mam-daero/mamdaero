import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/button/Button';
import TimeCard from '@/components/card/mypage/TimeCard';
import WeekSelection from '@/components/card/mypage/WeekSelection';
import MyCounselBar from '@/components/navigation/MyCounselBar';
import {
  useAllCounselorSchedules,
  useCreateCounselorSchedule,
  useDeleteCounselorSchedule,
  WorkSchedule,
} from '@/hooks/useCounselorSchedule';
import useAuthStore from '@/stores/authStore';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

const allWeeks = {
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
  일: 7,
} as const;

type WeekName = keyof typeof allWeeks;

const CounselorManageTimePage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { getEmail } = useAuthStore();
  const currentMemberId = memberId || getEmail()?.split('@')[0] || 'unknown';

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(10);
  const navigate = useNavigate();

  const allSchedulesQueries = useAllCounselorSchedules();
  const createMutation = useCreateCounselorSchedule();
  const deleteMutation = useDeleteCounselorSchedule();

  const isLoading = allSchedulesQueries.some(query => query.isLoading);
  const isError = allSchedulesQueries.some(query => query.isError);

  const allSchedules = useMemo(() => {
    return allSchedulesQueries.flatMap(query => query.data || []);
  }, [allSchedulesQueries]);

  const handleWeekSelection = (week: number) => {
    setSelectedWeek(week);
  };

  const handleAddTime = (newTime: Omit<WorkSchedule, 'workScheduleId' | 'counselorId'>) => {
    createMutation.mutate([newTime]);
  };

  const handleDeleteTime = (scheduleId: number) => {
    deleteMutation.mutate(scheduleId);
  };

  const scheduledWeeks = [...new Set(allSchedules.map(schedule => schedule.day))];

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message="FAILED TO LOAD" />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-blue-50 border-b-2 mb-12">
        <MyCounselBar
          title1="상담"
          title2="일정 관리"
          subtitle="상담 일정을 손쉽게 관리하고 업데이트 하세요!"
          buttonLabel="뒤로가기"
          user="counselor"
          buttonPath={`/mypage/${currentMemberId}`}
          size="md"
        />
      </div>
      <div className="flex justify-around px-4">
        <div className="w-1/5 pr-4">
          <div className="bg-white p-5 rounded-xl border-4 mb-4 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-4 text-center">요일 선택</h1>
            <WeekSelection
              allWeeks={allWeeks}
              scheduledWeeks={scheduledWeeks}
              selectedWeek={selectedWeek}
              setSelectedWeek={handleWeekSelection}
            />
          </div>
        </div>
        <div className="w-1/3 px-4">
          {selectedWeek !== null ? (
            <TimeCard
              week={selectedWeek}
              startTime={startTime}
              endTime={endTime}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              times={allSchedules.filter(schedule => schedule.day === selectedWeek)}
              addTime={handleAddTime}
              onDeleteTime={handleDeleteTime}
            />
          ) : (
            <div className="flex justify-center h- bg-white p-5 rounded-xl border-4 mb-4">
              <p className="text-xl font-bold text-gray-500">요일을 선택해주세요</p>
            </div>
          )}
        </div>
        <div className="w-1/3 pl-4">
          <div className="bg-white p-5 rounded-xl border-4 mb-4">
            <h1 className="text-xl font-bold mb-4 text-center">전체 일정</h1>
            <div className="space-y-3">
              {(Object.keys(allWeeks) as WeekName[]).map(weekName => {
                const weekNum = allWeeks[weekName];
                const times = allSchedules.filter(schedule => schedule.day === weekNum);
                return (
                  <div key={weekNum} className="flex flex-col mb-2">
                    <h2 className="font-bold">{weekName}</h2>
                    {times.length > 0 ? (
                      times.map(time => (
                        <div
                          key={time.workScheduleId}
                          className="flex justify-between items-center"
                        >
                          <span>{`${time.startTime < 10 ? '0' : ''}${time.startTime}:00 ~ ${
                            time.endTime < 10 ? '0' : ''
                          }${time.endTime}:00`}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">일정이 없습니다.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorManageTimePage;
