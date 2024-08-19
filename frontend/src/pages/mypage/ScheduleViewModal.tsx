import React from 'react';
import ModalWrapper from '@/components/modal/ModalWrapper';
interface ScheduleViewModalProps {
  isOpen: boolean;
  schedule: {
    id: number;
    date: Date;
    time: number;
    is_reserved: boolean;
    is_worktime: boolean;
  } | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

const ScheduleViewModal: React.FC<ScheduleViewModalProps> = ({
  isOpen,
  schedule,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !schedule) return null;

  const handleDelete = () => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      onDelete(schedule.id);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg" style={{ width: '600px' }}>
        <div className="flex items-center mb-4 space-x-2">
          <h2 className="text-lg font-bold">날짜 |</h2>
          <div className="bg-orange-200 px-4 py-2 rounded">{schedule.time}</div>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold">내용</h3>
          <div className="bg-white p-4 rounded-lg">{schedule.time}</div>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="shareWithCounselor"
            checked={schedule.is_reserved}
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
            onClick={handleDelete}
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

export default ScheduleViewModal;
