import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Button from '@/components/button/Button';

interface AuthFormData {
  counselorName: string;
  email: string;
  license: string;
  auth_token: string;
}
const verifyCounselor = async (data: Omit<AuthFormData, 'auth_token'>) => {
  const response = await axiosInstance({
    method: 'post',
    url: '/p/member/counselor-email-request',
    data: data,
  });
  return response.data.result.isDuplicate;
};

const verifyCode = async (data: Pick<AuthFormData, 'email' | 'auth_token'>) => {
  const response = await axiosInstance({
    method: 'post',
    url: '/p/member/counselor-email-auth',
    data: data,
  });
  return response.data.result.isDuplicate;
};

const SignUpCounselorInput: React.FC = () => {
  const [formData, setFormData] = useState({
    counselorName: '',
    license: '',
    email: '',
    auth_token: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState<string | null>(null);
  const [verificationConfirmation, setVerificationConfirmation] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    if (isVerified) {
      navigate('/signup/counselor/info', { state: { formData } });
    } else {
      setError('모든 인증 절차를 완료해주세요.');
    }
  };

  // 인증 번호가 변경될 때마다 인증 상태 리셋
  useEffect(() => {
    setIsVerified(false);
    setVerificationConfirmation(null);
  }, [formData.auth_token]);

  // 이메일 인증 번호 요청
  const verifyCounselorMutation = useMutation({
    mutationFn: verifyCounselor,
    onSuccess: data => {
      if (data) {
        setEmailConfirmation('이메일로 인증번호가 발송되었습니다.');
        setIsEmailSent(true);
      } else {
        setError('인증에 실패했습니다. 입력 정보를 확인해주세요.');
      }
    },
    onError: () => {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  // 이메일 인증 번호 확인
  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: data => {
      if (data) {
        setVerificationConfirmation('인증이 완료되었습니다.');
        setIsVerified(true);
        setError(null);
      } else {
        setVerificationConfirmation(null);
        setIsVerified(false);
        setError('인증번호가 일치하지 않습니다.');
      }
    },
    onError: () => {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  // 상담사 이름, 자격번호, 이메일 입력 확인
  const handleEmailVerification = () => {
    if (!formData.counselorName || !formData.license || !formData.email) {
      setError('이름, 자격번호, 이메일을 모두 입력해주세요.');
      return;
    }
    verifyCounselorMutation.mutate({
      counselorName: formData.counselorName,
      license: formData.license,
      email: formData.email,
    });
  };

  // 인증번호 입력했는지 확인
  const handleVerificationCode = () => {
    if (!formData.auth_token) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    verifyCodeMutation.mutate({
      email: formData.email,
      auth_token: formData.auth_token,
    });
  };

  return (
    <div className="w-full max-w-lg bg-white p-12 rounded-lg shadow-md text-gray-700">
      <div className="mb-4">
        <div className="relative mb-4">
          <div className="text-center text-gray-500 mb-10">
            <u>한국심리상담학회</u>에 등록된 <strong>자격번호</strong>와 <strong>이메일</strong>을
            입력해주세요.
          </div>
          <div className="flex items-center">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4"
              htmlFor="counselorName"
            >
              이름
            </label>
            <input
              type="text"
              name="counselorName"
              value={formData.counselorName}
              onChange={handleInputChange}
              className="flex-1 p-3 border rounded-md text-gray-700 text-base"
            />
          </div>
        </div>
        <div className="relative mb-4">
          <div className="flex items-center">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4"
              htmlFor="license"
            >
              자격번호
            </label>
            <input
              type="text"
              name="license"
              value={formData.license}
              onChange={handleInputChange}
              className="flex-1 p-3 border rounded-md text-gray-700 text-base"
            />
          </div>
        </div>
        <div className="relative mb-4">
          <div className="flex items-start">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4 mt-3"
              htmlFor="email"
            >
              이메일
            </label>
            <div className="flex-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md text-gray-700 text-base mr-4"
              />
              {emailConfirmation && (
                <div className="text-green-700 text-sm mt-2">{emailConfirmation}</div>
              )}
            </div>
            <div className="ms-4 mt-3">
              <Button
                label={'인증요청'}
                onClick={handleEmailVerification}
                shape="rounded"
                color="blue"
                size="sm"
              />
            </div>
          </div>
        </div>
        <div className="relative mb-8">
          <div className="flex items-start">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4 mt-3"
              htmlFor="auth_token"
            >
              인증번호
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="auth_token"
                value={formData.auth_token}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md text-gray-700 text-base mr-4"
              />
              {verificationConfirmation && (
                <div className="text-green-700 text-sm mt-2">{verificationConfirmation}</div>
              )}
            </div>
            <div className="ms-4 mt-3">
              <Button
                label={'인증확인'}
                onClick={handleVerificationCode}
                shape="rounded"
                color="blue"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleNext} size="full" color="blue" label={'다음'} disabled={!isVerified} />
      {error && (
        <div className="w-full bg-red-200 text-sm text-red-700 p-2 rounded mt-4">{error}</div>
      )}
    </div>
  );
};

export default SignUpCounselorInput;
