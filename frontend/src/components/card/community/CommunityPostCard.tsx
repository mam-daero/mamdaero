import dayjs from 'dayjs';
import axiosInstance from '@/api/axiosInstance';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';

import parse, { DOMNode, Element } from 'html-react-parser';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import EditButton from '@/components/button/EditButton';
import DeleteButton from '@/components/button/DeleteButton';
import ReportButton from '@/components/button/ReportButton';
import useAuthStore from '@/stores/authStore';

interface CommunityPostCardProps {
  postDetail: {
    id: number;
    writer: string;
    title: string;
    content: string;
    view: number;
    createdAt: string;
    likeCount: number;
    isLike: boolean;
    isMine: boolean;
  };
  queryKey: InvalidateQueryFilters;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ postDetail, queryKey }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReportButton, setShowReportButton] = useState<boolean>(false);
  const { id, writer, title, content, view, isMine } = postDetail;
  const [isLike, setIsLike] = useState<boolean>(postDetail.isLike);
  const [likeCount, setLikeCount] = useState<number>(postDetail.likeCount);
  const createdAt = dayjs(postDetail.createdAt).format('YYYY-MM-DD HH:mm:ss');
  const reportButtonRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated } = useAuthStore();

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
        // 기본적으로는 domNode를 그대로 반환
        return domNode;
      },
    });
  };

  // 게시글 수정
  const handleArticleEdit = () => {
    navigate(`/community/edit/${id}`);
  };

  // 게시글 삭제
  const handleArticleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteArticleMutation.mutate(id);
    }
  };

  const deleteArticleMutation = useMutation({
    mutationFn: (postId: number) =>
      axiosInstance({
        method: 'delete',
        url: `/cma/board/${postId}`,
      }),
    onSuccess: () => {
      alert('게시글이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries(queryKey);
      navigate('/community');
    },
    onError: error => {
      console.error('게시글 삭제 중 오류 발생:', error);
      alert('게시글 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  // 게시글 신고
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
        url: `cm/board/${id}/complaint`,
      }),
    onSuccess: () => {
      alert('게시글 신고가 완료되었습니다.');
    },
    onError: error => {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  const handleArticleReport = (): void => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    reportMutation.mutate();
  };

  // 좋아요
  const toggleLikeMutation = useMutation({
    mutationFn: () =>
      axiosInstance({
        method: 'post',
        url: `cm/board/${id}/like`,
      }),
    onSuccess: () => {
      setIsLike(isLike => !isLike);
      setLikeCount(likeCount => (isLike ? likeCount - 1 : likeCount + 1));
      queryClient.invalidateQueries(queryKey);
    },
    onError: error => {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    toggleLikeMutation.mutate();
  };

  return (
    <div className="space-y-3">
      {/* 게시글 제목 헤더 */}
      <div className=" border-y-2 border-orange-300 p-5">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex justify-between items-end mt-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-gray-400 me-2">글쓴이</span>
              <span className="font-bold">{writer}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 me-2">일시</span>
              <span className="font-bold">{createdAt}</span>
              <span className="text-gray-400 mx-5 me-2">조회수</span>
              <span className="font-bold">{view}</span>
            </div>
          </div>
          <div className="justify-end">
            {isMine && (
              <div className="flex gap-2">
                <EditButton color="orange" onClick={handleArticleEdit} />
                <DeleteButton onClick={handleArticleDelete} />
              </div>
            )}
            {!isMine && (
              <div className="relative" ref={reportButtonRef}>
                <button onClick={toggleReportButton} className="p-1">
                  <BsThreeDots />
                </button>
                {showReportButton && (
                  <div className="absolute right-0 ml-2 bottom-6 z-10">
                    <ReportButton onClick={handleArticleReport} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 게시글 내용 */}
      <div className="relative p-10">
        <div className="whitespace-pre-wrap">{parseContent(content)}</div>
      </div>

      <div className="bottom-3 right-5 flex justify-end text-base gap-1 py-2 ps-10 pr-12">
        <div className="flex font-bold items-center cursor-pointer" onClick={handleLikeClick}>
          {isAuthenticated && isLike ? (
            <IoMdHeart size={24} color="red" />
          ) : (
            <IoMdHeartEmpty size={24} color="red" />
          )}
          <div className="ml-1">좋아요</div>
          <div className="ml-1">{likeCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCard;
