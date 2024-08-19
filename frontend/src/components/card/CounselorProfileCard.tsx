import { Link } from 'react-router-dom';
import DefaultProfile from '@/assets/DefaultProfile.jpg';
import { FaStar } from 'react-icons/fa6';

interface CounselorCardProps {
  counselorId: string;
  counselorName: string;
  counselorIntro: string;
  counselorImage?: string; // 이미지가 선택적이라면 optional로 설정
  reviewRate: number;
  reviewCount: number;
}
const CounselorProfileCard: React.FC<CounselorCardProps> = ({
  counselorId,
  counselorName,
  counselorIntro,
  counselorImage, // 기본 이미지를 제공
  reviewRate,
  reviewCount,
}) => {
  console.log(counselorImage);
  return (
    <div className="border-b-2 border-b-gray-300">
      <div className="w-full p-6 grid grid-cols-6">
        <div className="col-span-4 flex flex-col">
          <div className="flex items-center">
            <div className="text-2xl font-bold">{counselorName}</div>
            <div className="flex ms-1">
              <FaStar size={20} color="orange" className="ms-2" />
              <div className="text-md font-bold mx-1">{reviewRate !== null ? reviewRate : 0}</div>
              <div>({reviewCount})</div>
            </div>
          </div>
          <div className="text-md mt-3">{counselorIntro}</div>
          <div className="mt-auto transition-transform transform hover:-translate-y-1">
            <Link to={`/counselor/${counselorId}`} className="text-orange-400 font-bold">
              상담사 프로필 보기
            </Link>
          </div>
        </div>

        <div className="col-span-2 flex justify-end items-start">
          <img
            src={counselorImage || DefaultProfile}
            className="w-32 h-40 object-cover rounded-lg"
            alt="프로필 이미지"
          />
        </div>
      </div>
    </div>
  );
};

export default CounselorProfileCard;
