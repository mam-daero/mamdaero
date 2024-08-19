import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface Situation {
  id: number;
  name: string;
}

interface SituationSelectionProps {
  selectedSituations: number[];
  setSelectedSituations: React.Dispatch<React.SetStateAction<number[]>>;
}

const fetchSituation = async () => {
  const response = await axiosInstance({
    method: 'get',
    url: 'p/situation',
  });
  return response.data;
};

const SituationSelection: React.FC<SituationSelectionProps> = ({
  selectedSituations,
  setSelectedSituations,
}) => {
  const {
    data: situations = [],
    isLoading,
    isError,
  } = useQuery<Situation[]>({ queryKey: ['situations'], queryFn: fetchSituation });

  const handleToggleSelection = (situationId: number) => {
    setSelectedSituations(prev =>
      prev.includes(situationId) ? prev.filter(id => id !== situationId) : [...prev, situationId]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching situations</div>;

  return (
    <div>
      <div className="flex items-end border-b-4 border-b-orange-400 mb-4 space-x-5">
        <div className="text-xl font-bold">상황 선택</div>
        <div className="text-sm mb-1">중복 선택이 가능합니다.</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {situations.map(situation => (
          <button
            key={situation.id}
            className={`btn text-base ${
              selectedSituations.includes(situation.id)
                ? 'btn-secondary'
                : 'btn-outline btn-secondary bg-white'
            } rounded-full`}
            onClick={() => handleToggleSelection(situation.id)}
          >
            {situation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SituationSelection;
