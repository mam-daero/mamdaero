import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import ModalWrapper from '@/components/modal/ModalWrapper';
import Button from '@/components/button/Button';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

interface ScriptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultId: number;
}

interface ScriptDetail {
  date: string;
  time: number;
  clientName: string;
  counselorName: string;
  script: string;
}

const fetchScript = async (consultId: number): Promise<ScriptDetail> => {
  const response = await axiosInstance.get(`/c/script/${consultId}`);
  return response.data;
};

const ScriptViewModal: React.FC<ScriptViewModalProps> = ({ isOpen, onClose, consultId }) => {
  const { data, isLoading, isError } = useQuery<ScriptDetail, Error>({
    queryKey: ['script', consultId],
    queryFn: () => fetchScript(consultId),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto p-8 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">상담 스크립트</h2>
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorMessage message="스크립트를 불러오는데 실패했습니다." />}
        {data && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-bold">날짜 |</span> {data.date}
                </div>
                <div>
                  <span className="font-bold">시간 |</span> {data.time}:00
                </div>
                <div>
                  <span className="font-bold">내담자명 |</span> {data.clientName}
                </div>
                <div>
                  <span className="font-bold">상담사명 |</span> {data.counselorName}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">스크립트 내용</h3>
                <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto">
                  {data.script}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ScriptViewModal;
