import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';

interface ResetFormData {
  password: string;
  confirmPassword: string;
}

interface ResetData {
  email: string;
  password: string;
}

interface FindPasswordResetFormProps {
  email: string;
}

const resetPassword = async (data: ResetData) => {
  const response = await axiosInstance({
    method: 'patch',
    url: 'p/member/password-reset',
    data,
  });
  return response.data;
};

const FindPasswordResetForm: React.FC<FindPasswordResetFormProps> = ({ email }) => {
  const [formData, setFormData] = useState<ResetFormData>({
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 비밀번호 길이 유효성
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      } else {
        setPasswordError(null);
      }
    }
  };

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/'); // 로그인 페이지로 이동
    },
    onError: () => {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleResetPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    resetPasswordMutation.mutate({ email, password: formData.password });
  };

  // 비밀번호 확인
  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const { data: passwordMatch } = useQuery({
    queryKey: ['passwordMatch', formData.password, formData.confirmPassword],
    queryFn: () => checkPasswordMatch(formData.password, formData.confirmPassword || ''),
    enabled: !!formData.confirmPassword,
  });

  return (
    <div className="w-full m-auto my-6 max-w-lg bg-white p-12 rounded-lg shadow-md text-gray-700">
      <div className="mb-4">
        <div className="relative mb-4">
          <div className="text-center text-gray-500 mb-10">
            <strong>새로운 비밀번호</strong>를 입력해주세요.
          </div>
          <div className="relative mb-4">
            <div className="flex">
              <label
                className="w-1/5 block text-gray-700 text-base mt-3 font-bold mb-2 mr-4"
                htmlFor="password"
              >
                비밀번호
              </label>
              <div className="flex-1">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md text-gray-700 text-base"
                />
                {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>}
              </div>
            </div>
          </div>
          <div className="relative mb-4">
            <div className="flex">
              <label
                className="w-1/5 text-gray-700 text-base font-bold mb-2 mr-4"
                htmlFor="confirmPassword"
              >
                <div>비밀번호</div>
                <div>확인</div>
              </label>
              <div className="flex-1">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md text-gray-700 text-base mr-2"
                />
                {formData.confirmPassword && (
                  <div
                    className={`text-xs mt-2 ${passwordMatch ? 'text-green-700' : 'text-red-500'}`}
                  >
                    {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="w-full bg-red-200 text-sm text-red-700 p-2 rounded mt-4">{error}</div>
        )}
        <div className="mt-6 flex justify-center">
          <Button
            label="비밀번호 변경하기"
            onClick={handleResetPassword}
            color="orange"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FindPasswordResetForm;
