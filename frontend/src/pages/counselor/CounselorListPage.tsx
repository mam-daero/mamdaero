import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import DefaultProfile from '@/assets/DefaultProfile.jpg';

import CounselorProfileCard from '@/components/card/CounselorProfileCard';
import AlignDropdown from '@/components/dropdown/AlignDropdown';
import { IoIosSearch } from 'react-icons/io';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

interface Counselor {
  id: string;
  name: string;
  intro: string;
  img: string;
  level: number;
  gender: string;
  reviewRate: number;
  reviewCount: number;
}

interface FetchCounselorParams {
  filter?: string;
  gender?: string;
  level?: string;
  counselorName?: string;
}

const fetchAllCounselors = async (): Promise<Counselor[]> => {
  const response = await axiosInstance({
    method: 'get',
    url: 'p/counselor',
    params: {
      size: 100,
    },
  });
  return response.data.content;
};

const CounselorListPage: React.FC = () => {
  const [selectedOption1, setSelectedOption1] = useState<string>('이름 순');
  const [selectedOption2, setSelectedOption2] = useState<string>('성별 무관');
  const [selectedOption3, setSelectedOption3] = useState<string>('모든 급수');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const options1 = ['이름 순', '리뷰 많은 순', '평점 높은 순'];
  const options2 = ['성별 무관', '남자 상담사', '여자 상담사'];
  const options3 = ['모든 급수', '1급 상담사', '2급 상담사'];

  const {
    data: allCounselors,
    isLoading,
    isError,
  } = useQuery<Counselor[]>({
    queryKey: ['allCounselors'],
    queryFn: fetchAllCounselors,
  });

  const filteredAndSortedCounselors = useMemo(() => {
    if (!allCounselors) return [];

    let result = [...allCounselors];

    // 성별 필터링
    if (selectedOption2 !== '성별 무관') {
      result = result.filter(c => c.gender === (selectedOption2 === '남자 상담사' ? 'M' : 'F'));
    }

    // 급수 필터링
    if (selectedOption3 !== '모든 급수') {
      result = result.filter(c => c.level === (selectedOption3 === '1급 상담사' ? 1 : 2));
    }

    // 이름 검색
    if (searchTerm) {
      result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 정렬
    switch (selectedOption1) {
      case '리뷰 많은 순':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case '평점 높은 순':
        result.sort((a, b) => b.reviewRate - a.reviewRate);
        break;
      default: // 이름 순
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allCounselors, selectedOption1, selectedOption2, selectedOption3, searchTerm]);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message="FAILED TO LOAD TEST" />;

  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between my-5">
        <div>
          <div className="font-bold text-xl sm:text-2xl md:text-3xl text-orange-500">
            맘대로 상담사 조회
          </div>
          <div className="my-2 text-sm sm:text-base md:text-lg">
            나에게 딱 맞는 상담사를 만나보세요.
          </div>
        </div>
        <div className="flex items-center position z-10 ">
          <AlignDropdown
            selectedOption={selectedOption1}
            options={options1}
            onOptionClick={setSelectedOption1}
          />
          <AlignDropdown
            selectedOption={selectedOption2}
            options={options2}
            onOptionClick={setSelectedOption2}
          />
          <AlignDropdown
            selectedOption={selectedOption3}
            options={options3}
            onOptionClick={setSelectedOption3}
          />
          <label className="input input-bordered flex items-center ms-5">
            <input
              type="text"
              className="w-60"
              placeholder="상담사를 검색하세요."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <IoIosSearch />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {filteredAndSortedCounselors.map(counselor => (
          <CounselorProfileCard
            key={counselor.id}
            counselorId={counselor.id}
            counselorName={counselor.name}
            counselorIntro={counselor.intro}
            counselorImage={counselor.img || DefaultProfile}
            reviewRate={counselor.reviewRate}
            reviewCount={counselor.reviewCount}
          />
        ))}
      </div>
    </div>
  );
};

export default CounselorListPage;
