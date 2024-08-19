import React, { useState } from 'react';
import LoginClient from '@/components/input/LoginClient.tsx';
import LoginCounselor from '@/components/input/LoginCounselor.tsx';
import Button from '@/components/button/Button.tsx';

const LoginCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'counselor'>('client');

  const clientLogin = () => {
    setActiveTab('client');
  };
  const counselorLogin = () => {
    setActiveTab('counselor');
  };
  return (
    <div className="px-8 py-6 max-w-sm w-96 h-max bg-gray-50 rounded-lg shadow-lg">
      <div className="flex w-full justify-center space-x-2 mb-3">
        <Button
          label="일반 회원 로그인"
          onClick={clientLogin}
          size="lg"
          color={activeTab === 'client' ? 'orange' : 'gray'}
        ></Button>
        <Button
          label="상담사 로그인"
          onClick={counselorLogin}
          size="lg"
          color={activeTab === 'counselor' ? 'blue' : 'gray'}
        ></Button>
      </div>
      <div>
        {activeTab === 'client' && <LoginClient />}
        {activeTab === 'counselor' && <LoginCounselor />}
      </div>
    </div>
  );
};

export default LoginCard;
