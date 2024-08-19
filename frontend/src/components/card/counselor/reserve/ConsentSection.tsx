import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface ConsentSectionProps {
  diaryConsent: boolean | null;
  setDiaryConsent: (consent: boolean) => void;
  setIsDiaryShared: (isShared: boolean) => void;
  testConsent: boolean | null;
  setTestConsent: (consent: boolean) => void;
  setIsTestShared: (isShared: boolean) => void;
}

const ConsentSection: React.FC<ConsentSectionProps> = ({
  diaryConsent,
  setDiaryConsent,
  setIsDiaryShared,
  testConsent,
  setTestConsent,
  setIsTestShared,
}) => {
  const handleDiaryConsent = (consent: boolean) => {
    setDiaryConsent(consent);
    setIsDiaryShared(consent);
  };

  const handleTestConsent = (consent: boolean) => {
    setTestConsent(consent);
    setIsTestShared(consent);
  };
  return (
    <>
      <div>
        <div className="flex items-end border-b-4 border-b-orange-400 mb-4 space-x-5">
          <div className="text-xl font-bold">일기 공개</div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex text-xs">
            <FaCheck />
            <div className="ml-3">상담사에게 공개하기로한 일기가 상담사에게 공유됩니다.</div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="text-sm font-bold">상담사에게 일기 공개를 하시겠습니까?</div>
            <button
              className={`btn ${
                diaryConsent === false ? 'btn-primary' : 'btn-outline btn-primary bg-white'
              } rounded-full`}
              onClick={() => handleDiaryConsent(false)}
            >
              비동의
            </button>
            <button
              className={`btn ${
                diaryConsent === true ? 'btn-primary' : 'btn-outline btn-primary bg-white'
              } rounded-full`}
              onClick={() => handleDiaryConsent(true)}
            >
              동의
            </button>
          </div>
        </div>
      </div>
      <div className="my-8">
        <div className="flex items-end border-b-4 border-b-orange-400 mb-4 space-x-5">
          <div className="text-xl font-bold">자가진단 검사 제출</div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex text-xs">
            <FaCheck />
            <div className="ml-3">
              자가진단 검사를 제출하시면 가장 최근의 검진 결과가 상담사에게 공유됩니다.
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="text-sm font-bold">자가진단 검사를 제출하시겠습니까?</div>
            <button
              className={`btn ${
                testConsent === false ? 'btn-primary' : 'btn-outline btn-primary bg-white'
              } rounded-full`}
              onClick={() => handleTestConsent(false)}
            >
              비동의
            </button>
            <button
              className={`btn ${
                testConsent === true ? 'btn-primary' : 'btn-outline btn-primary bg-white'
              } rounded-full`}
              onClick={() => handleTestConsent(true)}
            >
              동의
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsentSection;
