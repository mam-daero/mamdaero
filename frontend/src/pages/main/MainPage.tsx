import LoginCard from '@/components/card/mainpage/LoginCard';
import MainTitleCard from '@/components/card/mainpage/MainTitleCard';
import lean2 from '@/assets/lean2.png';
import Chatbot from '@/components/Chatbot';
import { SlArrowDown } from 'react-icons/sl';
const MainPage = () => {
  return (
    <div className="carousel carousel-vertical rounded-box h-[90vh] w-full">
      <div className="carousel-item justify-end h-full flex flex-col">
        <div className="flex items-center justify-center gap-32">
          <div className="space-y-12">
            <MainTitleCard />
            <img src={lean2} alt="" className="w-44" />
          </div>
          <div>
            <LoginCard />
          </div>
        </div>
        <div className="mx-auto mt-28 animate-bounce">
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

export default MainPage;
