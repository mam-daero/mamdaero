import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import Button from '@/components/button/Button.tsx';

const HtpTree = () => {
  return (
    <main className=" h-full overflow-y-scroll flex flex-col gap-5">
      {/* 나무 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">나무의 종류</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            전체 나무의 모습은 내면적인 성격의 균형을 반영한다고 보았다.
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
                <th>상록수(소나무, 삼목등)</th>
                <td>
                  자신을 활력이 넘치는 존재로 보며 그와 같이 행동하고 싶다는 소망을 나타냄. 특히
                  삼목을 그리는 사람은 달성욕구가 강하며 자기를 통제하고 질서 정연한 사람인 경우가
                  많다
                </td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>낙엽수</th>
                <td>자신이 외계의 힘에 의해 움직여지고 있다는 감정을 가지고 있는 경우가 많다.</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>버드나무</th>
                <td>
                  밑으로 처지는 가지를 가진 나무를 그리는 사람은 폐쇄적인 경향으로 자기주장이 약한
                  것을 나타냄-우울
                </td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>고목나무</th>
                <td>
                  열등감, 무력감, 우울감, 죄책감, 폐쇄적인 사람, 신경증이나 정신분열증 환자,
                  성범죄자가 적절한 성욕의 대상을 이탈한 경우가 많이 그린다
                </td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>말라죽은 고목</th>
                <td>
                  부적응의 징후, 고목인 경우 말라죽은 이유를 물어보거나(원인이 내부인지 외부인지)
                  말라 죽은지 얼마나 되었는가를 물어봄으로써 피검자의 부적응감, 공허함, 실망감의
                  원인과 어느 정도 계속되었는지 알 수 있다
                </td>
              </tr>
              {/* row 6 */}
              <tr className="hover:bg-orange-200">
                <th>바람으로 인해 잎이 다 떨어져 고목이 된 그림</th>
                <td>
                  피검자의 감수성이 강하고 외부의 압력을 의식하면서도 자신의 통제력이 미치지 못하는
                  느낌
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>
      {/* 줄기 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">줄기</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            성격의 기본 요소에 해당되며 피검자의 감정을 나타낸다.
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
                <th>줄기가 잎 쪽으로 갈수록 급하게 가늘어짐</th>
                <td>
                  유년기의 환경에 따뜻함과 건전한 자극이 없었고 정신적으로 충분히 성숙하지 않은
                  경우가 많다
                </td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>줄기의 끝부분이 더 굵은 것</th>
                <td>병적 징후로 통제하기 힘든 충동이 존재, 자아붕괴</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>현저하게 굵은 줄기</th>
                <td>
                  환경에 대하여 적극적으로 움직이며 현실과 공상에서 공격적으로 행동하려는 경향
                </td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>굽은 나무 줄기</th>
                <td>무력감 부적응</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>전봇대처럼 굵기가 일정한 줄기</th>
                <td>
                  성격은 융통성이 없고 생동감 결여 겉치레만 제일로 여기는 경직된 사람, 지능이 높은
                  사람은 객관성을 중요시하며, 순수한 사고를 하고 추상능력이 높은 것을 나타냄
                </td>
              </tr>
              {/* row 6 */}
              <tr className="hover:bg-orange-200">
                <th>줄기의 뿌리 부분이 지나치게 강조</th>
                <td>
                  느리나 착실한 사람으로 이해력이 둔하다. 줄기의 왼쪽 부분이 큰 경우에는 과거에는
                  고착이 강하며 오른쪽이 큰 경우에는 외계에 대한 불신감, 비협조성을 나타낸다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>

      {/* 가지 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">가지</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            나뭇가지는 주어진 환경으로부터 어떤 만족이나 원하는 바를 성취하려는 것을 표현하며 피검자
            자신이 지닌 능력을 나타낸다. 환경에서 타인과 교섭하며 무엇인가를 달성하고자 하는 힘을
            상징한다.
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
                <th>줄기에서 갈라진 가지가 점차적으로 세분되게 그리는 사람</th>
                <td>감수성이 풍부하고 외계로부터 자극에 잘 반응하는 사람</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>끝으로 갈수록 굵어지는 가지</th>
                <td>
                  외향적, 충동과 본능을 완전히 밖으로 표출해 내며 앞 뒤 생각 없이 함부로 행동하는
                  활동력을 가진 사람
                </td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>줄기에서 곧바로 나온 단선 가지</th>
                <td>
                  학령기 이후 아동의 경우에는 지능과 성격 면에서 가벼운 지체가 있는 것, 성인의
                  경우에는 퇴행
                </td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>가지의 끝이 예리하게 창끝처럼 그려지거나 줄기에 붙은 가시처럼 그려진 것</th>
                <td>비판성과 감수성이 강하며 적의와 공격적 충동이 강함</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>가지가 갈라져 가지의 끝부분이 전혀 닫혀 있지 않은 나무</th>
                <td>
                  자기의 발전과 활동이 억제되어 개방적이며 여러 가지에 흥미를 가지지만 자신의 충동을
                  적절히 통제하지 못함
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>

      {/* 뿌리 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">뿌리</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            뿌리는 피검자가 현실을 지배하는 자신의 능력을 어떻게 인지하고 있는가를 나타낸다
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
                <th>명백히 말라죽은 뿌리</th>
                <td>
                  피검자가 자기의 생활력과 충동을 상실하고 현실을 다루는 일이 잘되지 않는다고 느끼는
                  경우
                </td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>지면을 통해 뿌리가 보이도록 그림</th>
                <td>현실검증력의 장애를 나타냄</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>도화지의 가장자리에 그려진 뿌리</th>
                <td>불안정감, 안정에 대한 욕구를 의미</td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>나무뿌리의 강조</th>
                <td>보통 미성숙이나 ‘뒤돌아 봄’을 의미 ‘뒤돌아 봄’은 성장을 방해</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default HtpTree;
