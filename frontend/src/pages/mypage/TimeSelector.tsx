// 근무시간 예외 페이지 time selector
import React from 'react';

interface TimeSelectorProps {
  selectedTimes: number[];
  onSelectTimes: (times: number[]) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTimes, onSelectTimes }) => {
  const times = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeToggle = (time: number) => {
    const newSelectedTimes = selectedTimes.includes(time)
      ? selectedTimes.filter(t => t !== time)
      : [...selectedTimes, time];
    onSelectTimes(newSelectedTimes);
  };

  const handleSelectAll = () => {
    onSelectTimes(selectedTimes.length === times.length ? [] : times);
  };

  return (
    <>
      <div className="flex justify-between font-bold border-b-4 border-b-blue-400 mb-4 align-middle pb-2">
        <div className="text-xl">시간 선택</div>
        <button className="w-fit bg-blue-200 p-1 rounded-full" onClick={handleSelectAll}>
          전체선택
        </button>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {times.map(time => (
          <button
            key={time}
            onClick={() => handleTimeToggle(time)}
            className={`btn ${
              selectedTimes.includes(time) ? 'btn-secondary' : 'btn-outline btn-secondary bg-white'
            } rounded-full`}
          >
            {`${time}:00`}
          </button>
        ))}
      </div>
    </>
  );
};

export default TimeSelector;
