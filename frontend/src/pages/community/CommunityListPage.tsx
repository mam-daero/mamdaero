import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';

import CommunityListCard from '@/components/card/community/CommunityListCard';
import CommunityBar from '@/components/navigation/CommunityBar';
import WriteButton from '@/components/button/WriteButton';
import AlignDropdown from '@/components/dropdown/AlignDropdown';

interface Page<T> {
  currentPage: number;
  data: T[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
interface Post {
  id: number;
  title: string;
  writer: string;
  view: number;
  likeCount: number;
  createdAt: string;
}

const fetchPosts = async (
  page: number,
  condition: string,
  searchField: string,
  searchValue: string
): Promise<Page<Post>> => {
  const res = await axiosInstance({
    method: 'get',
    url: 'p/board',
    params: {
      page: page - 1,
      condition,
      searchField,
      searchValue,
    },
  });
  return {
    ...res.data,
    data: res.data.data.map((item: Post) => ({
      id: item.id,
      title: item.title,
      writer: item.writer,
      view: item.view,
      likeCount: item.likeCount,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
    })),
  };
};

const CommunityListPage: React.FC = () => {
  const [selectedOption1, setSelectedOption1] = useState('new');
  const [selectedOption2, setSelectedOption2] = useState('title');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigate = useNavigate();
  const options1 = ['최신순', '오래된순', '추천 많은 순', '댓글 많은 순'];
  const optionsE = ['new', 'old', 'best', 'comment'];
  const options2 = ['제목', '내용', '작성자'];
  const options2E = ['title', 'content', 'name'];

  const {
    data: pageData,
    isLoading,
    error,
    refetch,
  } = useQuery<Page<Post>, Error>({
    queryKey: ['posts', currentPage, selectedOption1] as const,
    queryFn: () => fetchPosts(currentPage, selectedOption1, selectedOption2, searchTerm),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);
  const writePost = () => {
    navigate('/community/write/post');
  };

  const handleOptionChange = (option: string) => {
    const condition = optionsE[options1.indexOf(option)];
    console.log(condition);

    setSelectedOption1(condition);
    setCurrentPage(1);
  };

  const handleOptionChange2 = (option: string) => {
    const searchField = options2E[options2.indexOf(option)];
    setSelectedOption2(searchField);
    setCurrentPage(1);
  };

  const handleSearchChange = () => {
    refetch();
  };

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <CommunityBar />
      <div className="mx-8">
        <div className="flex justify-between mx-5">
          <div>
            <AlignDropdown
              selectedOption={options1[optionsE.indexOf(selectedOption1)]}
              options={options1}
              onOptionClick={handleOptionChange}
            />
          </div>
          <div className="text-right">
            <WriteButton onClick={writePost} color="orange" />
          </div>
        </div>
        <CommunityListCard
          posts={pageData?.data || []}
          currentPage={currentPage}
          totalPages={pageData?.totalPages || 1}
          paginate={paginate}
          selectedOption2={options2[options2E.indexOf(selectedOption2)]}
          options2={options2}
          handleOptionChange2={handleOptionChange2}
          searchTerm={searchTerm}
          handleChange={handleChange}
          handleSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default CommunityListPage;
