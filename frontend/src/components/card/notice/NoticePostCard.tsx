import dayjs from 'dayjs';
import axiosInstance from '@/api/axiosInstance';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';

import parse, { DOMNode, Element } from 'html-react-parser';
import EditButton from '@/components/button/EditButton';
import DeleteButton from '@/components/button/DeleteButton';
import useAuthStore from '@/stores/authStore';
interface NoticePostCardProps {
  postDetail: {
    noticeId: number;
    title: string;
    content: string;
    view: number;
    createdAt: string;
  };
  queryKey: InvalidateQueryFilters;
}

const NoticePostCard: React.FC<NoticePostCardProps> = ({ postDetail, queryKey }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { noticeId, title, content, view } = postDetail;
  const createdAt = dayjs(postDetail.createdAt).format('YYYY-MM-DD HH:mm:ss');
  const { isAdmin } = useAuthStore();
  // 이미지 로딩 핸들러
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.maxWidth = '100%'; // 이미지가 컨테이너에 맞게 조정됨
  };

  // HTML 콘텐츠를 React 컴포넌트로 변환
  const parseContent = (html: string) => {
    return parse(html, {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.name === 'img') {
          const { src, alt } = domNode.attribs as { src?: string; alt?: string };

          if (src) {
            return (
              <img
                src={src}
                alt={alt || 'image'}
                onLoad={handleImageLoad}
                style={{ maxWidth: '100%' }}
              />
            );
          }
        }
        return domNode;
      },
    });
  };

  // 게시글 수정
  const handleArticleEdit = () => {
    navigate(`/notice/edit/${noticeId}`);
  };

  // 게시글 삭제
  const handleArticleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteArticleMutation.mutate(noticeId);
    }
  };

  const deleteArticleMutation = useMutation({
    mutationFn: (postId: number) =>
      axiosInstance({
        method: 'delete',
        url: `/a/notice/${postId}`,
      }),
    onSuccess: () => {
      alert('게시글이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries(queryKey);
      navigate('/notice');
    },
    onError: error => {
      alert('게시글 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  return (
    <div className="space-y-3">
      {/* 게시글 제목 헤더 */}
      <div className="border-y-2 border-gray-300 p-5">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex justify-between items-end mt-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-gray-400 me-2">글쓴이</span>
              <span className="font-bold">관리자</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 me-2">일시</span>
              <span className="font-bold">{createdAt}</span>
              <span className="text-gray-400 mx-5 me-2">조회수</span>
              <span className="font-bold">{view}</span>
            </div>
          </div>
          {isAdmin() && (
            <div className="justify-end">
              <div className="flex gap-2">
                <EditButton color="gray" onClick={handleArticleEdit} />
                <DeleteButton onClick={handleArticleDelete} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 게시글 내용 */}
      <div className="relative p-10 border-b-2 border-gray-300">
        <div className="whitespace-pre-wrap">{parseContent(content)}</div>
      </div>
    </div>
  );
};

export default NoticePostCard;
