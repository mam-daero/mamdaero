import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import ModalWrapper from '@/components/modal/ModalWrapper';
import Button from '@/components/button/Button';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

interface ScriptSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultId: number;
}

const fetchSummarizedScript = async (consultId: number): Promise<string> => {
  const response = await axiosInstance.get(`/c/summarized-script/${consultId}`);
  return response.data;
};

const ScriptSummaryModal: React.FC<ScriptSummaryModalProps> = ({ isOpen, onClose, consultId }) => {
  const { data, isLoading, isError } = useQuery<string, Error>({
    queryKey: ['summarizedScript', consultId],
    queryFn: () => fetchSummarizedScript(consultId),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="max-h-[80vh] overflow-y-auto p-8 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">상담 스크립트 요약</h2>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorMessage message="요약 스크립트를 불러오는데 실패했습니다." />}
        {data && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto">
                {data}
              </pre>
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ScriptSummaryModal;
