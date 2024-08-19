import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Button from '@/components/button/Button';
import HtpHome from '../input/HtpHome';
import HtpTree from '../input/HtpTree';
import HtpPerson from '../input/HtpPerson';
interface HtpTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HTPTestModal: React.FC<HtpTestModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'tree' | 'person'>('home');

  const homeTab = () => {
    setActiveTab('home');
  };
  const treeTab = () => {
    setActiveTab('tree');
  };
  const personTab = () => {
    setActiveTab('person');
  };
  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 200); // 애니메이션 지속 시간과 일치시킵니다
  };
  return (
    // <div>
    <dialog className={`modal ${isOpen ? 'modal-open' : ''} w-full h-full`}>
      <div className="modal-box relative max-w-[60%] w-full h-[70vh] ml-[180px] box-content py-10 overflow-y-hidden bg-orange-50 ">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:btn-ghost"
          onClick={handleClose}
        >
          <IoCloseCircleOutline size={24} />
        </button>
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-center space-x-2 mb-3">
            <div>
              <Button
                label="집"
                onClick={homeTab}
                size="lg"
                color={activeTab === 'home' ? 'orange' : 'gray'}
              />
            </div>
            <div>
              <Button
                label="나무"
                onClick={treeTab}
                size="lg"
                color={activeTab === 'tree' ? 'orange' : 'gray'}
              />
            </div>
            <div>
              <Button
                label="사람"
                onClick={personTab}
                size="lg"
                color={activeTab === 'person' ? 'orange' : 'gray'}
              />
            </div>
          </div>
          {activeTab === 'home' && <HtpHome />}
          {activeTab === 'tree' && <HtpTree />}
          {activeTab === 'person' && <HtpPerson />}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
    // </div>
  );
};

export default HTPTestModal;
