import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@/components/Editor';
import RegisterButton from '@/components/button/RegisterButton';
import Button from '@/components/button/Button';
import { IoIosArrowBack } from 'react-icons/io';
import SupervisionBar from '@/components/navigation/SupervisionBar';
interface PostData {
  title: string;
  content: string;
  file?: File;
}

interface SupervisionFormProps {
  initialData?: PostData;
  onSubmit: (data: PostData) => void;
  isSubmitting: boolean;
}

const SupervisionForm: React.FC<SupervisionFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(initialData?.file || null);
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [content, setContent] = useState<string>(initialData?.content || '');
  const [isPageModified, setIsPageModified] = useState<boolean>(false);

  useEffect(() => {
    setIsPageModified(title.trim() !== '' || content.trim() !== '' || file !== null);
  }, [title, content, file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

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

    const postData: PostData = { title, content, file: file || undefined };
    onSubmit(postData);
  };

  const backToList = () => {
    if (isPageModified && !window.confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
      return;
    }
    navigate('/supervision');
  };

  return (
    <div>
      <div className="sticky bg-blue-50 top-0 z-10">
        <div className="flex justify-between items-end ms-16">
          <div className="mb-3">
            <Button
              label={
                <span className="flex items-center ms-2">
                  <IoIosArrowBack />
                  <div className="ms-2 mt-0.5">게시글 목록 보기</div>
                </span>
              }
              onClick={backToList}
              size="목록보기"
              textSize="sm"
              shape="rounded"
              color="blue"
            />
          </div>
          <SupervisionBar />
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
        <div className="flex justify-between">
          <input className="file-input h-9 mt-4" type="file" onChange={handleFileChange} />
          <div className="m-6">
            <RegisterButton onClick={handleSubmit} disabled={isSubmitting} color="blue" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisionForm;
