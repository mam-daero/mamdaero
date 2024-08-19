import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import ModalWrapper from '@/components/modal/ModalWrapper';
import Button from '@/components/button/Button';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';
import ReportEditModal from './ReportEditModal';

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultId: number;
}

interface ReportDetail {
  id: number;
  date: string;
  time: number;
  clientName: string;
  counselorName: string;
  title: string;
  detail: string;
  opinion: string;
}

const fetchReportDetail = async (consultId: number): Promise<ReportDetail> => {
  const response = await axiosInstance.get(`/c/consult-report/${consultId}`);
  return response.data;
};

const ReportViewModal: React.FC<ReportViewModalProps> = ({ isOpen, onClose, consultId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery<ReportDetail, Error>({
    queryKey: ['reportDetail', consultId],
    queryFn: () => fetchReportDetail(consultId),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <>
      <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
        <div className="max-h-[80vh] overflow-y-auto p-8 bg-blue-50 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">상담 보고서</h2>
          {isLoading && <LoadingIndicator />}
          {isError && <ErrorMessage message="보고서를 불러오는데 실패했습니다." />}
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
                <div className="mb-4">
                  <h3 className="font-bold mb-2">보고서 제목</h3>
                  <p className="bg-gray-100 p-3 rounded">{data.title}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-bold mb-2">상담 내용</h3>
                  <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{data.detail}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">소견</h3>
                  <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{data.opinion}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  label="수정하기"
                  onClick={() => setIsEditModalOpen(true)}
                  size="md"
                  shape="rounded"
                  color="blue"
                  textSize="sm"
                />
                <Button
                  label="닫기"
                  onClick={onClose}
                  size="md"
                  shape="rounded"
                  color="gray"
                  textSize="sm"
                />
              </div>
            </>
          )}
        </div>
      </ModalWrapper>
      {data && (
        <ReportEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          consultId={consultId}
          initialData={data}
        />
      )}
    </>
  );
};

export default ReportViewModal;
