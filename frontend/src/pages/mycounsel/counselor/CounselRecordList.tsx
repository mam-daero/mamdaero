import React, { useState, useMemo } from 'react';
import ClientCard from '@/components/card/mycounsel/ClientCard';
import Button from '@/components/button/Button';
import useClientList from '@/hooks/useClientList';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

// 클라이언트 타입 정의
interface Client {
  id: number;
  name: string;
}

// API 응답 타입 정의
interface ClientListResponse {
  data: Client[];
  totalPages: number;
}

const CounselRecordList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useClientList() as {
    data: ClientListResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };

  const filteredClients = useMemo(() => {
    if (!data) return [];
    return data.data.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage message={error?.message || '오류가 발생했습니다.'} />;

  const itemsPerPage = 9; // 한 페이지당 보여줄 아이템 수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단바 */}
      <div className="sticky bg-blue-50 top-0 z-10 mb-8">
        <div className="flex flex-col mt-6 mx-16 justify-end">
          <div className="flex justify-between items-center">
            <div className="flex justify-start relative">
              <div className="w-52 relative mr-2">
                <input
                  type="text"
                  placeholder="이름을 입력해주세요."
                  className="input input-bordered w-full h-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button label="검색" color="gray" size="검색" onClick={handleSearch} />
            </div>
            <div className="flex flex-col text-right">
              <div className="text-4xl font-bold ms-8 flex-shrink-0">
                <span className="text-blue-500">내담자 목록</span> 상담기록
              </div>
            </div>
          </div>
          <div className="mt-2"></div>
        </div>
      </div>
      {/* 내담자 목록 */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {currentItems.map(client => (
              <ClientCard
                key={client.id}
                clientName={client.name}
                clientId={client.id.toString()}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1 ? 'bg-blue-400 text-white' : 'bg-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CounselRecordList;
