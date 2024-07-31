import LoginCard from '@/components/card/LoginCard';
import MainTitleCard from '@/components/card/MainTitleCard';
const MainPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-7">
        <MainTitleCard />
        <LoginCard />
      </div>
    </div>
  );
};

export default MainPage;
