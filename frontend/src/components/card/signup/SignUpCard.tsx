import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/button/Button.tsx';

interface SignUpCardProps {
  color: 'orange' | 'blue';
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

const SignUpCard: React.FC<SignUpCardProps> = ({
  color,
  icon,
  title,
  description,
  buttonText,
  link,
}) => {
  return (
    <div className="p-8 w-full max-w-sm bg-gray-50 rounded-lg shadow-lg flex flex-col items-center">
      <div className="mb-4">
        <div className="text-5xl">{icon}</div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      <Link to={link}>
        <Button label={buttonText} onClick={() => {}} size="회원가입" color={color} />
      </Link>
    </div>
  );
};

export default SignUpCard;
