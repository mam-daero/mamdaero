import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/button/Button';
import { IoCloseCircleOutline } from 'react-icons/io5';
import fox from '@/assets/chat_fox.png';
import prince from '@/assets/chat_prince.png';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  reservationId: string;
  user: 'client' | 'counselor';
}

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  memberName,
  reservationId,
  user,
}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const isClient = user === 'client';
  const themeColor = isClient ? 'orange' : 'blue';
  const partnerTitle = isClient ? '상담사' : '내담자';
  const partnerTitleColor = isClient ? 'orange' : 'blue'; // 상대방 타이틀 색상 변경
  const partnerAvatar = isClient ? fox : prince;
  const selfAvatar = isClient ? prince : fox;

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        sender: '나',
        content: message.trim(),
        timestamp: new Date(),
      };
      setChatHistory([...chatHistory, newMessage]);
      setMessage('');
      chatInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className={`modal-box p-0 max-w-xl w-11/12 h-[80vh] flex flex-col bg-${themeColor}-50`}>
        <button
          className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 text-${themeColor}-600`}
          onClick={onClose}
        >
          <IoCloseCircleOutline size={24} />
        </button>
        <div className={`bg-${themeColor}-300 text-${themeColor}-900 p-4`}>
          <h3 className="text-lg font-semibold">
            {memberName} <span className={`text-${partnerTitleColor}-600`}>{partnerTitle}</span>님
          </h3>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatHistory.map((msg, index) => {
            const isSelf = msg.sender === '나';
            return (
              <div key={index} className={`chat ${isSelf ? 'chat-end' : 'chat-start'} w-full mb-2`}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={isSelf ? selfAvatar : partnerAvatar} alt="Avatar" />
                  </div>
                </div>
                <div className="chat-header text-xs">
                  {msg.sender}
                  <time className="text-xs opacity-50 ml-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </time>
                </div>
                <div
                  className={`chat-bubble chat-bubble-${themeColor} break-words text-sm max-w-[80%]`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              ref={chatInputRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
              placeholder="메시지를 입력하세요..."
            />
            <Button
              label="전송"
              onClick={handleSendMessage}
              color={themeColor}
              size="검색"
              textSize="sm"
            />
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ChatModal;
