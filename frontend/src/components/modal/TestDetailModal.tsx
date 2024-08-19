import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface TestDetailResponse {
  memberSelfTestId: number;
  selftestName: string;
  selftestTotalScore: number;
  selftestResponseResDtos: {
    selftestQuestionResponseId: number;
    memberSelftestId: number;
    selftestQuestion: string;
    selftestMemberQuestionScore: number;
    selftestMemberQuestionAnswer: string;
  }[];
}

interface TestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  testId: number;
}

const fetchTestDetail = async (clientId: string, testId: number): Promise<TestDetailResponse> => {
  const response = await axiosInstance.get(`c/selftest/result/${clientId}/${testId}`);
  return response.data;
};

const testNameMap: { [key: string]: string } = {
  depressed: '우울',
  unrest: '불안',
  stress: '스트레스',
  ptsd: 'PTSD',
  bipolar: '조울증',
};

const TestDetailModal: React.FC<TestDetailModalProps> = ({ isOpen, onClose, clientId, testId }) => {
  const { data, isLoading, isError } = useQuery<TestDetailResponse, Error>({
    queryKey: ['testDetail', clientId, testId],
    queryFn: () => fetchTestDetail(clientId, testId),
    enabled: isOpen,
  });

  if (!isOpen) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading test details</div>;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto p-4 z-50">
        <h2 className="text-2xl  font-bold mb-4 text-center">
          <span className="text-blue-500">
            {testNameMap[data?.selftestName || ''] || data?.selftestName}{' '}
          </span>
          검사 결과
        </h2>
        <div className="divider"></div>
        <p className="text-md mb-4 font-bold">총점: {data?.selftestTotalScore}</p>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-blue-300 text-blue-300-content text-base text-center">번호</th>
              <th className="bg-blue-300 text-blue-300-content text-base text-center">질문</th>
              <th className="bg-blue-300 text-blue-300-content text-base text-center">답변</th>
              <th className="bg-blue-300 text-blue-300-content text-base text-center">점수</th>
            </tr>
          </thead>
          <tbody>
            {data?.selftestResponseResDtos.map((item, index) => (
              <tr
                key={item.selftestQuestionResponseId}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="text-center">{index + 1}</td>
                <td>{item.selftestQuestion}</td>
                <td className="text-center">{item.selftestMemberQuestionAnswer}</td>
                <td className="text-center">{item.selftestMemberQuestionScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalWrapper>
  );
};

export default TestDetailModal;
