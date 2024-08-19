import React, { useState } from 'react';
import SimpleTestBar from '@/components/navigation/SimpleTestBar';
import Button from '@/components/button/Button';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import bernard from '@/assets/bernard.png';
import BernardTestModal from '@/components/modal/BernardTestModal';

const BernardTestPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between">
        <div className="m-10">
          <Button
            label={
              <span className="flex items-center ms-4">
                <IoIosArrowBack />
                <div className="ms-2 mt-0.5">검사 목록 보기</div>
              </span>
            }
            onClick={() => navigate('/simpletest')}
            size="목록보기"
            color="orange"
            shape="rounded"
            textSize="sm"
          />
        </div>
        <SimpleTestBar testName="베르나르 베르베르" />
      </div>
      <div className="mx-72 font-bold text-gray-700 space-y-7 flex flex-col items-center">
        <div className="border bg-orange-100 rounded-md p-5">
          <p>1. 그림을 그릴 수 있는 종이와 펜을 준비하고, 아래 6가지 그림을 먼저 그려주세요.</p>
          <p>2. 6개의 도형들 위에 생각나는 대로 무엇이든지 그려 주세요.</p>
          <p>3. 완성된 6개의 그림을 보고 생각나는 느낌, 생각을 써주세요.</p>
          <p>
            4. 다 그렸다면 <u>결과보기</u> 버튼을 눌러주세요!
          </p>
        </div>

        <img src={bernard} alt="test" className="w-full px-10 py-5" />
        <Button
          label="결과보기"
          textSize="xl"
          size="lg"
          shape="rounded"
          color="orange"
          onClick={() => setIsOpen(true)}
        />
        <BernardTestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
};

export default BernardTestPage;
