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
  if (score <= 12) {
    return '당신이 느끼는 스트레스 정도는 정상적인 수준으로, 심리적으로 안정되어 있습니다.';
  } else if (score <= 15) {
    return '약간의 스트레스를 받고 있으나 심각한 수준은 아닌 것으로 보입니다. 스트레스를 해소하기 위해 자신만의 방법을 찾아보는 것이 좋습니다.';
  } else if (score <= 18) {
    return '당신의 스트레스 정도는 중간 수준입니다. 스트레스를 해소하기 위한 적극적인 노력이 필요하며, 스스로가 필요하다고 생각되면 전문가에게 도움을 요청해 보세요.';
  } else {
    return '심한 스트레스를 받는 것으로, 일상생활에 있어 어려움을 겪고 있을 것으로 판단됩니다. 전문가의 도움을 받기를 권유합니다. 본 센터로 연락주시면 전문상담원의 도움을 받을 수 있습니다.';
  }
};

const StressResultPage: React.FC = () => {
  const location = useLocation();
  const { totalScore = 0 } = (location.state as LocationState) || {};
  const resultMessage = getResultMessage(totalScore);
  const navigate = useNavigate();
  const { name } = useMemberStore();
  const displayName = name || '사용자';

  const handleRetry = () => {
    navigate('/selftest/stress');
  };
  const handleGoToList = () => {
    navigate('/selftest');
  };

  return (
    <div className="min-h-screen">
      <TestBar
        title="스트레스"
        subtitle="요즘 스트레스에 시달리고 계신가요?"
        showBackButton={false}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2 max-w-md">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl font-bold">검사 점수</h2>
              <div className="divider"></div>
              <p className="text-lg">{displayName}님의 스트레스척도 점수는 </p>
              <p className="text-lg mb-4">
                <span className="font-bold text-primary text-4xl">{totalScore}점</span> 입니다.
              </p>
              <img src={talk} alt="어린왕자" className="w-56 mb-4" />
              <p className="text-lg"></p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">스트레스 자가검진 결과입니다.</h2>
              <div className="divider"></div>
              <div>{resultMessage}</div>
              <div className="flex justify-center space-x-10 pt-5 font-bold">
                <Button
                  label="다시하기"
                  onClick={handleRetry}
                  size="lg"
                  shape="rounded"
                  textSize="md"
                  color="orange"
                />
                <Button
                  label="다른 검진 해보기 "
                  onClick={handleGoToList}
                  size="lg"
                  shape="rounded"
                  textSize="md"
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

export default StressResultPage;
