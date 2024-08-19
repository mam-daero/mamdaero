import React, { useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import NoticeForm from '@/pages/notice/NoticeForm';

interface PostArticleResponse {
  id: number;
  title: string;
  content: string;
}

interface PostData {
  title: string;
  content: string;
}

// 기존 게시글 가져오기
const fetchPostDetail = async (postId: number): Promise<PostArticleResponse> => {
  const response = await axiosInstance({
    method: 'get',
    url: `p/notice/${postId}`,
  });
  return response.data;
};

// 게시글 수정
const updateArticle = async (postId: number, postData: PostData): Promise<PostArticleResponse> => {
  const response = await axiosInstance({
    method: 'patch',
    url: `a/notice/${postId}`,
    data: { name: postData.title, description: postData.content },
  });
  return response.data;
};

const NoticeEditPostPage: React.FC = () => {
  const { noticeId: postIdString } = useParams<{ noticeId: string }>();
  const noticeId = postIdString ? parseInt(postIdString, 10) : undefined;
  const navigate = useNavigate();

  const { data: postData, isLoading } = useQuery<PostArticleResponse, AxiosError>({
    queryKey: ['PostData', noticeId],
    queryFn: () => fetchPostDetail(noticeId!),
    enabled: noticeId !== undefined,
  });

  const mutation = useMutation<PostArticleResponse, AxiosError, PostData>({
    mutationFn: (data: PostData) => {
      if (noticeId === undefined) throw new Error('Post ID is missing');
      return updateArticle(noticeId, data);
    },
    onSuccess: () => {
      navigate(`/notice/${noticeId}`);
    },
    onError: (error: AxiosError) => {
      alert(`오류가 발생했습니다. ${error.message}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <NoticeForm
      initialData={postData}
      onSubmit={mutation.mutate}
      isSubmitting={mutation.isPending}
      onCancel={() => navigate('/notice')}
    />
  );
};

export default NoticeEditPostPage;
