import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

import { IoIosArrowBack } from 'react-icons/io';
import Button from '@/components/button/Button';
import NoticeBar from '@/components/navigation/NoticeBar';
import NoticePostCard from '@/components/card/notice/NoticePostCard';

interface PostDetail {
  noticeId: number;
  title: string;
  content: string;
  view: number;
  createdAt: string;
}

const fetchPostDetail = async (postId: number): Promise<PostDetail> => {
  const response = await axiosInstance({
    method: 'get',
    url: `/p/notice/${postId}`,
  });
  return response.data;
};

const NoticeDetailPage: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const backToList = () => {
    navigate('/notice');
  };

  // 게시글 데이터 조회
  const postDetailQuery = useQuery({
    queryKey: ['postDetail', noticeId],
    queryFn: () => fetchPostDetail(Number(noticeId)),
    enabled: !!noticeId,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 슈퍼비전 상단바 */}
      <div className="sticky bg-gray-50 top-0 z-10">
        <div className="flex justify-between items-end ms-16">
          <div className="mb-3">
            <Button
              label={
                <span className="flex items-center ms-2">
                  <IoIosArrowBack />
                  <div className="ms-2 mt-0.5">게시글 목록 보기</div>
                </span>
              }
              onClick={backToList}
              size="목록보기"
              textSize="sm"
              shape="rounded"
              color="gray"
            />
          </div>
          <NoticeBar />
        </div>
      </div>
      {/* 게시물 내용 */}
      <div className="flex-grow py-5 px-16">
        {postDetailQuery.data && (
          <>
            <NoticePostCard
              postDetail={postDetailQuery.data}
              queryKey={{ queryKey: ['noticePosts'] }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailPage;
