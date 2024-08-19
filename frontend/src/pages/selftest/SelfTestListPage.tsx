import React from 'react';
import { FaCheck } from 'react-icons/fa';
import SelfTestCard from '@/components/card/SelfTestCard';
import TestBar from '@/components/navigation/TestBar';
import useSelfTests from '@/hooks/useSelfTests';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

type MentalType = 'depressed' | 'unrest' | 'stress' | 'ptsd' | 'bipolar';

const convertToMentalType = (name: string): MentalType => {
  switch (name) {
    case 'depressed':
      return 'depressed';
    case 'unrest':
      return 'unrest';
    case 'stress':
      return 'stress';
    case 'ptsd':
      return 'ptsd';
    case 'bipolar':
      return 'bipolar';
    default:
      return 'depressed'; // 기본값 설정
  }
};

const SelfTestListPage: React.FC = () => {
  const { selfTestList, isLoadingList, isErrorList } = useSelfTests();

  if (isLoadingList) return <LoadingIndicator />;
  if (isErrorList) return <ErrorMessage message="FAILED TO LOAD" />;

  return (
    <div>
      <TestBar
        title="맘대로"
        subtitle="맘대로 자가검진을 통해 내 마음건강을 측정해보세요!"
        showBackButton={false}
      />
      <div className="flex text-sm space-x-5 m-12 justify-center">
        <FaCheck />
        <p>추후 상담사와의 상담시, 사전 심리검사 제출용으로 쓸 수 있습니다.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 w-full h-full mb-10">
        {selfTestList?.map(test => (
          <SelfTestCard
            key={test.id}
            mental={convertToMentalType(test.selftestName)}
            testId={test.id}
          />
        ))}
      </div>
    </div>
  );
};

export default SelfTestListPage;
