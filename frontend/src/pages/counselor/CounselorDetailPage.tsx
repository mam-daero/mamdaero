import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

import DefaultProfile from '@/assets/DefaultProfile.jpg';
import ReviewCard from '@/components/card/ReviewCard';
import Button from '@/components/button/Button';

import { IoIosArrowBack } from 'react-icons/io';
import { FaStar } from 'react-icons/fa6';
import { LoadingIndicator, ErrorMessage, NoDataIndicator } from '@/components/StatusIndicators';

interface CounselorInfo {
  id: number;
  name: string;
  tel: string;
  gender: string;
  level: string;
  intro: string;
  introDetail: string;
  img: string;
  reviewCount: number;
  reviewRate: number;
}

const genderMap = {
  M: '남자',
  F: '여자',
};

interface CounselorReview {
  id: number;
  review: string;
  score: number;
}

interface CounselorReviewResponse {
  data: CounselorReview[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}
const fetchCounselorInfo = async (counselorId: string): Promise<CounselorInfo> => {
  const response = await axiosInstance({
    method: 'get',
    url: `p/counselor/${counselorId}`,
  });
  return response.data;
};

const fetchCounselorReviews = async (counselorId: string): Promise<CounselorReviewResponse> => {
  const response = await axiosInstance({
    method: 'get',
    url: `p/counselor/${counselorId}/review`,
  });
  return response.data;
};
const CounselorDetailPage = () => {
  const navigate = useNavigate();
  const { counselorId } = useParams<{ counselorId: string }>();
  const {
    data: counselorInfo,
    isLoading: isInfoLoading,
    isError: isInfoError,
  } = useQuery<CounselorInfo, Error>({
    queryKey: ['counselorInfo', counselorId],
    queryFn: () => fetchCounselorInfo(counselorId || ''),
    enabled: !!counselorId,
  });

  const {
    data: reviews,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery<CounselorReviewResponse, Error>({
    queryKey: ['counselorReviews', counselorId],
    queryFn: () => fetchCounselorReviews(counselorId || ''),
    enabled: !!counselorId,
  });

  if (isInfoLoading || isReviewsLoading) return <LoadingIndicator />;
  if (isInfoError || isReviewsError) return <ErrorMessage message="정보불러오기 실패" />;
  if (!counselorInfo) return <NoDataIndicator message="상담사 정보 없음" />;

  const backToList = () => {
    navigate('/counselor');
  };

  const goReservation = () => {
    navigate(`/counselor/${counselorId}/reservation`, {
      state: { counselorName: name, counselorImg: img },
    });
  };

  const { name, intro, introDetail, tel, gender, level, img, reviewCount, reviewRate } =
    counselorInfo;

  return (
    <div className="my-3 mx-24">
      <div className="mb-3">
        <Button
          label={
            <span className="flex items-center ms-2">
              <IoIosArrowBack />
              <div className="ms-2 mt-0.5">상담사 목록 보기</div>
            </span>
          }
          onClick={backToList}
          size="목록보기"
          color="orange"
          textSize="sm"
        ></Button>
      </div>
      <div className="grid grid-cols-4">
        {/* 왼쪽 부분 (상담사 소개) */}
        <div className="col-span-3">
          {/* 한줄 소개 */}
          <div className="text-3xl font-bold max-w-2xl my-4">{intro}</div>
          {/* 상담사 프로필 */}
          <div>
            <div className="flex">
              <div className="text-xl font-bold border-b-4 mt-2 border-b-orange-400">
                상담사 프로필
              </div>
            </div>
            <div className="text-base max-w-2xl my-4 font-bold flex gap-2">
              <div className="text-gray-500">급수</div>
              <div className="mr-3">{level}급</div>
              <div className="text-gray-500">성별</div>
              <div className="mr-3">
                {genderMap[gender as keyof typeof genderMap] || '정보 없음'} 상담사{' '}
              </div>
              <div className="text-gray-500">연락처</div>
              <div>{tel}</div>
            </div>
          </div>
          {/* 상담사 상세 소개 */}
          <div>
            <div className="flex">
              <div className="text-xl font-bold border-b-4 mt-4 border-b-orange-400">
                상담사 소개
              </div>
            </div>
            <div className="text-base max-w-2xl my-4">{introDetail}</div>
          </div>
          {/* 리뷰 */}
          <div className="flex">
            <div className=" flex items-end font-bold border-b-4 mt-8 border-b-orange-400">
              <div className="text-orange-500 text-xl ">{reviewCount}개</div>
              <div className="text-base">의 리뷰가 있습니다.</div>
            </div>
          </div>
          {/* 리뷰 컴포넌트 */}
          <div className="grid grid-cols-2 gap-6 my-4 pe-6">
            {reviews && reviews.data && reviews.data.length > 0 ? (
              reviews.data.map(review => (
                <ReviewCard key={review.id} review={review.review} score={review.score} />
              ))
            ) : (
              <div>아직 리뷰가 없습니다.</div>
            )}
          </div>
        </div>
        {/* 오른쪽 부분 (이름, 이미지, 예약하기 버튼) */}
        <div className="col-span-1 mx-2">
          <div className="sticky top-20 overflow-auto">
            <img
              src={img || DefaultProfile}
              className="w-full h-64 object-cover rounded-lg"
              alt={`${name} 프로필 이미지`}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // 무한 루프 방지
                target.src = DefaultProfile;
              }}
            />{' '}
            <div className="flex my-4 justify-start">
              <div className="flex items-end">
                <div className="text-3xl font-bold">{name}</div>
                <div className="text-base font-bold ml-2">상담사</div>
                <div className="flex ms-1">
                  <FaStar size={20} color="orange" className="ms-1" />
                  <div className="text-md font-bold mx-1">{reviewRate}</div>
                </div>
              </div>
            </div>
            <div>
              <Button
                label="예약하기"
                onClick={goReservation}
                size="예약하기"
                color="orange"
                textSize="xl"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorDetailPage;
