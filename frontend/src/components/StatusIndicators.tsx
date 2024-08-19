import React from 'react';

export const LoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="flex space-x-1">
      {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((letter, index) => (
        <span
          key={index}
          className="text-3xl font-bold text-gray-500 animate-bounce"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </span>
      ))}
    </div>
  </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col items-center">
      <div className="flex space-x-1 mb-4">
        {message.split('').map((letter, index) => (
          <span
            key={index}
            className="text-3xl font-bold text-red-500 animate-bounce"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <p className="text-red-600">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
    </div>
  </div>
);

export const NoDataIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col items-center">
      <div className="flex space-x-1 mb-4">
        {message.split('').map((letter, index) => (
          <span
            key={index}
            className="text-3xl font-bold text-orange-500 animate-pulse"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <p className="text-orange-600">요청하신 정보를 찾을 수 없습니다.</p>
    </div>
  </div>
);
