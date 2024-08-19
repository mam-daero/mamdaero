import React from 'react';
import Button from '@/components/button/Button';
import lean1 from '@/assets/lean1.png';

const SignUpClientCompleteCard: React.FC = () => {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl mt-16">
      <div className="card-body text-center items-center">
        <h2 className="font-bold text-2xl">가입이 완료되었습니다!</h2>
        <div className="justify-center mt-6 flex-col space-y-8">
          <img src={lean1} alt="사진" style={{ width: '200px', height: '200px' }} />
          <Button label="홈으로 가기" color="orange" onClick={() => (window.location.href = '/')} />
        </div>
      </div>
    </div>
  );
};

export default SignUpClientCompleteCard;
