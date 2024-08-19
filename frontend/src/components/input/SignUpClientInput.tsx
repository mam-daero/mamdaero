import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '@/components/button/CertificationButton';

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  nickname: string;
  birth: string;
  tel: string;
  gender: 'M' | 'F' | '';
}

const SignUpClientInput: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    birth: '',
    tel: '',
    gender: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState<string | null>(null);
  const [nicknameConfirmation, setNicknameConfirmation] = useState<string | null>(null);

  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [birthError, setBirthError] = useState<string | null>(null);
  const [telError, setTelError] = useState<string | null>(null);

  // 이메일 중복 확인
  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    const response = await axiosInstance({
      method: 'post',
      url: 'p/member/email-check',
      data: { email },
    });
    return response.data.result.isDuplicate;
  };

  const emailMutation = useMutation({
    mutationFn: checkEmailDuplicate,
    onSuccess: isDuplicate => {
      setIsEmailChecked(true);
      if (!isDuplicate) {
        setEmailConfirmation('사용 가능한 이메일입니다.');
      } else {
        setEmailConfirmation('이미 사용 중인 이메일입니다.');
      }
    },
    onError: error => {
      setEmailConfirmation(`이메일 중복 확인 중 오류가 발생했습니다. ${error}`);
    },
  });

  const handleEmailCheck = (event: React.MouseEvent) => {
    event.preventDefault();
    emailMutation.mutate(formData.email);
  };

  // 닉네임 중복 확인
  const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
    const response = await axiosInstance({
      method: 'post',
      url: 'p/member/nickname-check',
      data: { nickname },
    });
    return response.data.result.isDuplicate;
  };

  const nicknameMutation = useMutation({
    mutationFn: checkNicknameDuplicate,
    onSuccess: isDuplicate => {
      setIsNicknameChecked(true);
      if (!isDuplicate) {
        setNicknameConfirmation('사용 가능한 닉네임입니다.');
      } else {
        setNicknameConfirmation('이미 사용 중인 닉네임입니다.');
      }
    },
    onError: error => {
      setNicknameConfirmation(`닉네임 중복 확인 중 오류가 발생했습니다. ${error}`);
    },
  });

  const handleNicknameCheck = (event: React.MouseEvent) => {
    event.preventDefault();
    nicknameMutation.mutate(formData.nickname);
  };

  // 비밀번호 길이 유효성
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // 생년월일 유효성
  const validateBirth = (birth: string): boolean => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(birth)) return false;

    const [year, month, day] = birth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  // 전화번호 유효성
  const validateTel = (tel: string): boolean => {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(tel);
  };

  // 비밀번호, 생년월일, 전화번호
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      } else {
        setPasswordError(null);
      }
    } else if (name === 'birth') {
      if (value && !validateBirth(value)) {
        setBirthError('올바른 날짜 형식이 아닙니다 (YYYY-MM-DD).');
      } else {
        setBirthError(null);
      }
    } else if (name === 'tel') {
      if (value && !validateTel(value)) {
        setTelError('올바른 전화번호 형식이 아닙니다 (010-1234-5678).');
      } else {
        setTelError(null);
      }
    }
  };

  // 성별 선택
  const handleGenderChange = (gender: 'M' | 'F') => {
    setFormData({ ...formData, gender });
  };

  // 회원 가입
  const signUp = async (data: FormData) => {
    const response = await axiosInstance({
      method: 'post',
      url: 'p/member/client-join',
      data: data,
    });
    return response.data;
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('complete');
    },
    onError: error => {
      setError(`회원가입 중 오류가 발생했습니다. ${error}`);
    },
  });

  // 회원가입 폼 제출
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isEmailChecked) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (emailMutation.data) {
      alert('중복된 이메일입니다. 다른 이메일을 사용해주세요.');
      return;
    }

    if (nicknameMutation.data) {
      alert('중복된 닉네임입니다. 다른 닉네임을 사용해주세요.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (isFormFilled) {
      const { confirmPassword, ...signUpData } = formData;
      signUpMutation.mutate(signUpData);
    } else {
      setError('모든 필드를 올바르게 입력해주세요.');
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    const isFilled =
      formData.email !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
      formData.name !== '' &&
      formData.nickname !== '' &&
      formData.tel !== '' &&
      formData.gender !== '' &&
      formData.password === formData.confirmPassword &&
      validatePassword(formData.password) &&
      (formData.birth === '' || validateBirth(formData.birth)) &&
      validateTel(formData.tel);

    setIsFormFilled(isFilled);
  }, [formData]);

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
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-lg bg-gray-50 rounded-lg overflow-hidden m-4 p-12 shadow-lg"
    >
      <div className="mb-6">
        <div className="relative mb-4">
          <div className="flex items-start">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mr-4 mt-3"
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
                className="p-3 border rounded-md text-gray-700 text-base w-full"
              />
              {emailConfirmation && (
                <div className="text-green-700 text-xs mt-2">{emailConfirmation}</div>
              )}
            </div>
            <div className="mt-3 ms-4">
              <Button label={'중복확인'} onClick={handleEmailCheck} user="client" />
            </div>
          </div>
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
      <div className="mb-6">
        <div className="relative mb-4">
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
              className="w-1/5 block text-gray-700 text-base font-bold mr-4 mt-3"
              htmlFor="nickname"
            >
              닉네임
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="p-3 border rounded-md text-gray-700 text-base w-full"
              />
              {nicknameConfirmation && (
                <div className="text-green-700 text-xs mt-2">{nicknameConfirmation}</div>
              )}
            </div>
            <div className="mt-3 ms-4">
              <Button label={'중복확인'} onClick={handleNicknameCheck} user="client" />
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <div className="flex">
            <label
              className="w-1/5 text-gray-700 text-base font-bold mb-2 mr-4 flex flex-col mt-3"
              htmlFor="birth"
            >
              생년월일
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="birth"
                value={formData.birth}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md text-gray-700 text-base"
                placeholder="YYYY-MM-DD"
              />
              {birthError && <div className="text-red-500 text-xs mt-1">{birthError}</div>}
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <div className="flex">
            <label
              className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4 mt-3"
              htmlFor="tel"
            >
              전화번호
            </label>
            <div className="flex-1">
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md text-gray-700 text-base"
                placeholder="010-1234-5678"
              />
              {telError && <div className="text-red-500 text-xs mt-1">{telError}</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center">
          <label className="w-1/5 block text-gray-700 text-base font-bold mb-2 mr-4">성별</label>
          <div className="flex justify-between flex-1">
            <button
              type="button"
              className={`flex-1 p-3 mx-1 rounded-md font-bold ${
                formData.gender === 'M' ? 'bg-orange-200' : 'bg-gray-200'
              }`}
              onClick={() => handleGenderChange('M')}
            >
              남
            </button>
            <button
              type="button"
              className={`flex-1 p-3 mx-1 rounded-md font-bold ${
                formData.gender === 'F' ? 'bg-orange-200' : 'bg-gray-200'
              }`}
              onClick={() => handleGenderChange('F')}
            >
              여
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div className="w-full bg-red-200 text-xs text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <button
        type="submit"
        className={`w-full p-3 rounded-md text-gray-800 font-semibold ${
          isFormFilled ? 'bg-orange-200' : 'bg-gray-200 cursor-not-allowed'
        }`}
        disabled={!isFormFilled}
      >
        회원가입
      </button>
    </form>
  );
};

export default SignUpClientInput;
