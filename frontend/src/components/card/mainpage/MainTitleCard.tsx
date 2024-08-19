import React from 'react';

const MainTitleCard: React.FC = () => {
  return (
    <div className="flex bg-beige-100 w-70 rounded-lg text-left">
      <div>
        <h1 className="text-black text-xl font-bold">마음도 관리가 필요하니까</h1>
        <h2 className="text-orange-500 text-5xl font-bold mt-2">맘대로</h2>
        <div className="text-gray-500 text-xs font-bold ms-1.5">온라인 심리 상담 서비스</div>
        <h3 className="text-black text-4xl font-bold mt-2">일상 멘탈 케어</h3>
      </div>
    </div>
  );
};

export default MainTitleCard;
