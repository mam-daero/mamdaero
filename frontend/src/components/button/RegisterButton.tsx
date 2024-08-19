import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

interface ButtonProps {
  onClick: () => void;
  color: 'blue' | 'orange' | 'gray';
  disabled: boolean;
}

const RegisterButton = ({ onClick, color, disabled }: ButtonProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const colorClasses = {
    blue: 'bg-blue-200 hover:bg-blue-300',
    orange: 'bg-orange-200 hover:bg-orange-300',
    gray: 'bg-gray-200 hover:bg-gray-300',
  };
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      navigate('/');
    } else {
      onClick();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`rounded-md ${colorClasses[color]} ${disabledClass}`}
        disabled={disabled}
      >
        <div className="flex font-bold text-md items-center my-1 mx-3 gap-2">등록하기</div>
      </button>
    </div>
  );
};

export default RegisterButton;
