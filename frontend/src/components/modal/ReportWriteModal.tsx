import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface ReportWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultId: number;
}

interface ReportSubmitData {
  title: string;
  detail: string;
  opinion: string;
}

const submitReport = async (consultId: number, data: ReportSubmitData) => {
  const response = await axiosInstance.post(`/c/consult-report/${consultId}`, data);
  return response.data;
};

const ReportWriteModal: React.FC<ReportWriteModalProps> = ({ isOpen, onClose, consultId }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [opinion, setOpinion] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ReportSubmitData) => submitReport(consultId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportInfo'] });
      onClose();
    },
    onError: error => {
      alert('보고서 제출 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = () => {
    if (!title || !detail || !opinion) {
      alert('모든 필드를 작성해주세요.');
      return;
    }

    mutation.mutate({ title, detail, opinion });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto p-8 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">상담 보고서 작성</h2>
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
              value={detail}
              onChange={e => setDetail(e.target.value)}
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
        <div className="flex justify-center">
          <Button
            label={mutation.isPending ? '제출 중...' : '작성완료'}
            onClick={handleSubmit}
            size="md"
            shape="rounded"
            color="blue"
            textSize="sm"
            disabled={mutation.isPending}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReportWriteModal;
