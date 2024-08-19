import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

import { IoIosArrowBack } from 'react-icons/io';
import Button from '@/components/button/Button';
import SupervisionBar from '@/components/navigation/SupervisionBar';
import SupervisionPostCard from '@/components/card/supervision/SupervisionPostCard';
import SupervisionCommentCard from '@/components/card/supervision/SupervisionCommentCard';
import SupervisionWriteCommentCard from '@/components/card/supervision/SupervisionWriteCommentCard';

interface PostDetail {
  id: number;
  writer: string;
  title: string;
  content: string;
  view: number;
  createdAt: string;
  likeCount: number;
  isLike: boolean;
  isMine: boolean;
  file: string;
}

interface CommentDetail {
  id: number;
  writer: string;
  comment: string;
  createdAt: string;
  isMine: boolean;
}

const fetchPostDetail = async (postId: number): Promise<PostDetail> => {
  const response = await axiosInstance({
    method: 'get',
    url: `/ca/counselor-board/${postId}`,
  });
  return response.data;
};

const fetchComments = async (postId: number): Promise<CommentDetail[]> => {
  const response = await axiosInstance({
    method: 'get',
    url: `/ca/counselor-board/${postId}/comment`,
  });
  return Array.isArray(response.data.data) ? response.data.data : [];
};

const SupervisionDetailPage: React.FC = () => {
  const { supervisionId } = useParams<{ supervisionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const backToList = () => {
    navigate('/supervision');
  };

  // 게시글 데이터 조회
  const postDetailQuery = useQuery({
    queryKey: ['postDetail', supervisionId],
    queryFn: () => fetchPostDetail(Number(supervisionId)),
    enabled: !!supervisionId,
  });

  // 댓글 데이터 조회
  const commentsQuery = useQuery({
    queryKey: ['comments', supervisionId],
    queryFn: () => fetchComments(Number(supervisionId)),
    enabled: !!supervisionId,
  });

  // 댓글 추가 핸들러
  const handleCommentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', supervisionId] });
  };

  // 댓글 수정 핸들러
  const handleCommentUpdate = (updatedComment: CommentDetail) => {
    queryClient.setQueryData(
      ['comments', supervisionId],
      (oldData: CommentDetail[] | undefined) => {
        if (!oldData) return [updatedComment];
        return oldData.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
      }
    );
  };
  if (postDetailQuery.isError) return <div>Error loading post details</div>;
  if (commentsQuery.isError) return <div>Error loading comments</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 슈퍼비전 상단바 */}
      <div className="sticky bg-blue-50 top-0 z-10">
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
              color="blue"
            />
          </div>
          <SupervisionBar />
        </div>
      </div>
      {/* 게시물 내용 */}
      <div className="flex-grow py-5 px-16">
        {postDetailQuery.data && (
          <>
            <SupervisionPostCard
              postDetail={postDetailQuery.data}
              queryKey={{ queryKey: ['supervisionPosts'] }}
            />
            <div className="border-y-2 border-blue-300 px-10 py-2 mt-3">
              <span className="text-blue-500 font-bold text-xl">
                {commentsQuery.data?.length || 0}
              </span>
              <span className="font-bold text-base">개의 댓글이 있습니다.</span>
            </div>
            {commentsQuery.data &&
              commentsQuery.data.map(comment => (
                <SupervisionCommentCard
                  key={comment.id}
                  commentDetail={comment}
                  postId={Number(supervisionId)}
                />
              ))}
            <SupervisionWriteCommentCard
              postId={Number(supervisionId)}
              onCommentAdded={handleCommentAdded}
            />{' '}
          </>
        )}
      </div>
    </div>
  );
};

export default SupervisionDetailPage;
