import React, { useState, useEffect } from 'react';
import { WorkSchedule } from '@/hooks/useCounselorSchedule';
import { FiX, FiPlusCircle } from 'react-icons/fi';

const generateTimeOptions = () => {
  return Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);
};

interface TimeCardProps {
  week: number;
  startTime: number;
  endTime: number;
  times: WorkSchedule[];
  setEndTime: (endTime: number) => void;
  setStartTime: (startTime: number) => void;
  addTime: (time: Omit<WorkSchedule, 'workScheduleId' | 'counselorId'>) => void;
  onDeleteTime: (scheduleId: number) => void;
}

const TimeCard: React.FC<TimeCardProps> = ({
  week,
  startTime,
  endTime,
  times,
  setEndTime,
  setStartTime,
  addTime,
  onDeleteTime,
}) => {
  const [startTimeOptions, setStartTimeOptions] = useState<string[]>(generateTimeOptions());
  const [endTimeOptions, setEndTimeOptions] = useState<string[]>(generateTimeOptions());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const newEndTimeOptions = generateTimeOptions().slice(
      generateTimeOptions().indexOf(`${startTime < 10 ? '0' : ''}${startTime}:00`) + 1
    );
    setEndTimeOptions(newEndTimeOptions);
  }, [startTime]);

  const handleAddTime = () => {
    if (endTime > 24) {
      setAlertMessage('24시 이후의 시간은 선택할 수 없습니다.');
      return;
    }

    const newTimeSlot: Omit<WorkSchedule, 'workScheduleId' | 'counselorId'> = {
      day: week,
      startTime,
      endTime,
    };

    const isOverlap = times.some(
      time =>
        (newTimeSlot.startTime >= time.startTime && newTimeSlot.startTime < time.endTime) ||
        (newTimeSlot.endTime > time.startTime && newTimeSlot.endTime <= time.endTime) ||
        (newTimeSlot.startTime <= time.startTime && newTimeSlot.endTime >= time.endTime)
    );

    if (isOverlap) {
      setAlertMessage('이미 선택된 시간입니다.');
      return;
    }

    addTime(newTimeSlot);

    setAlertMessage(null);
    setStartTime(endTime);
    setEndTime(endTime + 1);
  };

  return (
    <div className="bg-white p-5 rounded-xl border-4 mb-4">
      <span className="text-xl font-bold block mb-4 text-center">시간 선택</span>
      {alertMessage && (
        <div role="alert" className="alert alert-warning mb-4 text-sm font-bold ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{alertMessage}</span>
        </div>
      )}
      <div className="flex flex-col gap-2 mb-2">
        {times.map(time => (
          <div
            key={time.workScheduleId}
            className="flex justify-between items-center font-bold text-center bg-blue-200 border rounded-full py-2 px-4"
          >
            <span>{`${time.startTime < 10 ? '0' + time.startTime : time.startTime}:00 ~ ${
              time.endTime < 10 ? '0' + time.endTime : time.endTime
            }:00`}</span>
            <button onClick={() => onDeleteTime(time.workScheduleId)}>
              <FiX />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4">
        <select
          className="bg-gray-50 rounded-full border text-bold py-2 px-3"
          value={startTime}
          onChange={e => {
            const newStartTime = Number(e.target.value);
            setStartTime(newStartTime);
            setEndTime(newStartTime + 1);
          }}
        >
          {startTimeOptions.map(time => (
            <option key={time} value={Number(time.split(':')[0])}>
              {time}
            </option>
          ))}
        </select>
        <span className="px-2">~</span>
        <select
          className=" rounded-full border bg-gray-50 text-bold py-2 px-3"
          value={endTime}
          onChange={e => setEndTime(Number(e.target.value))}
        >
          {endTimeOptions.map(time => (
            <option key={time} value={Number(time.split(':')[0])}>
              {time}
            </option>
          ))}
        </select>
      </div>
      {endTime <= 24 && (
        <button
          onClick={handleAddTime}
          className="bg-transparent mx-auto block font-bold mt-6 text-blue-500"
        >
          <FiPlusCircle className="inline" /> 시간 추가
        </button>
      )}
    </div>
  );
};

export default TimeCard;
