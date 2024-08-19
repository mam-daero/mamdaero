import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';
import useMemberStore from '@/stores/memberStore';
import { AxiosError } from 'axios';

import Button from '@/components/button/Button.tsx';
import GoogleLoginButton from '@/components/button/GoogleLoginButton';
import KakaoLoginButton from '@/components/button/KakaoLoginButton';

interface LoginInfo {
  email: string;
  password: string;
}

const loginUserInfo = async (loginUserInfo: LoginInfo) => {
  const response = await axiosInstance({
    method: 'post',
    url: 'p/member/client-login',
    data: loginUserInfo,
  });
  return response;
};

const LoginClient: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const login = useAuthStore(state => state.login);
  const fetchMember = useMemberStore(state => state.fetchMember);

  const loginMutation = useMutation({
    mutationFn: loginUserInfo,
    onSuccess: async data => {
      if (typeof data.data.result === 'string') {
        setErrorMessage(data.data.result);
      } else {
        const { accessToken, role } = data.data.result;
        login(accessToken, role, email);
        await fetchMember();
        navigate('/');
      }
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        // 서버에서 응답을 받은 경우
        if (error.response.status === 401) {
          setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else {
          setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } else if (error.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우
        setErrorMessage('서버와의 통신 중 오류가 발생했습니다. 네트워크 연결을 확인해 주세요.');
      } else {
        // 요청 준비 중 오류가 발생한 경우
        setErrorMessage('로그인 요청을 처리하는 중 오류가 발생했습니다.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(''); // 폼 제출 시 이전 에러 메시지 초기화
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full bg-gray-50">
      <label className="w-full max-w-xs">
        <div className="label">
          <span className="label-text">아이디</span>
        </div>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일 형식으로 입력해 주세요."
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label className="w-full max-w-xs">
        <div className="label">
          <span className="label-text">비밀번호</span>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해 주세요."
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <div className="h-6 m-1">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>
      <Button label="로그인" type="submit" size="full" color="orange" textSize="xl" />
      <div className="flex font-bold justify-center text-sm mt-4 space-x-2">
        <div className="text-gray-600">
          아직 <u>맘대로</u> 회원이 아니신가요?
        </div>
        <Link
          to="/signup/choose"
          className="font-bold text-orange-500 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          회원가입
        </Link>
      </div>
      <div className="flex justify-center text-xs mt-3 space-x-2">
        <div>비밀번호를 잊으셨나요? </div>
        <Link
          to="/find/password"
          className="font-bold text-orange-400 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          비밀번호 찾기
        </Link>
      </div>
      {/* </div> */}
    </form>
  );
};

export default LoginClient;
