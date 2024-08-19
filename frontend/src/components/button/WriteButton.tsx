import React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

interface ButtonProps {
  onClick: () => void;
  color: 'blue' | 'orange' | 'gray';
}

const WriteButton = ({ onClick, color }: ButtonProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const colorClasses = {
    blue: 'bg-blue-200 hover:bg-blue-300',
    orange: 'bg-orange-200 hover:bg-orange-300',
    gray: 'bg-gray-200 hover:bg-gray-300',
  };

  const checkAuth = () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      navigate('/');
      return false;
    }
    return true;
  };

  const handleClick = () => {
    if (checkAuth()) {
      onClick();
    }
  };

  return (
    <div>
      <button onClick={handleClick} className={`h-9 rounded-md ${colorClasses[color]}`}>
        <div className="flex font-bold text-md items-center my-1 mx-3 gap-2">
          <FiEdit3 size={20} />
          글쓰기
        </div>
      </button>
    </div>
  );
};

export default WriteButton;
