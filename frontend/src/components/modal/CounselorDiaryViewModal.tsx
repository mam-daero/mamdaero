import React from 'react';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface CounselorDiaryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  diary: {
    emotion: string;
    date: string;
    content: string;
  };
}

const CounselorDiaryViewModal: React.FC<CounselorDiaryViewModalProps> = ({
  isOpen,
  onClose,
  diary,
}) => {
  if (!isOpen || !diary) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="bg-blue-50 p-4 rounded-lg shadow-lg mx-auto">
        <div className="flex items-center mb-4 space-x-2">
          <h2 className="text-md font-semibold">날짜 |</h2>
          <div className="bg-blue-200 px-4 py-2 rounded">{diary.date}</div>
        </div>
        <div className="flex items-center mb-4">
          <span className="mr-2 text-md font-semibold">내담자의 감정 |</span>
          <div className="bg-blue-200 px-4 py-2 rounded">{diary.emotion}</div>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold">일기 내용</h3>
          <div className="bg-white p-4 rounded-lg">{diary.content}</div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400 transition duration-200"
          >
            닫기
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CounselorDiaryViewModal;
