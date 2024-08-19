import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderWithBackButtonProps {
  subtitle: string | string[];
}

const EmotionBar: React.FC<HeaderWithBackButtonProps> = ({ subtitle }) => {
  const subtitleLines = Array.isArray(subtitle) ? subtitle : [subtitle];
  const navigate = useNavigate();
  return (
    <div className="flex flex-col my-6 mx-16 justify-end ">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-right text-gray-500 flex-grow">
          {subtitleLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className="text-4xl font-bold ms-8 flex-shrink-0">
          <span className="text-orange-500">맘대로</span> 감정일기
        </div>
      </div>
      {/* <div className="border-t-2 border-gray-300 mt-2"></div> */}
      <div className=" mt-2"></div>
    </div>
  );
};

export default EmotionBar;
