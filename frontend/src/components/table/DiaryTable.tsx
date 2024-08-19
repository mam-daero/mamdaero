import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import { FiChevronDown } from 'react-icons/fi';
import CounselorDiaryViewModal from '@/components/modal/CounselorDiaryViewModal';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

type Emotion = '행복해요' | '화나요' | '우울해요' | '짜증나요' | '불안해요' | '슬퍼요';

interface Diary {
  id: number;
  emotion: Emotion;
  content: string;
  date: string;
  isOpen: boolean;
}

interface DiaryResponse {
  content: Diary[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface DiaryTableProps {
  clientId: string;
}

const fetchDiaries = async (clientId: string): Promise<DiaryResponse> => {
  const response = await axiosInstance.get<DiaryResponse>(`/c/diary/${clientId}`);
  return response.data;
};

const EMOTION_TYPES: Emotion[] = [
  '행복해요',
  '화나요',
  '우울해요',
  '짜증나요',
  '불안해요',
  '슬퍼요',
];

const DiaryTable: React.FC<DiaryTableProps> = ({ clientId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<DiaryResponse, Error>({
    queryKey: ['diaries', clientId],
    queryFn: () => fetchDiaries(clientId),
  });

  const filteredAndSortedDiaries = useMemo(() => {
    if (!data) return [];
    let diaries = [...data.content];
    if (selectedEmotion) {
      diaries = diaries.filter(diary => diary.emotion === selectedEmotion);
    }
    return diaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, selectedEmotion]);

  const handleEmotionSelect = (emotion: Emotion | null) => {
    setSelectedEmotion(emotion);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = (diary: Diary) => {
    setSelectedDiary(diary);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDiary(null);
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message="FAILED TO LOAD" />;
  if (data?.content.length === 0) {
    return <div className="text-center py-4">일기 기록이 없습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <table className="table w-full text-center">
        <thead className="text-base">
          <tr>
            <th></th>
            <th className="relative">
              <button
                onClick={toggleDropdown}
                className="font-bold flex items-center justify-center w-full"
              >
                <span>감정</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                />
                {selectedEmotion && <span>({selectedEmotion})</span>}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 left-1/2 transform -translate-x-1/2">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() => handleEmotionSelect(null)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    >
                      전체 보기
                    </button>
                    {EMOTION_TYPES.map(emotion => (
                      <button
                        key={emotion}
                        onClick={() => handleEmotionSelect(emotion)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </th>
            <th>날짜</th>
            <th>내용</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody className="text-base">
          {filteredAndSortedDiaries.map((diary, index) => (
            <tr key={diary.id}>
              <td>{filteredAndSortedDiaries.length - index}</td>
              <td>{diary.emotion}</td>
              <td>{diary.date}</td>
              <td>
                {diary.content.length > 10 ? `${diary.content.slice(0, 10)}...` : diary.content}
              </td>
              <td>
                <Button
                  label="상세 보기"
                  onClick={() => openModal(diary)}
                  size="sm"
                  color="blue"
                  textSize="xs"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDiary && (
        <CounselorDiaryViewModal isOpen={isModalOpen} onClose={closeModal} diary={selectedDiary} />
      )}
    </div>
  );
};

export default DiaryTable;
