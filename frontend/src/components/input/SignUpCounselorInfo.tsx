import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

interface PreviousFormData {
  counselorName: string;
  email: string;
  license: string;
  auth_token: string;
}
interface FormData extends Omit<PreviousFormData, 'counselorName'> {
  name: string;
  password: string;
  confirmPassword?: string;
  tel: string;
  gender: 'M' | 'F' | '';
  address?: string;
  intro: string;
  introDetail: string;
  birth: string;
  image?: File;
}

const SignUpCounselorInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousFormData = (location.state?.formData as PreviousFormData) || {
    counselorName: '',
    email: '',
    license: '',
  };
  const [formData, setFormData] = useState<FormData>({
    ...previousFormData,
    name: previousFormData.counselorName,
    password: '',
    confirmPassword: '',
    tel: '',
    gender: '',
    address: '',
    intro: '',
    introDetail: '',
    birth: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [birthError, setBirthError] = useState<string | null>(null);
  const [telError, setTelError] = useState<string | null>(null);

  const calculateLevel = (license: string) => {
    const firstChar = license.charAt(0);
    const level = parseInt(firstChar, 10);
    return isNaN(level) ? null : level;
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

  // 이름, 생년월일, 전화번호
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      } else {
        setPasswordError(null);
      }
    } else if (name === 'birth') {
      if (value && !validateBirth(value)) {
        setBirthError('YYYY-MM-DD 형식으로 입력해주세요.');
      } else {
        setBirthError(null);
      }
    } else if (name === 'tel') {
      if (value && !validateTel(value)) {
        setTelError('010-1234-5678 형식으로 입력해주세요.');
      } else {
        setTelError(null);
      }
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // 성별 선택
  const handleGenderChange = (gender: 'M' | 'F') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  // formDataToSend.append(
  //   'data',
  //   new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
  // );
  // 회원 가입
  const signUp = async (data: Omit<FormData, 'confirmPassword'>) => {
    const level = calculateLevel(data.license);
    const dataWithLevel = { ...data, level };
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(dataWithLevel)], { type: 'application/json' })
    );

    if (data.image && data.image instanceof File) {
      formData.append('file', data.image);
    }

    const response = await axiosInstance({
      method: 'post',
      url: 'p/member/counselor-join',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('/signup/counselor/complete');
    },
    onError: error => {
      setError(`회원가입 중 오류가 발생했습니다. ${error}`);
    },
  });

  // 회원가입 폼 제출
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

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
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
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
    <div className="w-full max-w-3xl bg-white p-16 rounded-lg shadow-md text-gray-700">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex">
          <div className="flex-grow space-y-4 w-1/2 mr-5">
            <div className="space-y-4">
              <div className="flex space-x-5">
                <p className="w-1/3 font-bold">이름</p>
                <p>{formData.name}</p>
              </div>
              <div className="flex space-x-5">
                <p className="w-1/3 font-bold">자격번호</p>
                <p>{formData.license}</p>
              </div>
              <div className="flex space-x-5">
                <p className="w-1/3 font-bold">이메일</p>
                <p>{formData.email}</p>
              </div>
            </div>
            <div className="flex space-x-8 items-center">
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

            <div className="flex space-x-8 items-center">
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
            <div className="flex space-x-3 items-center">
              <label className="w-1/3 block font-bold">성별</label>
              <div className="flex justify-between w-3/4">
                <button
                  type="button"
                  className={`flex-1 p-3 mx-1 rounded-md font-bold ${
                    formData.gender === 'M' ? 'bg-blue-200' : 'bg-gray-200'
                  }`}
                  onClick={() => handleGenderChange('M')}
                >
                  남
                </button>
                <button
                  type="button"
                  className={`flex-1 p-3 mx-1 rounded-md font-bold ${
                    formData.gender === 'F' ? 'bg-blue-200' : 'bg-gray-200'
                  }`}
                  onClick={() => handleGenderChange('F')}
                >
                  여
                </button>
              </div>
            </div>
            <div className="flex space-x-16">
              <label className="block font-bold mt-3">생년월일</label>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  name="birth"
                  value={formData.birth}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="YYYY-MM-DD"
                />
                {birthError && <div className="text-red-500 text-sm">{birthError}</div>}
              </div>
            </div>
            <div className="flex space-x-16">
              <label className="block font-bold mt-3">전화번호</label>
              <div className="flex-1 space-y-2">
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="010-1234-5678"
                />
                {telError && <div className="text-red-500 text-sm">{telError}</div>}
              </div>
            </div>
          </div>
          <div className="w-2/5 items-center justify-center">
            <label className="block font-bold mb-2">
              <span className="text-gray-400">(선택)</span> 이미지
            </label>
            <div className="flex items-center justify-center">
              <div className="w-full bg-gray-200 flex items-center justify-center rounded h-72">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Selected"
                    className="w-full h-52 object-cover rounded"
                  />
                ) : (
                  <span>이미지</span>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered file-input-xs mt-4 h-10 w-full"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center space-x-14">
            <label className="flex flex-col font-bold">
              <span>센터 주소</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded"
            />
          </div>
          <div className="flex items-center space-x-14">
            <label className="flex flex-col font-bold">
              <span>한줄 소개</span>
            </label>
            <input
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
              maxLength={100}
              className="flex-1 p-2 border rounded"
            />
          </div>

          <div className="flex-1 items-center space-y-4">
            <label className="flex flex-col font-bold">
              <span>상세 소개</span>
            </label>
            <textarea
              name="introDetail"
              value={formData.introDetail}
              onChange={handleInputChange}
              maxLength={5000}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-200 text-xs text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        <div className="flex justify-end font-bold">
          <button type="submit" className="p-2 bg-blue-200 rounded w-full">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpCounselorInfo;
