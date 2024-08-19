import MainTitleCard from '@/components/card/mainpage/MainTitleCard';
import lean1 from '@/assets/lean1.png';

const MainPageAdmin: React.FC = () => {
  return (
    <div className="flex flex-col py-28">
      <div className="flex items-center justify-center gap-32">
        <div className="space-y-12">
          <MainTitleCard />
          <img src={lean1} alt="" className="w-44" />
          <div className="text-left font-bold text-lg">어서오세요. 관리자님</div>
        </div>
      </div>
    </div>
  );
};

export default MainPageAdmin;
