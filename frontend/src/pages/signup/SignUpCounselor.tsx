import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignUpCounselorInput from '@/components/input/SignUpCounselorInput';
import SignUpCounselorInfo from '@/components/input/SignUpCounselorInfo';
import SignUpCounselorCompleteCard from '@/components/card/signup/SignUpCounselorCompleteCard';
import ProgressBar from '@/components/navigation/CounselorProgressBar';
import SignUpBar from '@/components/navigation/SignUpBar';

const SignUpCounselor: React.FC = () => {
  const location = useLocation();
  let currentStep: 'input' | 'info' | 'complete' = 'input';

  if (location.pathname.includes('info')) {
    currentStep = 'info';
  } else if (location.pathname.includes('complete')) {
    currentStep = 'complete';
  }

  return (
    <div>
      <SignUpBar
        user="counselor"
        title="상담사"
        subtitle="맘대로와 함께 마음의 안정을 느껴보세요!"
      />
      <div className="container space-y-10">
        <div className="flex flex-col w-full items-center">
          <ProgressBar currentStep={currentStep} />
          <Routes>
            <Route path="/" element={<SignUpCounselorInput />} />
            <Route path="info" element={<SignUpCounselorInfo />} />
            <Route path="complete" element={<SignUpCounselorCompleteCard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SignUpCounselor;
