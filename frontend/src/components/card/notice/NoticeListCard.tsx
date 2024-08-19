import React from 'react';
import { Link } from 'react-router-dom';

interface Post {
  noticeId: number;
  title: string;
  view: number;
  createdAt: string;
}

interface BoardTableProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const NoticeListCard: React.FC<BoardTableProps> = ({
  posts,
  currentPage,
  totalPages,
  paginate,
}) => {
  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full table-fixed">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[40%]" />
          <col className="w-[20%]" />
          <col className="w-[10%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="px-4 py-2 text-center">번호</th>
            <th className="px-4 py-2 text-center">제목</th>
            <th className="px-4 py-2 text-center">작성자</th>
            <th className="px-4 py-2 text-center">조회수</th>
            <th className="px-4 py-2 text-center">날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr
              key={post.noticeId}
              className="border-b hover:bg-gray-200 transition-colors duration-200"
            >
              <td className="px-4 py-2 text-center truncate">{post.noticeId}</td>
              <td className="px-4 py-2 text-center truncate">
                <Link to={`/notice/${post.noticeId}`} className="hover:underline">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-2 text-center truncate">관리자</td>
              <td className="px-4 py-2 text-center truncate">{post.view}</td>
              <td className="px-4 py-2 text-center truncate">{post.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1 ? 'bg-gray-200 text-black' : 'bg-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeListCard;
