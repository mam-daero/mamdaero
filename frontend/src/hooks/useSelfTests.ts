import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import useAuthStore from '@/stores/authStore';

export interface SelfTestItem {
  id: number;
  selftestName: string;
  selftestInfo: string;
}

export interface Question {
  id: number;
  selftestQuestionDetail: string;
  options: {
    id: number;
    selftestQuestionOptionDetail: string;
    selftestQuestionOptionScore: number;
  }[];
}

interface SubmitResult {
  testId: number;
  isPublic: number;
  checkList: number[];
}

interface SubmitResponse {
  message: string;
  status: string;
}

interface PreviousTestResult {
  memberSelfTestId: number;
  selftestName: string;
  selftestTotalScore: number;
  selftestResponseResDtos: {
    selftestQuestionResponseId: number;
    memberSelftestId: number;
    selftestQuestion: string;
    selftestMemberQuestionScore: number;
  }[];
}

const fetchSelfTestList = async (): Promise<SelfTestItem[]> => {
  const response = await axiosInstance.get<SelfTestItem[]>('/p/selftest');
  return response.data;
};

const fetchSelfTest = async (testId: number): Promise<Question[]> => {
  const response = await axiosInstance.get<Question[]>(`/p/selftest/${testId}`);
  return response.data;
};

const submitSelfTestResult = async ({
  testId,
  isPublic,
  checkList,
}: SubmitResult): Promise<SubmitResponse> => {
  const response = await axiosInstance.post<SubmitResponse>(`/m/selftest/${testId}`, {
    isPublic,
    checkList,
  });
  return response.data;
};

const fetchPreviousTestResults = async (): Promise<PreviousTestResult[]> => {
  const response = await axiosInstance.get<PreviousTestResult[]>('/m/selftest');
  return response.data;
};

export const useSelfTests = (testId?: number) => {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const { isAuthenticated } = useAuthStore();

  const selfTestListQuery = useQuery<SelfTestItem[], Error>({
    queryKey: ['selfTests'],
    queryFn: fetchSelfTestList,
  });

  const selfTestQuery = useQuery<Question[], Error>({
    queryKey: ['selfTest', testId],
    queryFn: () => fetchSelfTest(testId!),
    enabled: !!testId,
  });

  const previousTestResultsQuery = useQuery<PreviousTestResult[], Error>({
    queryKey: ['previousTestResults'],
    queryFn: fetchPreviousTestResults,
    enabled: isAuthenticated,
  });

  const submitMutation = useMutation<SubmitResponse, Error, SubmitResult>({
    mutationFn: submitSelfTestResult,
    onSuccess: () => {
      if (testId) {
        queryClient.invalidateQueries({ queryKey: ['selfTest', testId] });
        queryClient.invalidateQueries({ queryKey: ['previousTestResults'] });
      }
    },
  });

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (isPublic: number = 1) => {
    if (!selfTestQuery.data || !testId) return null;

    if (Object.keys(answers).length !== selfTestQuery.data.length) {
      return { error: '모든 문항에 답변해 주세요.' };
    }

    const checkList = selfTestQuery.data.map(question => answers[question.id]);
    const totalScore = selfTestQuery.data.reduce(
      (acc, question) => acc + question.options[answers[question.id]].selftestQuestionOptionScore,
      0
    );

    if (isAuthenticated) {
      submitMutation.mutate({ testId, isPublic, checkList });
    }

    return { totalScore, checkList };
  };

  return {
    selfTestList: selfTestListQuery.data,
    isLoadingList: selfTestListQuery.isLoading,
    isErrorList: selfTestListQuery.isError,
    selfTest: selfTestQuery.data,
    isLoadingTest: selfTestQuery.isLoading,
    isErrorTest: selfTestQuery.isError,
    previousTestResults: previousTestResultsQuery.data,
    isLoadingPreviousResults: previousTestResultsQuery.isLoading,
    isErrorPreviousResults: previousTestResultsQuery.isError,
    answers,
    handleAnswerChange,
    handleSubmit,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
    isAuthenticated,
  };
};

export default useSelfTests;
