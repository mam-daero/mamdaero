import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import ReportWriteModal from '@/components/modal/ReportWriteModal';
import ReportViewModal from '@/components/modal/ReportViewModal';
import ScriptSummaryModal from '@/components/modal/ScriptSummaryModal';
import ScriptViewModal from '@/components/modal/ScriptViewModal';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

interface ConsultReport {
  clientName: string;
  date: string;
  time: number;
  scriptUrl: string | null;
  summarizedScriptUrl: string | null;
  consultId: number;
  hasReport: boolean;
}

interface ReportInfoResponse {
  data: ConsultReport[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ReportInfoProps {
  clientId: string;
}

const fetchReportInfo = async (clientId: string): Promise<ReportInfoResponse> => {
  const response = await axiosInstance.get(`/c/${clientId}/consult-report`);
  return response.data;
};

const ReportInfoTable: React.FC<ReportInfoProps> = ({ clientId }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ConsultReport | null>(null);

  const { data, isLoading, isError } = useQuery<ReportInfoResponse, Error>({
    queryKey: ['reportInfo', clientId],
    queryFn: () => fetchReportInfo(clientId),
  });

  const handleOpenWriteModal = (report: ConsultReport) => {
    setSelectedReport(report);
    setIsWriteModalOpen(true);
  };

  const handleOpenViewModal = (report: ConsultReport) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleOpenScriptModal = (report: ConsultReport) => {
    setSelectedReport(report);
    setIsScriptModalOpen(true);
  };

  const handleOpenSummaryModal = (report: ConsultReport) => {
    setSelectedReport(report);
    setIsSummaryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsWriteModalOpen(false);
    setIsViewModalOpen(false);
    setIsScriptModalOpen(false);
    setIsSummaryModalOpen(false);
    setSelectedReport(null);
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message="FAILED TO LOAD" />;
  if (data?.data.length === 0) {
    return <div className="text-center py-4">완료된 상담이 없습니다.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-center">
        <thead className="text-base">
          <tr>
            <th></th>
            <th>날짜</th>
            <th>시간</th>
            <th>스크립트</th>
            <th>보고서</th>
          </tr>
        </thead>
        <tbody className="text-base">
          {data?.data.map((report, index) => (
            <tr key={report.consultId}>
              <td>{index + 1}</td>
              <td>{report.date}</td>
              <td>{report.time}:00</td>
              <td className="space-x-3">
                <Button
                  label="전체 보기"
                  onClick={() => handleOpenScriptModal(report)}
                  size="sm"
                  color="blue"
                  textSize="xs"
                />
                <Button
                  label="요약 보기"
                  onClick={() => handleOpenSummaryModal(report)}
                  size="sm"
                  color="blue"
                  textSize="xs"
                />
              </td>
              <td>
                {report.hasReport ? (
                  <Button
                    label="보고서 보기"
                    onClick={() => handleOpenViewModal(report)}
                    size="sm"
                    color="blue"
                    textSize="xs"
                  />
                ) : (
                  <Button
                    label="보고서 작성"
                    onClick={() => handleOpenWriteModal(report)}
                    size="sm"
                    color="orange"
                    textSize="xs"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedReport && (
        <>
          <ReportWriteModal
            isOpen={isWriteModalOpen}
            onClose={() => setIsWriteModalOpen(false)}
            consultId={selectedReport?.consultId || 0}
          />
          <ReportViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            consultId={selectedReport?.consultId || 0}
          />
          <ScriptViewModal
            isOpen={isScriptModalOpen}
            onClose={() => setIsScriptModalOpen(false)}
            consultId={selectedReport?.consultId || 0}
          />
          <ScriptSummaryModal
            isOpen={isSummaryModalOpen}
            onClose={() => setIsSummaryModalOpen(false)}
            consultId={selectedReport?.consultId || 0}
          />
        </>
      )}
    </div>
  );
};

export default ReportInfoTable;
