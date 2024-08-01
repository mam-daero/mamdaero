import { useNavigate } from 'react-router-dom';
const CounselorManageTime = () => {
  const navigate = useNavigate();
  const backToList = () => {
    navigate('/counselor');
  };
  return (
    <div>
      <header className="flex gap-7">
        <h1 className="text-black text-5xl font-bold">상담 시간 관리</h1>
      </header>
      <div className="divider"></div>
    </div>
  );
};
export default CounselorManageTime;
