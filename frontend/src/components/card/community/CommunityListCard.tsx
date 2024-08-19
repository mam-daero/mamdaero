import React from 'react';
import { Link } from 'react-router-dom';

import AlignDropdown from '@/components/dropdown/AlignDropdown';

interface Post {
  id: number;
  title: string;
  writer: string;
  view: number;
  likeCount: number;
  createdAt: string;
}

interface BoardTableProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  selectedOption2: string;
  options2: string[];
  handleOptionChange2: (option: string) => void;
  searchTerm: string;
  handleChange: any;
  handleSearchChange: () => void;
}

const CommunityListCard: React.FC<BoardTableProps> = ({
  posts,
  currentPage,
  totalPages,
  paginate,
  selectedOption2,
  options2,
  handleOptionChange2,
  searchTerm,
  handleSearchChange,
  handleChange,
}) => {
  const truncateTitle = (title: string, maxLength: number = 26) => {
    if (title.length <= maxLength) return title;
    return `${title.slice(0, maxLength)}...`;
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full table-fixed">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[40%]" />
          <col className="w-[14%]" />
          <col className="w-[8%]" />
          <col className="w-[8%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="border-b bg-orange-100">
            <th className="px-4 py-2 text-center">번호</th>
            <th className="px-4 py-2 text-center">제목</th>
            <th className="px-4 py-2 text-center">작성자</th>
            <th className="px-4 py-2 text-center">조회수</th>
            <th className="px-4 py-2 text-center">추천수</th>
            <th className="px-4 py-2 text-center">날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr
              key={post.id}
              className="border-b hover:bg-orange-100 transition-colors duration-200"
            >
              <td className="px-4 py-2 text-center truncate">{post.id}</td>
              <td className="px-4 py-2 text-center truncate">
                <Link to={`/community/${post.id}`} className="hover:underline" title={post.title}>
                  {truncateTitle(post.title)}
                </Link>
              </td>
              <td className="px-4 py-2 text-center truncate">{post.writer}</td>
              <td className="px-4 py-2 text-center truncate">{post.view}</td>
              <td className="px-4 py-2 text-center truncate">{post.likeCount}</td>
              <td className="px-4 py-2 text-center truncate">{post.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <AlignDropdown
          selectedOption={selectedOption2}
          options={options2}
          onOptionClick={handleOptionChange2}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="검색어를 입력해주세요"
          className=" w-1/4 m-w-4xl p-1.5 rounded-l-lg focus:outline-none focus:ring-0"
        />
        <button onClick={handleSearchChange} className="px-4 rounded-r-lg bg-orange-100">
          검색
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1 ? 'bg-orange-400 text-white' : 'bg-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityListCard;
