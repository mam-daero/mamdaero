import React from 'react';
import SignUpClientInput from '@/components/input/SignUpClientInput';

const SignupClient: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  w-full pt-28">
      <h1 className="text-3xl font-bold mb-3">일반 회원 가입</h1>
      <SignUpClientInput />
    </div>
  );
};

export default SignupClient;
