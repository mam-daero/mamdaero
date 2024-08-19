import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignUpClientInput from '@/components/input/SignUpClientInput';
import SignUpClientCompleteCard from '@/components/card/signup/SignUpClientCompleteCard';
import ProgressBar from '@/components/navigation/ClientProgressBar';
import SignUpBar from '@/components/navigation/SignUpBar';

const SignUpClient: React.FC = () => {
  const location = useLocation();
  let currentStep: 'input' | 'complete' = 'input';

  if (location.pathname.includes('complete')) {
    currentStep = 'complete';
  }

  return (
    <div>
      <div className="container space-y-10">
        <SignUpBar
          user="client"
          title="일반 회원"
          subtitle="맘대로와 함께 마음의 안정을 느껴보세요!"
        />
        <div className="flex flex-col w-full items-center">
          <ProgressBar currentStep={currentStep} />
          <Routes>
            <Route path="/" element={<SignUpClientInput />} />
            <Route path="complete" element={<SignUpClientCompleteCard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SignUpClient;
