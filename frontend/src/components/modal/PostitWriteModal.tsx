import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface PostitWriteModalProps {
  type: 'create' | 'update';
  isOpen: boolean;
  onClose: () => void;
  onCreate: (content: string) => void;
  onUpdate: (questionId: number, postitId: number, content: string) => void;
  question: string;
  postit?: {
    questionId: number;
    postitId: number;
    content: string;
  };
}

const PostitWriteModal: React.FC<PostitWriteModalProps> = ({
  type,
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  question,
  postit,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    if (type === 'create') {
      onCreate(content);
      return;
    }
    if (type === 'update' && postit) {
      onUpdate(postit.questionId, postit.postitId, content);
    }
    onClose();
  };

  const closeModal = () => {
    onClose();
    setContent('');
  };

  useEffect(() => {
    if (isOpen) {
      if (type === 'update' && postit) {
        setContent(postit.content);
      } else {
        setContent('');
      }
    }
  }, [isOpen, type, postit]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={closeModal} size="sm">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2 text-orange-500">질문</h2>
        <p className="text-lg mb-4">{question || '질문 데이터가 없습니다'}</p>
        <textarea
          className="w-full h-24 p-2 border rounded mb-4 resize-none"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
        />
        <div className="flex justify-center space-x-2">
          <Button color="gray" size="sm" textSize="sm" label="취소" onClick={onClose} />
          <Button
            color="orange"
            size="sm"
            textSize="sm"
            label={type === 'create' ? '작성' : '수정'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PostitWriteModal;
