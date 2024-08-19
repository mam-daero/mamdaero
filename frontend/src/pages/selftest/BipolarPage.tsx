import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import TestBar from '@/components/navigation/TestBar';
import { FaCheck } from 'react-icons/fa';
import useSelfTests from '@/hooks/useSelfTests';
import useAuthStore from '@/stores/authStore';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

const BipolarPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isPublic, setIsPublic] = useState(true);
  const {
    selfTest,
    selfTestList,
    isLoadingTest,
    isErrorTest,
    isLoadingList,
    isErrorList,
    answers,
    handleAnswerChange,
    handleSubmit,
    isSubmitting,
  } = useSelfTests(5);

  if (isLoadingTest || isLoadingList) return <LoadingIndicator />;
  if (isErrorTest || isErrorList) return <ErrorMessage message="FAILED TO LOAD TEST" />;
  if (!selfTest || selfTest.length === 0 || !selfTestList) return null;

  const bipolarInfo = selfTestList.find(info => info.selftestName === 'bipolar');
  const mainQuestions = selfTest.slice(0, 13);
  const additionalQuestions = selfTest.slice(13);

  const onSubmit = () => {
    const result = handleSubmit(isPublic ? 1 : 0);
    if (result && !result.error) {
      navigate('/selftest/bipolar/result', {
        state: {
          totalScore: result.totalScore,
          checkList: isAuthenticated ? undefined : result.checkList,
        },
      });
    } else if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <div>
      <TestBar
        title="조울증"
        subtitle="기분이 지나치게 들뜨거나 가라앉는 경험을 자주 하시나요?"
        showBackButton={true}
      />
      <div className="flex text-sm space-x-5 mt-12 justify-center">
        <FaCheck />
        <div>{bipolarInfo ? bipolarInfo.selftestInfo : ''}</div>
      </div>
      <div className="flex justify-center m-4">
        {isAuthenticated && (
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">상담사 공개</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        )}
      </div>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl px-4">
          <table className="table w-full rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="bg-orange-300 text-orange-300-content text-base rounded-tl-lg text-center align-middle">
                  번호
                </th>
                <th className="bg-orange-300 text-orange-300-content text-base text-center align-middle">
                  질문
                </th>
                {mainQuestions[0].options.map(option => (
                  <th
                    key={option.id}
                    className="bg-orange-300 text-orange-300-content text-center text-base"
                  >
                    {option.selftestQuestionOptionDetail}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mainQuestions.map((question, qIndex) => (
                <tr
                  key={question.id}
                  className={`${qIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} text-center align-middle`}
                >
                  <td className="font-bold text-base rounded-l">{qIndex + 1}</td>
                  <td className="text-base text-left">{question.selftestQuestionDetail}</td>
                  {question.options.map((option, optionIndex) => (
                    <td key={option.id} className="text-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswerChange(question.id, optionIndex)}
                        className="radio radio-primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-8">
        <h3 className="text-xl font-bold mb-4">추가 질문</h3>
        {additionalQuestions.map((question, index) => (
          <div
            key={question.id}
            className="w-4/5 mb-6 p-4 bg-white shadow-md rounded-lg hover:shadow-primary transition-shadow duration-200"
          >
            <label className="block text-base font-normal mb-2">
              {mainQuestions.length + index + 1}. {question.selftestQuestionDetail}
            </label>
            <div className="flex space-x-4">
              {question.options.map((option, optionIndex) => (
                <label key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => handleAnswerChange(question.id, optionIndex)}
                    className="radio radio-primary"
                  />
                  <span className="text-base font-normal">
                    {option.selftestQuestionOptionDetail}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full mt-8">
        <Button
          onClick={onSubmit}
          label={isSubmitting ? '제출 중...' : '결과보기'}
          color="orange"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default BipolarPage;
