import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import axiosInstance from '@/api/axiosInstance';

import { FaEdit } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegComments } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Button from '@/components/button/Button';
import ReportButton from '@/components/button/ReportButton';

interface CommentDetail {
  id: number;
  writer: string;
  comment: string;
  createdAt: string;
  isMine: boolean;
}

interface CommunityCommentCardProps {
  commentDetail: CommentDetail;
  postId: number;
}

const CommunityCommentCard: React.FC<CommunityCommentCardProps> = ({ commentDetail, postId }) => {
  const queryClient = useQueryClient();
  const [showReportButton, setShowReportButton] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>(commentDetail.comment);
  const reportButtonRef = useRef<HTMLDivElement | null>(null);
  const createdAt = dayjs(commentDetail.createdAt).format('YYYY-MM-DD HH:mm');

  // 댓글 수정 로직
  const handleEditClick = (): void => {
    setIsEditing(true);
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setEditedComment(commentDetail.comment);
  };

  const updateCommentMutation = useMutation({
    mutationFn: (newComment: string) =>
      axiosInstance({
        method: 'patch',
        url: `/cma/board/${postId}/comment/${commentDetail.id}`,
        data: newComment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId.toString()] });
      setIsEditing(false);
    },
    onError: error => {
      alert('댓글 수정 중 오류가 발생했습니다.');
    },
  });

  const handleSaveEdit = (): void => {
    updateCommentMutation.mutate(editedComment);
  };

  // 댓글 삭제
  const handleDeleteClick = (): void => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate();
    }
  };

  const deleteCommentMutation = useMutation({
    mutationFn: () =>
      axiosInstance({
        method: 'delete',
        url: `/cma/board/${postId}/comment/${commentDetail.id}`,
      }),
    onSuccess: () => {
      queryClient.setQueryData(
        ['comments', postId.toString()],
        (oldData: CommentDetail[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(comment => comment.id !== commentDetail.id);
        }
      );
    },
    onError: error => {
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  // 댓글 신고
  const toggleReportButton = (): void => {
    setShowReportButton(!showReportButton);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (reportButtonRef.current && !reportButtonRef.current.contains(event.target as Node)) {
        setShowReportButton(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const reportMutation = useMutation({
    mutationFn: () =>
      axiosInstance({
        method: 'post',
        url: `cm/board/${postId}/comment/${commentDetail.id}/complaint`,
      }),
    onSuccess: () => {
      alert('댓글 신고가 완료되었습니다.');
    },
    onError: error => {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  const handleCommentReport = (): void => {
    reportMutation.mutate();
  };

  return (
    <div className="border-b-2 border-orange-300 px-10 pt-4 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center text-lg font-bold">
          <FaRegComments />
          {commentDetail.writer}
        </div>
        <div className="flex gap-2 items-center">
          {commentDetail.isMine && !isEditing && (
            <>
              <div className="relative group pb-1">
                <FaEdit
                  onClick={handleEditClick}
                  className="cursor-pointer hover:text-orange-500 transition-colors duration-200"
                />
                <span className="absolute flex bottom-full left-1/2 whitespace-nowrap transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  수정
                </span>
              </div>
              <div className="relative group pb-1">
                <RiDeleteBin6Line
                  onClick={handleDeleteClick}
                  className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                />
                <span className="absolute bottom-full left-1/2 whitespace-nowrap transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  삭제
                </span>
              </div>
            </>
          )}
          {!commentDetail.isMine && (
            <div className="relative" ref={reportButtonRef}>
              <button onClick={toggleReportButton} className="p-1">
                <BsThreeDots />
              </button>
              {showReportButton && (
                <div className="absolute right-7 ml-2 top-0 z-10">
                  <ReportButton onClick={handleCommentReport} />
                </div>
              )}
            </div>
          )}
          <span className="mx-2">{createdAt}</span>
        </div>
      </div>
      {isEditing ? (
        <div className="mx-8 my-2">
          <textarea
            value={editedComment}
            onChange={e => setEditedComment(e.target.value)}
            className="w-full h-20 p-2 border rounded"
            rows={3}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="취소"
              onClick={handleCancelEdit}
              color="gray"
              size="수정"
              textSize="sm"
            />
            <Button
              label="저장"
              onClick={handleSaveEdit}
              color="orange"
              size="수정"
              textSize="sm"
            />
          </div>
        </div>
      ) : (
        <div className="mx-8 my-2">{commentDetail.comment}</div>
      )}
    </div>
  );
};

export default CommunityCommentCard;
