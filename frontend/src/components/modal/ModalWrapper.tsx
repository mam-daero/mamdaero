import React, { ReactNode } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg'; // Define size prop
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'max-w-lg' : size === 'md' ? 'max-w-2xl' : 'max-w-4xl';

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className={`modal-box relative w-full overflow-hidden  ${sizeClass}`}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <IoCloseCircleOutline size={24} />
        </button>
        <div className="p-4">{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ModalWrapper;
