import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface ReportEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultId: number;
  initialData: {
    title: string;
    detail: string;
    opinion: string;
  };
}

interface ReportEditData {
  title: string;
  content: string;
  opinion: string;
}

const editReport = async (consultId: number, data: ReportEditData) => {
  const response = await axiosInstance.patch(`/c/consult-report/${consultId}`, {
    title: data.title,
    detail: data.content, // content 대신 detail을 사용
    opinion: data.opinion,
  });
  return response.data;
};

const ReportEditModal: React.FC<ReportEditModalProps> = ({
  isOpen,
  onClose,
  consultId,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.detail);
  const [opinion, setOpinion] = useState(initialData.opinion);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ReportEditData) => editReport(consultId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportDetail', consultId] });
      queryClient.invalidateQueries({ queryKey: ['reportInfo'] });
      onClose();
    },
    onError: error => {
      console.error('Error editing report:', error);
      alert('보고서 수정 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = () => {
    if (!title || !content || !opinion) {
      alert('모든 필드를 작성해주세요.');
      return;
    }

    mutation.mutate({ title, content, opinion });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto p-8 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">상담 보고서 수정</h2>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4">
            <label className="block font-bold mb-2">보고서 제목</label>
            <input
              className="w-full p-2 border rounded"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">상담 내용</label>
            <textarea
              className="w-full h-32 p-2 border rounded"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">소견</label>
            <textarea
              className="w-full h-32 p-2 border rounded"
              value={opinion}
              onChange={e => setOpinion(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            label={mutation.isPending ? '수정 중...' : '수정완료'}
            onClick={handleSubmit}
            size="md"
            shape="rounded"
            color="blue"
            textSize="sm"
            disabled={mutation.isPending}
          />
          <Button
            label="취소"
            onClick={onClose}
            size="md"
            shape="rounded"
            color="gray"
            textSize="sm"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReportEditModal;
