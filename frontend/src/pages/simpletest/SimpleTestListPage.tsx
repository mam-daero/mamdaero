import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleTestBar from '@/components/navigation/SimpleTestBar';
import Button from '@/components/button/Button';
const SimpleTestList = () => {
  const navigate = useNavigate();
  const goBernard = () => {
    navigate('bernard');
  };
  const goHTP = () => {
    navigate('htp');
  };
  return (
    <div>
      <SimpleTestBar testName="간단 그림 심리" />
      <div className="mx-72 my-24 space-y-10">
        <div className="collapse  p-4 bg-white border-gray-200 border shadow-md">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title text-3xl font-bold">
            <span className="text-orange-400">베르나르 베르베르</span> 테스트
          </div>
          <div className="collapse-content ">
            <p>
              프랑스 작가 베르나르 베르베르가 만든 심리 그림 분석 도구입니다. 이 검사는 참가자가
              그림을 통해 <strong>무의식적인 심리 상태와 성격적 특성을 탐구</strong>하도록
              설계되었습니다. 그림을 보고 느끼는 감정이나 선택하는 이미지에 따라 자신의 심리적 성향,
              가치관, 무의식의 내면에 대한 통찰을 얻을 수 있습니다.
            </p>
            <div className="text-center mt-6">
              <Button
                onClick={goBernard}
                label="검사 하러가기"
                size="lg"
                textSize="lg"
                color="orange"
              />
            </div>
          </div>
        </div>
        <div className="collapse p-4 bg-white border-gray-200 border shadow-md">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title text-3xl font-bold">
            <span className="text-orange-400">HTP</span> 테스트
          </div>
          <div className="collapse-content ">
            <p>
              이 검사는 집(House), 나무(Tree), 사람(Person) 그림을 그리고, 그림을 통해
              <strong> 심리 상태와 성격 특성</strong>을 분석합니다. 이 검사는 주로 개인의 무의식적인
              감정, 내면의 갈등, 그리고 자아 인식을 탐구하기 위해 사용됩니다.
            </p>
            <div className="text-center mt-6">
              <Button
                onClick={goHTP}
                label="검사 하러가기"
                size="lg"
                textSize="lg"
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestList;
