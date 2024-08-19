import React, { useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import CommunityForm from '@/pages/community/CommunityForm';

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
    url: `p/board/${postId}`,
  });
  return response.data;
};

// 게시글 수정
const updateArticle = async (postId: number, postData: PostData): Promise<PostArticleResponse> => {
  const response = await axiosInstance({
    method: 'patch',
    url: `cm/board/${postId}`,
    data: postData,
  });
  return response.data;
};

const CommunityEditPostPage: React.FC = () => {
  const { communityId: postIdString } = useParams<{ communityId: string }>();
  const communityId = postIdString ? parseInt(postIdString, 10) : undefined;
  const navigate = useNavigate();

  const { data: postData, isLoading } = useQuery<PostArticleResponse, AxiosError>({
    queryKey: ['PostData', communityId],
    queryFn: () => fetchPostDetail(communityId!),
    enabled: communityId !== undefined,
  });

  const mutation = useMutation<PostArticleResponse, AxiosError, PostData>({
    mutationFn: (data: PostData) => {
      if (communityId === undefined) throw new Error('Post ID is missing');
      return updateArticle(communityId, data);
    },
    onSuccess: () => {
      navigate(`/community/${communityId}`);
    },
    onError: (error: AxiosError) => {
      alert(`오류가 발생했습니다. ${error.message}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CommunityForm
      initialData={postData}
      onSubmit={mutation.mutate}
      isSubmitting={mutation.isPending}
      onCancel={() => navigate('/community')}
    />
  );
};

export default CommunityEditPostPage;
