import React, { useEffect, useRef, useState } from 'react';
import MyCounselBar from '@/components/navigation/MyCounselBar';
import { MdPostAdd } from 'react-icons/md';
import { RiAlarmWarningLine, RiMoreLine } from 'react-icons/ri';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Button from '@/components/button/Button';
import Prince from '@/assets/memo_prince.png';
import Bubble from '@/assets/bubble2.png';
import Postit from '@/assets/postit.png';
import Postit2 from '@/assets/postit2.png';
import Postit3 from '@/assets/postit3.png';
import PostitWriteModal from '@/components/modal/PostitWriteModal';
import { getPostits, getQuestion } from '@/api/postit';
import {
  useComplaintPostit,
  useCreatePostit,
  useDeletePostit,
  useLikePostit,
  useUpdatePostit,
} from '@/hooks/postit';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';
import useAuthStore from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const postitImages = [Postit, Postit2, Postit3];

interface Postit {
  id: number;
  questionId: number;
  content: string;
  color: string;
  likeCount: number;
  isLike: boolean;
  isMine: boolean;
}

interface Question {
  id: number;
  content: string;
}

interface EditPostitState {
  questionId: number;
  postitId: number;
  content: string;
}

const PostitPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [modalState, setModalState] = useState<{ type: 'create' | 'update'; isOpen: boolean }>({
    type: 'create',
    isOpen: false,
  });
  const [editPostit, setEditPostit] = useState<EditPostitState | undefined>(undefined);
  const nextFetchTargetRef = useRef<HTMLDivElement | null>(null);

  const { mutateAsync: complaintPostit } = useComplaintPostit();
  const { mutateAsync: likePostit } = useLikePostit();
  const { mutateAsync: createPostit } = useCreatePostit();
  const { mutateAsync: updatePostit } = useUpdatePostit();
  const { mutateAsync: deletePostit } = useDeletePostit();

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    error: questionError,
  } = useQuery<Question, Error>({
    queryKey: ['question'],
    queryFn: getQuestion,
  });

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    enabled: !!questionData,
    queryKey: ['postits'],
    queryFn: ({ pageParam }) => getPostits({ questionId: questionData?.id || 0, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage;
      }
      return undefined;
    },
  });

  const checkAuth = () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      navigate('/');
      return false;
    }
    return true;
  };

  const handleLike = (id: number) => {
    if (!checkAuth()) return;
    likePostit(id)
      .then(() => {})
      .catch(() => {
        alert('좋아요에 실패했습니다.');
      });
  };

  const handleComplaint = (id: number) => {
    if (!checkAuth()) return;
    complaintPostit(id)
      .then(() => {
        alert('신고가 성공적으로 등록되었습니다.');
      })
      .catch(() => {
        alert('신고에 실패했습니다.');
      });
  };

  const handleCreatePostit = (content: string) => {
    if (!checkAuth()) return;
    if (!questionData?.id) {
      alert('질문이 없습니다.');
      return;
    }
    createPostit({ questionId: questionData.id, content })
      .then(() => {
        alert('포스트잇이 성공적으로 등록되었습니다.');
        closeModal();
      })
      .catch(() => {
        alert('포스트잇 등록에 실패했습니다.');
      });
  };

  const handleDeletePostit = (questionId: number, id: number) => {
    if (!checkAuth()) return;
    deletePostit({ questionId, id })
      .then(() => {
        alert('포스트잇이 성공적으로 삭제되었습니다.');
      })
      .catch(() => {
        alert('포스트잇 삭제에 실패했습니다.');
      });
  };

  const handleUpdatePostit = (questionId: number, postitId: number, content: string) => {
    if (!checkAuth()) return;
    updatePostit({ questionId, postitId, content })
      .then(() => {
        alert('포스트잇이 성공적으로 수정되었습니다.');
        closeModal();
      })
      .catch(() => {
        alert('포스트잇 수정에 실패했습니다.');
      });
  };

  const openModal = (type: 'create' | 'update') => {
    if (!checkAuth()) return;
    setModalState({ type, isOpen: true });
  };

  const openEditModal = (postit: Postit) => {
    if (!checkAuth()) return;
    openModal('update');
    setEditPostit({ questionId: postit.questionId, postitId: postit.id, content: postit.content });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
    setEditPostit(undefined);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const fetchCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage?.();
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(fetchCallback, options);

    if (nextFetchTargetRef.current) {
      observer.observe(nextFetchTargetRef.current);
    }

    return () => {
      if (nextFetchTargetRef.current) {
        observer.unobserve(nextFetchTargetRef.current);
      }
    };
  }, [data]);

  if (isQuestionLoading) return <LoadingIndicator />;
  if (questionError) return <ErrorMessage message="FAILED TO LOAD" />;

  // 여기서부터 return 문이 시작됩니다...
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-orange-50 shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]">
        <MyCounselBar
          title1="맘대로"
          title2="포스트잇"
          subtitle="질문에 포스트잇을 달아보세요!"
          user="client"
        />
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-4 gap-8 mt-5">
          <div className="col-span-1">
            <div className="sticky top-36 flex flex-col items-center">
              <div className="relative flex flex-col items-center justify-center">
                <img src={Bubble} alt="Bubble" className="w-full h-auto" />
                <div className="absolute inset-0 flex flex-col justify-between items-center text-center py-8 p-8 h-52">
                  <h2 className="text-xl font-bold text-orange-500">오늘의 질문</h2>
                  <p className="text-lg font-bold w-full">
                    {questionData?.content || '질문 데이터가 없습니다.'}
                  </p>
                  <Button
                    color="orange"
                    size="md"
                    textSize="md"
                    label={
                      <div className="flex items-center justify-center">
                        <MdPostAdd className="inline mr-1" />
                        작성하기
                      </div>
                    }
                    onClick={() => openModal('create')}
                  />
                </div>
              </div>
              <img src={Prince} className="w-5/6 mt-10" alt="Prince" />
            </div>
          </div>
          <div className="col-span-3 bg-white p-4 rounded-lg shadow-[0_4px_2px_-2px_rgba(0,0,0.1,0.1)]">
            <div className="grid grid-cols-3 gap-8">
              {isLoading ? (
                <div>로딩중</div>
              ) : (
                data?.pages
                  .flatMap(page => page.data)
                  .map((postit: Postit, idx: number) => (
                    <div key={postit.id} className="relative aspect-square">
                      <img
                        src={postitImages[idx % 3]}
                        alt="Postit"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex flex-col justify-between p-8">
                        <div className="flex items-center">
                          {postit.isMine && (
                            <div className="dropdown">
                              <div
                                tabIndex={0}
                                role="button"
                                className="flex justify-center items-end"
                              >
                                <RiMoreLine size={20} />
                              </div>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
                              >
                                <li>
                                  <span onClick={() => openEditModal(postit)}>수정하기</span>
                                </li>
                                <li>
                                  <span
                                    onClick={() => handleDeletePostit(postit.questionId, postit.id)}
                                  >
                                    삭제하기
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                          <button
                            onClick={() => handleComplaint(postit.id)}
                            className="text-gray-600 hover:text-red-500  ml-auto"
                          >
                            <RiAlarmWarningLine size={20} />
                          </button>
                        </div>
                        <p className="text-center font-bold mr-5">{postit.content}</p>
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => handleLike(postit.id)}
                            className="flex items-center"
                          >
                            {postit.isLike ? (
                              <IoMdHeart className="text-red-500" size={20} />
                            ) : (
                              <IoMdHeartEmpty size={20} />
                            )}
                            <span className="ml-1">{postit.likeCount}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {!isLoading &&
              hasNextPage && ( // isLoading이 false이면서 hasNextPage가 true일 시에만 보이도록
                <div ref={nextFetchTargetRef}></div> // API 호출 영역
              )}
          </div>
        </div>
      </div>
      <PostitWriteModal
        type={modalState.type}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onCreate={handleCreatePostit}
        onUpdate={handleUpdatePostit}
        postit={editPostit}
        question={questionData?.content || ''}
      />
    </div>
  );
};

export default PostitPage;
