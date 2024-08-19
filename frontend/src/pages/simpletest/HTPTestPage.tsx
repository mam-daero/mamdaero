import React, { useState } from 'react';
import SimpleTestBar from '@/components/navigation/SimpleTestBar';
import Button from '@/components/button/Button';
import { BiSolidHome, BiSolidTree } from 'react-icons/bi';
import { BsPersonRaisedHand } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import HTPTestModal from '@/components/modal/HTPTestModal';
const HTPTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <header className="flex justify-between">
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
        <SimpleTestBar testName="HTP" />
      </header>

      <main className="mx-auto font-bold min-h-[70%] text-gray-700 space-y-11 flex flex-col justify-evenly items-center">
        <section className="border text-lg bg-orange-100 rounded-md p-5">
          <p>1. 그림을 그릴 수 있는 종이와 펜을 준비해주세요.</p>
          <p>2. 집, 나무, 사람 총 3개의 그림을 그려주세요.</p>
          <p>
            3. 3개의 그림을 다 그렸다면 <u>결과보기</u> 버튼을 눌러주세요!
          </p>
        </section>
        <section>
          <div className="flex justify-center">
            <BiSolidHome size="30%" />
            <BiSolidTree size="30%" />
            <BsPersonRaisedHand size="30%" />
          </div>
          <div className="flex justify-center items-center mt-6">
            <Button
              label="결과보기"
              textSize="xl"
              size="lg"
              shape="rounded"
              color="orange"
              onClick={() => setIsOpen(true)}
            />
          </div>
          <HTPTestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </section>
      </main>
    </>
  );
};

export default HTPTestPage;
