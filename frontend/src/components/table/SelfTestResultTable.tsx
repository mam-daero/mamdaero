import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/button/Button';
import { FiChevronDown } from 'react-icons/fi';
import TestDetailModal from '@/components/modal/TestDetailModal';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

interface SelfTestResult {
  memberSelfTestId: number;
  selftestName: string;
  selftestTotalScore: number;
  memberSelftestDate: string;
}

interface SelfTestResultResponse {
  content: SelfTestResult[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface SelfTestResultTableProps {
  clientId: string;
}

const fetchSelfTestResults = async (clientId: string): Promise<SelfTestResultResponse> => {
  const response = await axiosInstance.get(`c/selftest/result/${clientId}`);
  return response.data;
};

const TEST_TYPES = [
  { name: '우울', id: 'depressed' },
  { name: '불안', id: 'unrest' },
  { name: '스트레스', id: 'stress' },
  { name: 'PTSD', id: 'ptsd' },
  { name: '조울증', id: 'bipolar' },
];

const testNameMap: { [key: string]: string } = {
  depressed: '우울',
  unrest: '불안',
  stress: '스트레스',
  ptsd: 'PTSD',
  bipolar: '조울증',
};

const SelfTestResultTable: React.FC<SelfTestResultTableProps> = ({ clientId }) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState<SelfTestResult | null>(null);

  const { data, isLoading, isError } = useQuery<SelfTestResultResponse, Error>({
    queryKey: ['selfTestResults', clientId],
    queryFn: () => fetchSelfTestResults(clientId),
  });

  const filteredAndSortedResults = useMemo(() => {
    if (!data) return [];
    let results = [...data.content];
    if (selectedTest) {
      results = results.filter(result => result.selftestName === selectedTest);
    }
    return results.sort(
      (a, b) => new Date(b.memberSelftestDate).getTime() - new Date(a.memberSelftestDate).getTime()
    );
  }, [data, selectedTest]);

  const handleTestSelect = (testId: string | null) => {
    setSelectedTest(testId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = (testResult: SelfTestResult) => {
    setSelectedTestResult(testResult);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestResult(null);
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message="FAILED TO LOAD" />;
  if (data?.content.length === 0) {
    return <div className="text-center py-4">검사 결과가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <table className="table w-full text-center">
        <thead className="text-base">
          <tr>
            <th></th>
            <th className="relative">
              <button
                onClick={toggleDropdown}
                className="font-bold flex items-center justify-center w-full"
              >
                <span>검사종류</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                />
                {selectedTest && <span>({testNameMap[selectedTest]})</span>}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 left-1/2 transform -translate-x-1/2">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() => handleTestSelect(null)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    >
                      전체 보기
                    </button>
                    {TEST_TYPES.map(test => (
                      <button
                        key={test.id}
                        onClick={() => handleTestSelect(test.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      >
                        {test.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </th>
            <th>날짜</th>
            <th>점수</th>
            <th>결과 상세보기</th>
          </tr>
        </thead>
        <tbody className="text-base">
          {filteredAndSortedResults.map((selfTestResult, index) => (
            <tr key={selfTestResult.memberSelfTestId}>
              <td>{filteredAndSortedResults.length - index}</td>
              <td>{testNameMap[selfTestResult.selftestName] || selfTestResult.selftestName}</td>
              <td>{selfTestResult.memberSelftestDate}</td>
              <td>{selfTestResult.selftestTotalScore}</td>
              <td>
                <Button
                  label="상세 보기"
                  onClick={() => openModal(selfTestResult)}
                  size="sm"
                  color="blue"
                  textSize="xs"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTestResult && (
        <TestDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          clientId={clientId}
          testId={selectedTestResult.memberSelfTestId}
        />
      )}
    </div>
  );
};

export default SelfTestResultTable;
