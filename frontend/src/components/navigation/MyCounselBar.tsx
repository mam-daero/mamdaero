import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import { IoIosArrowBack } from 'react-icons/io';

interface MyCounselProps {
  title1: string;
  title2: string;
  subtitle: string | string[];
  user: 'counselor' | 'client';
  buttonLabel?: ReactNode;
  buttonPath?: string;
  size?: '목록보기' | 'md';
}

const MyCounselBar: React.FC<MyCounselProps> = ({
  title1,
  title2,
  subtitle,
  user,
  buttonLabel,
  buttonPath,
  size = '목록보기', // 기본값
}) => {
  const subtitleLines = Array.isArray(subtitle) ? subtitle : [subtitle];
  const navigate = useNavigate();

  const titleColor = user === 'counselor' ? 'text-blue-500' : 'text-orange-500';
  const buttonColor = user === 'counselor' ? 'blue' : 'orange';

  return (
    <div className="flex flex-col my-6 mx-16 justify-end">
      <div className="flex justify-between items-center">
        {buttonLabel && buttonPath && (
          <Button
            label={
              <span className="flex items-center ms-2">
                <IoIosArrowBack />
                <div className="ms-2 mt-0.5">{buttonLabel}</div>
              </span>
            }
            onClick={() => navigate(buttonPath)}
            size={size}
            textSize="sm"
            shape="rounded"
            color={buttonColor}
          />
        )}
        <div className="flex flex-col text-right text-gray-500 flex-grow">
          {subtitleLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className="text-4xl font-bold ms-8 flex-shrink-0">
          <span className={titleColor}>{title1}</span> {title2}
        </div>
      </div>
      <div className="mt-2"></div>
    </div>
  );
};

export default MyCounselBar;
