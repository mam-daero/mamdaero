import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import FindPasswordVerifyForm from '@/pages/findpassword/FindPasswordVerifyForm';
import FindPasswordResetForm from '@/pages/findpassword/FindPasswordResetForm';

interface AuthFormData {
  name: string;
  email: string;
  auth_token: string;
}

const resetPassword = async () => {
  const response = await axiosInstance({
    method: 'patch',
    url: 'p/member/password-reset',
  });
  return response.data;
};

const FindPasswordPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const handleVerificationSuccess = (email: string) => {
    setIsVerified(true);
    setVerifiedEmail(email);
  };

  return (
    <div>
      <div className="text-center font-bold text-3xl mt-24 text-gray-600">비밀번호 찾기</div>
      {!isVerified ? (
        <FindPasswordVerifyForm onVerificationSuccess={handleVerificationSuccess} />
      ) : (
        <FindPasswordResetForm email={verifiedEmail} />
      )}
    </div>
  );
};

export default FindPasswordPage;
