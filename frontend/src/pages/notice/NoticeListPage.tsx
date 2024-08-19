import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';

import NoticeListCard from '@/components/card/notice/NoticeListCard';
import NoticeBar from '@/components/navigation/NoticeBar';
import WriteButton from '@/components/button/WriteButton';
import useAuthStore from '@/stores/authStore';

interface Page<T> {
  currentPage: number;
  data: T[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface Post {
  noticeId: number;
  title: string;
  view: number;
  createdAt: string;
}

const fetchPosts = async (page: number): Promise<Page<Post>> => {
  const res = await axiosInstance({
    method: 'get',
    url: `p/notice?page=${page}`,
  });
  return {
    ...res.data,
    data: res.data.data.map((item: Post) => ({
      noticeId: item.noticeId,
      title: item.title,
      view: item.view,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
    })),
  };
};

const NoticeListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const {
    data: pageData,
    isLoading,
    error,
  } = useQuery<Page<Post>, Error>({
    queryKey: ['posts', currentPage] as const,
    queryFn: () => fetchPosts(currentPage),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber - 1);

  const writePost = () => {
    navigate('/notice/write/post');
  };

  return (
    <div>
      <NoticeBar />
      <div className="mx-8">
        <div className="flex justify-end mx-5">
          {isAdmin() && (
            <div className="text-right">
              <WriteButton onClick={writePost} color="gray" />
            </div>
          )}
          {!isAdmin() && <div className="my-4"></div>}
        </div>
        <NoticeListCard
          posts={pageData?.data || []}
          currentPage={currentPage + 1}
          totalPages={pageData?.totalPages || 1}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default NoticeListPage;
