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
  if (score <= 6) {
    return '현재 마음이 안정적이므로 감정의 기복이나 충동성을 스스로 조절할 수 있는 상태입니다.';
  } else {
    return '현재 충동성이나 평소보다 흥분되는 기분, 에너지로 인해 일상생활에 큰 영향을 주고 있는 만큼 정신건강전문가의 도움이 반드시 필요한 상태입니다.';
  }
};

const BipolarResultPage: React.FC = () => {
  const location = useLocation();
  const { totalScore = 0 } = (location.state as LocationState) || {};
  const resultMessage = getResultMessage(totalScore);
  const navigate = useNavigate();
  const { name } = useMemberStore();
  const displayName = name || '사용자';

  const handleRetry = () => {
    navigate('/selftest/bipolar');
  };
  const handleGoToList = () => {
    navigate('/selftest');
  };

  return (
    <div className="min-h-screen">
      <TestBar
        title="조울증"
        subtitle="기분이 지나치게 들뜨거나 가라앉는 경험을 자주 하시나요?"
        showBackButton={false}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2 max-w-md">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl font-bold">검사 점수</h2>
              <div className="divider"></div>
              <p className="text-lg">{displayName}님의 조울증척도 점수는 </p>
              <p className="text-lg mb-4">
                <span className="font-bold text-primary text-4xl">{totalScore}점</span> 입니다.
              </p>
              <img src={talk} alt="어린왕자" className="w-56 mb-4" />
              <p className="text-lg"></p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">조울증 자가검진 결과입니다.</h2>
              <div className="divider"></div>
              <div>{resultMessage}</div>
              <div className="flex justify-center space-x-10 pt-5 font-bold">
                <Button
                  label="다시하기"
                  onClick={handleRetry}
                  size="lg"
                  textSize="md"
                  color="orange"
                  shape="rounded"
                />
                <Button
                  label="다른 검진 해보기 "
                  onClick={handleGoToList}
                  size="lg"
                  textSize="md"
                  color="orange"
                  shape="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BipolarResultPage;
