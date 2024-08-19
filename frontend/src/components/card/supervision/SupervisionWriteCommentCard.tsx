import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import RegisterButton from '@/components/button/RegisterButton';
import useMemberStore from '@/stores/memberStore';

interface SupervisionCommentCardProps {
  postId: number;
  onCommentAdded?: () => void;
}

interface CommentDetail {
  id: number;
  writer: string;
  comment: string;
  createdAt: string;
}

const postComment = async (postId: number, comment: string): Promise<CommentDetail> => {
  const response = await axiosInstance({
    method: 'post',
    url: `ca/counselor-board/${postId}/comment`,
    data: { comment },
  });
  return response.data;
};

const SupervisionWriteCommentCard: React.FC<SupervisionCommentCardProps> = ({
  postId,
  onCommentAdded,
}) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>('');
  const { name } = useMemberStore();

  const mutation = useMutation({
    mutationFn: (comment: string) => postComment(postId, comment),
    onMutate: async newComment => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData<CommentDetail[]>(['comments', postId]);
      queryClient.setQueryData<CommentDetail[]>(['comments', postId], old => {
        const newCommentObj: CommentDetail = {
          id: Date.now(),
          writer: name || '익명',
          comment: newComment,
          createdAt: new Date().toISOString(),
        };
        return [...(old || []), newCommentObj];
      });
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousComments);
      alert(`오류가 발생했습니다. ${err}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      if (onCommentAdded) {
        onCommentAdded(); // 댓글 추가 완료 후 콜백 함수 호출
      }
    },
  });

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      mutation.mutate(comment);
      setComment(''); // 댓글 입력 후 입력창 비우기
    }
  };

  return (
    <div className="mx-8 my-6 border rounded-md bg-zinc-50 border-gray-300 shadow-sm">
      <div className="px-8">
        <div className="font-bold text-lg mb-2 mt-3">{name}</div>
        <div className="bg-zinc-50">
          <textarea
            value={comment}
            onChange={event => setComment(event.target.value)}
            placeholder="댓글을 작성해 보세요!"
            className="bg-zinc-50 w-full h-16"
          />
        </div>
        <div className="text-right mb-3 mt-2">
          <RegisterButton
            onClick={handleCommentSubmit}
            color="blue"
            disabled={mutation.isPending || comment.trim() === ''}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisionWriteCommentCard;
