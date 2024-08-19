import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface Symptom {
  id: number;
  name: string;
}

interface SymptomSelectionProps {
  selectedSymptoms: number[];
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<number[]>>;
}

const fetchSymptom = async () => {
  const response = await axiosInstance({
    method: 'get',
    url: 'p/symptom',
  });
  return response.data;
};

const SymptomSelection: React.FC<SymptomSelectionProps> = ({
  selectedSymptoms,
  setSelectedSymptoms,
}) => {
  const {
    data: symptoms = [],
    isLoading,
    isError,
  } = useQuery<Symptom[]>({ queryKey: ['symptoms'], queryFn: fetchSymptom });

  const handleToggleSelection = (symptomId: number) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId) ? prev.filter(s => s !== symptomId) : [...prev, symptomId]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching situations</div>;

  return (
    <div>
      <div className="flex items-end border-b-4 border-b-orange-400 mb-4 space-x-5">
        <div className="text-xl font-bold">증상 선택</div>
        <div className="text-sm mb-1">중복 선택이 가능합니다.</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {symptoms.map(symptom => (
          <button
            key={symptom.id}
            className={`btn text-base ${
              selectedSymptoms.includes(symptom.id)
                ? 'btn-accent'
                : 'btn-outline btn-accent bg-white'
            } rounded-full`}
            onClick={() => handleToggleSelection(symptom.id)}
          >
            {symptom.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SymptomSelection;
