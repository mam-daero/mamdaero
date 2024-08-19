import React, { useState, useEffect } from 'react';
import Editor from '@/components/Editor';
import RegisterButton from '@/components/button/RegisterButton';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '@/components/button/Button';
import CommunityBar from '@/components/navigation/CommunityBar';

interface PostData {
  title: string;
  content: string;
}

interface CommunityFormProps {
  initialData?: PostData;
  onSubmit: (data: PostData) => void;
  isSubmitting: boolean;
  isPageModified?: boolean;
  onCancel?: () => void;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  initialData = { title: '', content: '' },
  onSubmit,
  isSubmitting,
  isPageModified = false,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>(initialData.title);
  const [content, setContent] = useState<string>(initialData.content);
  const [isModified, setIsModified] = useState<boolean>(isPageModified);

  useEffect(() => {
    setIsModified(title.trim() !== '' || content.trim() !== '');
  }, [title, content]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    onSubmit({ title, content });
  };

  const handleCancel = () => {
    if (isModified && !window.confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
      return;
    }

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div>
      <div className="sticky bg-orange-50 top-0 z-10">
        <div className="flex justify-between items-end ms-16">
          <div className="mb-3">
            <Button
              label={
                <span className="flex items-center ms-2">
                  <IoIosArrowBack />
                  <div className="ms-2 mt-0.5">게시글 목록 보기</div>
                </span>
              }
              onClick={handleCancel}
              size="목록보기"
              textSize="sm"
              shape="rounded"
              color="orange"
            />
          </div>
          <CommunityBar />
        </div>
      </div>

      <div className="mx-24 my-6">
        <input
          placeholder="제목을 입력해 주세요."
          className="w-full px-6 h-16 large-placeholder"
          value={title}
          onChange={handleTitleChange}
        />
        <Editor value={content} onChange={handleEditorChange} />
        <div className="flex justify-end">
          <div className="m-6">
            <RegisterButton onClick={handleSubmit} disabled={isSubmitting} color="orange" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForm;
