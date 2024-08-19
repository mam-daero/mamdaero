import React from 'react';

interface TimeSlot {
  id: number;
  time: number;
}

interface TimeSelectionProps {
  availableTimes: TimeSlot[];
  selectedTime: number | null;
  setSelectedTime: (id: number) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  availableTimes,
  selectedTime,
  setSelectedTime,
}) => {
  const formatTime = (hour: number): string => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  return (
    <div>
      <div className="flex items-end font-bold border-b-4 border-b-orange-400 mb-4">
        <div className="text-xl">시간 선택</div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {availableTimes.map(timeSlot => (
          <button
            key={timeSlot.id}
            className={`btn ${
              selectedTime === timeSlot.id ? 'btn-primary' : 'btn-outline btn-primary bg-white'
            } rounded-full`}
            onClick={() => setSelectedTime(timeSlot.id)}
            // disabled={timeSlot.isReserved || !timeSlot.isWorkTime}
          >
            {formatTime(timeSlot.time)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelection;
