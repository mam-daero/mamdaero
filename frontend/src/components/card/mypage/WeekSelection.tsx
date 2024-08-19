import React from 'react';

interface WeekSelectionProps {
  allWeeks: Record<string, number>;
  scheduledWeeks: number[];
  selectedWeek: number | null;
  setSelectedWeek: (week: number) => void;
}

const WeekSelection: React.FC<WeekSelectionProps> = ({
  allWeeks,
  scheduledWeeks,
  selectedWeek,
  setSelectedWeek,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(allWeeks).map(([day, value]) => {
        const isScheduled = scheduledWeeks.includes(value);
        const isSelected = selectedWeek === value;

        return (
          <button
            key={day}
            className={`btn rounded-full w-14 h-14 flex items-center justify-center text-lg font-medium ${
              isSelected
                ? 'bg-gray-300 text-black'
                : isScheduled
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border-blue-500 border-2'
            }`}
            onClick={() => setSelectedWeek(value)}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default WeekSelection;
