import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';

interface AuthFormData {
  name: string;
  email: string;
  auth_token: string;
}

interface FindPasswordVerifyFormProps {
  onVerificationSuccess: (email: string) => void;
}

const resetRequest = async (data: Pick<AuthFormData, 'name' | 'email'>) => {
  const response = await axiosInstance({
    method: 'post',
    url: 'p/member/password-reset-request',
    data,
  });
  return response.data;
};

const resetVerify = async (data: Pick<AuthFormData, 'email' | 'auth_token'>) => {
  const response = await axiosInstance({
    method: 'post',
    url: 'p/member/password-reset-verify',
    data,
  });
  return response.data;
};

const FindPasswordVerifyForm: React.FC<FindPasswordVerifyFormProps> = ({
  onVerificationSuccess,
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    auth_token: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState<string | null>(null);
  const [verificationConfirmation, setVerificationConfirmation] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setVerificationConfirmation(null);
  }, [formData.auth_token]);

  const resetRequestMutation = useMutation({
    mutationFn: resetRequest,
    onSuccess: data => {
      if (data.result.isDuplicate) {
        setEmailConfirmation('이메일로 인증번호가 발송되었습니다.');
        setIsEmailSent(true);
        setShowAuthInput(true);
      } else {
        setError('인증에 실패했습니다. 입력 정보를 확인해주세요.');
      }
    },
    onError: () => {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const resetVerifyMutation = useMutation({
    mutationFn: resetVerify,
    onSuccess: data => {
      if (data.result.isDuplicate) {
        setVerificationConfirmation('인증이 완료되었습니다.');
        setIsVerified(true);
      } else {
        setVerificationConfirmation(null);
        setError('인증에 실패했습니다. 인증번호를 확인해주세요.');
      }
    },
    onError: () => {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleEmailVerification = () => {
    if (!formData.name || !formData.email) {
      setError('이름, 이메일을 모두 입력해주세요.');
      return;
    }
    resetRequestMutation.mutate({
      name: formData.name,
      email: formData.email,
    });
  };

  const handleVerificationCode = () => {
    if (!formData.auth_token) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    resetVerifyMutation.mutate({
      email: formData.email,
      auth_token: formData.auth_token,
    });
  };

  const handleSetNewPassword = () => {
    onVerificationSuccess(formData.email);
  };

  return (
    <div>
      <div className="w-full m-auto my-6 max-w-lg bg-white p-12 rounded-lg shadow-md text-gray-700">
        <div className="mb-4">
          <div className="relative mb-4">
            <div className="text-center text-gray-500 mb-10">
              <strong>이름</strong>과 <strong>이메일</strong>을 입력해주세요.
            </div>
            <div className="flex items-center">
              <label
                className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4"
                htmlFor="name"
              >
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                  color="orange"
                  size="sm"
                />
              </div>
            </div>
          </div>
          {showAuthInput && (
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
                    color="orange"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="w-full bg-red-200 text-sm text-red-700 p-2 rounded mt-4">{error}</div>
        )}
        {isVerified && (
          <div className="mt-6 mx-auto">
            <Button label="새로운 비밀번호 설정하기" onClick={handleSetNewPassword} size="full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPasswordVerifyForm;
