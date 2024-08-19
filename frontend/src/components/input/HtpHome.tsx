import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Button from '@/components/button/Button.tsx';

const HtpHome = () => {
  return (
    <main className=" h-full overflow-y-scroll flex flex-col gap-5">
      {/* 지붕 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">지붕</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            공상적인 영역의 상징으로 해석된다. 지붕의 크기가 적절하다면 그만큼 적절한 사고 활동을
            통해 현실을 균형 있게 살고 있다고 할 수 있다.
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-lg">
                <th>표현</th>
                <th>해석</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr className="hover:bg-orange-200">
                <th>지나치게 큰 지붕</th>
                <td>공상에 열중하며 외면적인 대인관계로부터 도피하려는 경향</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>지붕이 허물어지고 금이 가 있는 그림</th>
                <td>
                  자신의 통제력을 완전히 능가한 힘으로 인지해 자신이 압도되었다는 감정으로 나타냄
                </td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>지붕과 기와를 세밀하게 그림</th>
                <td>집착적인 사람</td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>지붕이 흐리고 약한 선</th>
                <td>공상을 통제하는 힘이 약해져 있다는 것</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>강한 필압으로 보강하거나 지붕의 윤곽만을 반복하여 그리는 것</th>
                <td>
                  공상적인 경향이 자신의 통제를 벗어나는 것을 두려워하고 자기를 방어하고자 하는
                  사람에게서 자주 나타남
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>
      {/* 문 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">문</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            문은 피검자의 환경과의 접촉, 대인관계에 대한 태도를 나타낸다.
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-lg">
                <th>표현</th>
                <th>해석</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              <tr className="hover:bg-orange-200">
                <th>작은문</th>

                <td>환경과의 접촉을 꺼리고 우유부단함에 지배되고 있음</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>지나치게 큰 문</th>
                <td>타인에 대한 과도한 의존심</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>열린 문</th>
                <td>외부로부터 정서적인 따뜻함을 얻고 싶어하는 갈망과 노출</td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>문이 생략</th>
                <td>
                  가정환경에서 타인과 접촉하지 않으려는 감정, 외부세계와의 교류를 원치 않는 냉정한
                  사람
                </td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>잠긴문</th>
                <td>자기노출을 매우 꺼려하고 편집증적인 예민성을 지닌 환자에게서 자주 나타남</td>
              </tr>
              <tr className="hover:bg-orange-200">
                <th>문에 자물쇠나 경첩을 붙임</th>
                <td>의심이 많고 방어적임</td>
              </tr>
              <tr className="hover:bg-orange-200">
                <th>이중 문</th>
                <td>
                  가정에서 이중의 역할을 좋아하는 사람들에 의해서 그려진다.
                  <br />
                  배우자를 지키려는 사람들의 경우
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>
      {/* 창문 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">창문</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            창문은 외부환경과 접촉할 수 있는 제2의 통로이다
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-lg">
                <th>표현</th>
                <th>해석</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr className="hover:bg-orange-200">
                <th>창문이 잠겨져 있는 그림</th>
                <td>경계적이고 편집증적인 예민성</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>커튼이나 셔터</th>
                <td>타인과의 접촉을 극도로 꺼림</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>창문의 생략</th>
                <td>철회와 상당한 편집증적 경향성</td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>많은 창문</th>
                <td>개방과 환경적 접촉에 대한 갈망</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>격자가 많은 창문</th>
                <td>회의감, 외부세계로부터 자기를 멀리하려는 것</td>
              </tr>
              {/* row 6 */}
              <tr className="hover:bg-orange-200">
                <th>창문의 틀을 강조함</th>
                <td>구순적 성격의 특징을 나타내는 경우가 많음</td>
              </tr>
              {/* row 7 */}
              <tr className="hover:bg-orange-200">
                <th>창문이 수직선으로 이분되거나 삼각형인 것</th>
                <td>여성생식기에 대한 고착이나 지나친 관심</td>
              </tr>
              {/* row 8 */}
              <tr className="hover:bg-orange-200">
                <th>반원이나 원형의 창</th>
                <td>여성, 신사, 부드러운 사람</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default HtpHome;
