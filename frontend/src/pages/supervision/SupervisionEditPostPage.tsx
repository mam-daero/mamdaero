import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import SupervisionForm from './SupervisionForm';

interface PostData {
  title: string;
  content: string;
  file?: File;
}

const SupervisionEditPostPage: React.FC = () => {
  const { supervisionId: postIdString } = useParams<{ supervisionId: string }>();
  const supervisionId = postIdString ? parseInt(postIdString, 10) : undefined;
  const navigate = useNavigate();

  const { data: postData, isLoading } = useQuery({
    queryKey: ['PostData', supervisionId],
    queryFn: async () => {
      const response = await axiosInstance.get(`ca/counselor-board/${supervisionId}`);
      return response.data;
    },
    enabled: supervisionId !== undefined,
  });

  const mutation = useMutation({
    mutationFn: async (postData: PostData) => {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(postData)], { type: 'application/json' }));
      if (postData.file) formData.append('file', postData.file);

      const response = await axiosInstance.patch(`c/counselor-board/${supervisionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    },
    onSuccess: () => {
      navigate(`/supervision/${supervisionId}`);
    },
    onError: (error: unknown) => {
      alert(`오류가 발생했습니다. ${error}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>; // 데이터 로딩 중 상태 표시
  }

  return (
    <SupervisionForm
      initialData={postData}
      onSubmit={mutation.mutate}
      isSubmitting={mutation.isPending}
    />
  );
};

export default SupervisionEditPostPage;
