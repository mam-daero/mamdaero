import React from 'react';
import { Link } from 'react-router-dom';
import SignUpCard from '@/components/card/signup/SignUpCard';
import SignUpBar from '@/components/navigation/SignUpBar';

const SignUpChoose: React.FC = () => {
  return (
    <div>
      <SignUpBar user="common" title="" subtitle="맘대로와 함께 마음의 안정을 느껴보세요!" />
      <div className="container">
        {/* 회원가입 박스들 */}
        <div className="w-full flex justify-center mt-20">
          <div className="flex justify-center space-x-8 max-w-6xl w-full px-4">
            <SignUpCard
              color="orange"
              icon="🙎‍♂️"
              title="일반 회원 등록"
              description="일반 회원 등록"
              buttonText="회원가입"
              link="/signup/client"
            />
            <SignUpCard
              color="blue"
              icon="👨‍💼"
              title="상담사 회원 등록"
              description="상담사 회원 등록"
              buttonText="상담사 회원가입"
              link="/signup/counselor"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpChoose;
