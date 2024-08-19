import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface BernardTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import bernardResult from '@/assets/bernardResult.png';

const BernardTestModal: React.FC<BernardTestModalProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 200); // 애니메이션 지속 시간과 일치시킵니다
  };

  return (
    <div>
      <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-3xl bg-orange-50 p-0 flex flex-col">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
            onClick={onClose}
          >
            <IoCloseCircleOutline size={24} />
          </button>
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            <img
              src={bernardResult}
              alt="검사결과"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default BernardTestModal;
