import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SupervisionForm from './SupervisionForm';

interface PostArticleResponse {
  id: number;
  title: string;
  content: string;
  file?: string;
}

interface PostData {
  title: string;
  content: string;
  file?: File;
}

const SupervisionWritePostPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postArticleMutation = useMutation({
    mutationFn: async (postData: PostData) => {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(postData)], { type: 'application/json' }));
      if (postData.file) formData.append('file', postData.file);

      const response = await axiosInstance.post('c/counselor-board', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisionPosts'] });
      navigate('/supervision');
    },
    onError: (error: unknown) => {
      alert(`오류가 발생했습니다. ${error}`);
    },
  });

  return (
    <SupervisionForm
      onSubmit={postArticleMutation.mutate}
      isSubmitting={postArticleMutation.isPending}
    />
  );
};

export default SupervisionWritePostPage;
