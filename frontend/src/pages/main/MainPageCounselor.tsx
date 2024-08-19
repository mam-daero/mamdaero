import React from 'react';
import MainTitleCard from '@/components/card/mainpage/MainTitleCard';
import lean1 from '@/assets/lean1.png';
import CounselorConfirmCard from '@/components/card/mainpage/CounselorConfirmCard';

const MainPageClient: React.FC = () => {
  return (
    <div className="flex flex-col py-36">
      <div className="flex items-center justify-center gap-32">
        <div className="space-y-12">
          <MainTitleCard />
          <img src={lean1} alt="" className="w-44" />
        </div>
        <div>
          <CounselorConfirmCard />
        </div>
      </div>
    </div>
  );
};

export default MainPageClient;
