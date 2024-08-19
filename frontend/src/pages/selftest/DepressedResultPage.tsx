import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TestBar from '@/components/navigation/TestBar';
import talk from '@/assets/fox_talk.png';
import Button from '@/components/button/Button';
import useMemberStore from '@/stores/memberStore';

interface LocationState {
  totalScore: number;
}

const getResultMessage = (score: number): string => {
  if (score <= 20) {
    return '종종 우울감을 경험하거나 정상범위에 속합니다. 평소 정기적인 검진과 관리를 통해 우울증을 예방하고 건강한 삶을 유지하시기 바랍니다.';
  } else {
    return '우울증 위험군에 속해 있습니다. 점수가 높을수록 우울의 정도가 심함을 의미합니다. 평소 예방 및 회복을 위해 적극적인 노력과 주변의 도움이 필요합니다. 그러나 스스로의 노력에도 불구하고 호전되지 않는다고 여겨진다면 전문가와의 상담 및 치료가 병행되어야 합니다. 본 센터로 연락주시면 전문상담원의 도움을 받을 수 있습니다.';
  }
};

const DepressedResultPage: React.FC = () => {
  const location = useLocation();
  const { totalScore = 0 } = (location.state as LocationState) || {};
  const resultMessage = getResultMessage(totalScore);
  const navigate = useNavigate();
  const { name } = useMemberStore();
  const displayName = name || '사용자';

  const handleRetry = () => {
    navigate('/selftest/depressed');
  };
  const handleGoToList = () => {
    navigate('/selftest');
  };

  return (
    <div className="min-h-screen">
      <TestBar
        title="우울"
        subtitle="기분이 늘 울적하고 매사에 의욕이 없나요?"
        showBackButton={false}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2 max-w-md">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl font-bold">검사 점수</h2>
              <div className="divider"></div>
              <p className="text-lg">{displayName}님의 우울척도 점수는 </p>
              <p className="text-lg mb-4">
                <span className="font-bold text-primary text-4xl">{totalScore}점</span> 입니다.
              </p>
              <img src={talk} alt="어린왕자" className="w-56 mb-4" />
              <p className="text-lg"></p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">우울 자가검진 결과입니다.</h2>
              <div className="divider"></div>
              <div>{resultMessage}</div>
              <div className="flex justify-center space-x-10 pt-5 font-bold">
                <Button
                  label="다시하기"
                  onClick={handleRetry}
                  size="lg"
                  textSize="md"
                  shape="rounded"
                  color="orange"
                />
                <Button
                  label="다른 검진 해보기 "
                  onClick={handleGoToList}
                  size="lg"
                  textSize="md"
                  shape="rounded"
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressedResultPage;
