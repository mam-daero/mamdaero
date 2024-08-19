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
  if (score <= 51) {
    return '당신의 상태불안 수준은 정상적입니다.';
  } else if (score <= 56) {
    return '경미한 불안증세가 있는 것으로 보입니다. 당장 치료가 필요하지는 않지만 항상 주의하시고, 수시로 검사를 해서 자신의 상태를 체크해 보는 것이 좋습니다.';
  } else if (score <= 61) {
    return '상태불안 수준이 다소 높은 것으로 보입니다. 휴식, 취미활동 등 심리적 이완을 통해 스트레스를 조절하고 관리하는 것이 좋으며, 스스로 제어할 수 없는 불안의 경우에는 정신건강의학과 전문의나 전문가의 도움이 필요합니다.';
  } else {
    return '상태불안 수준이 매우 높습니다. 만약 이러한 불안상태가 수 개월 지속되어 일상생활에 어려움을 경험하고 있다면, 가능한 빨리 정신건강의학과 전문의나 전문가의 도움을 받는 것이 좋습니다.';
  }
};

const UnrestResultPage: React.FC = () => {
  const location = useLocation();
  const { totalScore = 0 } = (location.state as LocationState) || {};
  const resultMessage = getResultMessage(totalScore);
  const navigate = useNavigate();
  const { name } = useMemberStore();
  const displayName = name || '사용자';

  const handleRetry = () => {
    navigate('/selftest/unrest');
  };
  const handleGoToList = () => {
    navigate('/selftest');
  };

  return (
    <div className="min-h-screen">
      <TestBar
        title="불안"
        subtitle="위험요소가 다 사라졌지만 불안하신가요?"
        showBackButton={false}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2 max-w-md">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl font-bold">검사 점수</h2>
              <div className="divider"></div>
              <p className="text-lg">{displayName}님의 불안척도 점수는 </p>
              <p className="text-lg mb-4">
                <span className="font-bold text-primary text-4xl">{totalScore}점</span> 입니다.
              </p>
              <img src={talk} alt="어린왕자" className="w-56 mb-4" />
              <p className="text-lg"></p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl w-full md:w-1/2">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">불안 자가검진 결과입니다.</h2>
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

export default UnrestResultPage;
