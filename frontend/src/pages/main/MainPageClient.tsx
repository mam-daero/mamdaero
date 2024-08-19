import React from 'react';
import MainTitleCard from '@/components/card/mainpage/MainTitleCard';
import lean1 from '@/assets/lean1.png';
import ClientConfirmCard from '@/components/card/mainpage/ClientConfirmCard';
import Chatbot from '@/components/Chatbot';
import { SlArrowDown } from 'react-icons/sl';
const MainPageClient: React.FC = () => {
  return (
    <div className="carousel carousel-vertical rounded-box h-[90vh] w-full">
      <div className="carousel-item justify-end h-full flex flex-col">
        <div className="flex items-center justify-center gap-32">
          <div className="space-y-12">
            <MainTitleCard />
            <img src={lean1} alt="어린왕자" className="w-44" />
          </div>
          <div>
            <ClientConfirmCard />
          </div>
        </div>
        <div className="mx-auto mt-32 animate-bounce">
          <a href="#chatbot">
            <SlArrowDown size={30} />
          </a>
        </div>
      </div>
      <div className="carousel-item justify-center h-full" id="chatbot">
        <Chatbot />
      </div>
    </div>
  );
};

export default MainPageClient;
