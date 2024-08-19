import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../button/Button';
interface HeaderWithBackButtonProps {
  title: string;
  subtitle: string | string[];
  showBackButton: boolean;
}

const TestBar: React.FC<HeaderWithBackButtonProps> = ({
  title,
  subtitle,
  showBackButton = true,
}) => {
  const subtitleLines = Array.isArray(subtitle) ? subtitle : [subtitle];
  const navigate = useNavigate();
  return (
    <div className="flex flex-col my-6 mx-16 justify-end">
      <div className="flex justify-between items-center">
        {showBackButton && (
          // <button
          //   className="text-gray-600 hover:text-gray-800 mr-4"
          //   onClick={() => navigate('/selftest')}
          // >
          //   목록보기
          // </button>
          <Button
            label={
              <span className="flex items-center ms-2">
                <IoIosArrowBack />
                <div className="ms-2 mt-0.5">진단 목록 보기</div>
              </span>
            }
            onClick={() => navigate('/selftest')}
            size="목록보기"
            textSize="sm"
            shape="rounded"
            color="orange"
          />
        )}
        <div className="flex flex-col text-right text-gray-500 flex-grow">
          {subtitleLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className="text-4xl font-bold ms-8 flex-shrink-0">
          <span className="text-orange-500">{title}</span> 자가심리검진
        </div>
      </div>
      {/* <div className="border-t-2 border-gray-300 mt-2"></div> */}
    </div>
  );
};

export default TestBar;
