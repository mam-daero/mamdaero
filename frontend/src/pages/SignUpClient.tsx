// /mnt/data/src_new/pages/SignupClient.tsx

import React from 'react';
import SignUpClientInput from '@/components/input/SignUpClientInput';

const SignupClient: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 w-full">
      <h1 className="text-3xl font-bold mb-8">일반 회원 가입</h1>
      <SignUpClientInput />
    </div>
  );
};

export default SignupClient;
