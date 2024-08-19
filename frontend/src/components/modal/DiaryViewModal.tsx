import React from 'react';
import { Emotion, getEmotionImage } from '@/pages/emotiondiary/emotion';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { DiaryResponse, useDeleteEmotionDiary } from '@/hooks/emotionDiary';
interface DiaryViewModalProps {
  isOpen: boolean;
  diary?: DiaryResponse;
  onClose: () => void;
  onEdit: () => void;
}

const DiaryViewModal: React.FC<DiaryViewModalProps> = ({ isOpen, diary, onClose, onEdit }) => {
  const { mutateAsync: deleteDiary } = useDeleteEmotionDiary();

  const onDelete = () => {
    if (!diary) return;
    const agree = window.confirm('정말로 이 일기를 삭제하시겠습니까?');
    if (agree) {
      deleteDiary(diary.id)
        .then(() => {})
        .catch(() => {
          alert('다이어리 삭제에 실패했습니다.');
        });
    }
    onClose();
  };

  if (!isOpen || !diary) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mx-auto">
        <div className="flex items-center mb-4 space-x-2">
          <h2 className="text-lg font-bold">날짜 |</h2>
          <div className="bg-orange-200 px-4 py-2 rounded">{diary.date}</div>
        </div>
        <div className="flex items-center mb-4">
          <span className="mr-2">오늘의 감정 |</span>
          <img src={getEmotionImage(diary.emotion)} alt="emotion" className="w-7 h-6" />
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold">내용</h3>
          <div className="bg-white p-4 rounded-lg">{diary.content}</div>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="shareWithCounselor"
            checked={diary.isOpen}
            disabled
            className="mr-2"
          />
          <label htmlFor="shareWithCounselor">상담사 공개</label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-orange-300 text-white rounded hover:bg-gray-400 transition duration-200"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-gray-400 transition duration-200"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
          >
            닫기
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DiaryViewModal;
