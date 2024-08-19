import React, { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const postArticle = async (postData: PostData): Promise<PostArticleResponse> => {
  const response = await axiosInstance({
    method: 'post',
    url: 'a/notice',
    data: postData,
  });
  return response.data;
};

const CommunityWritePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postArticleMutation = useMutation({
    mutationFn: postArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      navigate('/notice');
    },
    onError: (error: unknown) => {
      alert(`오류가 발생했습니다. ${error}`);
    },
  });

  return (
    <NoticeForm
      onSubmit={postArticleMutation.mutate}
      isSubmitting={postArticleMutation.isPending}
      onCancel={() => navigate('/notice')}
    />
  );
};

export default CommunityWritePostPage;
