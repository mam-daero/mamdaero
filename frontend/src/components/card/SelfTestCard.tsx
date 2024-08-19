import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import depressed from '@/assets/depressed.png';
import unrest from '@/assets/unrest.png';
import stress from '@/assets/stress.png';
import ptsd from '@/assets/ptsd.png';
import bipolar from '@/assets/bipolar.png';
import useSelfTests from '@/hooks/useSelfTests';

interface SelfTestCardProps {
  mental: string;
  testId: number;
}

const mentalImages: { [key: string]: string } = {
  depressed,
  unrest,
  stress,
  ptsd,
  bipolar,
};

const mentalTitles: { [key: string]: string } = {
  depressed: '우울',
  unrest: '불안',
  stress: '스트레스',
  ptsd: 'PTSD',
  bipolar: '조울증',
};

const SelfTestCard: React.FC<SelfTestCardProps> = ({ mental, testId }) => {
  const navigate = useNavigate();
  const {
    selfTestList,
    isLoadingList,
    isErrorList,
    previousTestResults,
    isLoadingPreviousResults,
    isErrorPreviousResults,
    isAuthenticated,
  } = useSelfTests();

  const mentalData = useMemo(() => {
    if (!selfTestList) return { title: mentalTitles[mental], image: mentalImages[mental] };

    const testInfo = selfTestList.find(item => item.id === testId);
    if (!testInfo) return { title: mentalTitles[mental], image: mentalImages[mental] };

    const descriptionMatch = testInfo.selftestInfo.match(
      /(.*?척도(?:\s+\S+)?(?:\([^)]+\))?)\s*(?:-|$)/
    );
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    return {
      title: mentalTitles[mental],
      image: mentalImages[mental],
      description: description,
    };
  }, [selfTestList, mental, testId]);

  const handleButtonClick = () => {
    if (isAuthenticated && previousTestResults) {
      const previousResult = previousTestResults.find(result => result.selftestName === mental);
      if (previousResult) {
        navigate(`/selftest/${mental}/result`, {
          state: {
            totalScore: previousResult.selftestTotalScore,
            isPreviousResult: true,
          },
        });
      } else {
        navigate(`/selftest/${mental}`, { state: { testId } });
      }
    } else {
      navigate(`/selftest/${mental}`, { state: { testId } });
    }
  };

  if (isLoadingList || isLoadingPreviousResults) return <div>Loading...</div>;
  if (isErrorList || isErrorPreviousResults) return <div>Error loading test information</div>;

  const { title, image, description } = mentalData;

  return (
    <div className="card bg-white w-72 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl">{title}</h2>
        <figure className="px-10">
          <div className="flex items-end justify-center h-40 w-full">
            <img src={image} alt={title} className="rounded-xl max-h-full object-contain" />
          </div>
        </figure>
        {description && <p>{description}</p>}
        <div className="card-actions">
          <Button
            onClick={handleButtonClick}
            label={
              isAuthenticated && previousTestResults?.some(result => result.selftestName === mental)
                ? '결과보기'
                : '검진하기'
            }
            size="sm"
            color="orange"
            textSize="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SelfTestCard;
