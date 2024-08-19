const HtpPerson = () => {
  return (
    <main className=" h-full overflow-y-scroll flex flex-col gap-5">
      {/* 머리 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">머리</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            그림에서 머리는 상징적으로 인지적 능력 지적능력 및 공상 활동에 대한 정보를 나타낼 수
            있다.
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
                <th>머리를 그리지 않은 경우</th>
                <td>
                  사고장애, 신경학적 장애, 물건이나 모자 등에 머리가 다 가려지게 그리는 경우 자신의
                  지적 능력에 자신감이 없고 불안감을 느낌
                </td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>큰머리</th>
                <td>
                  아동, 강한 지적노력, 지적 성취에 대한 압박, 공격성, 자기 중심적인 태도, 편집증
                </td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>작은머리</th>
                <td>강박증 환자들, 지적 부족감</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>

      {/* 눈 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">눈</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            다른 사람들과 어떻게 관계를 맺는가에 대한 정보를 제공해주기도 한다.
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
                <th>눈을 그리지 않음</th>
                <td>타인과 감정을 교류하는데 극심한 불안감을 느낌 사고장애의 가능성</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>한쪽 눈만 그림</th>
                <td>감정교류에 있어서 접근과 회피의 양가감정</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>머리카락이나 모자로 눈을 가림</th>
                <td>
                  사회적 불안으로 감정을 표현하고 타인의 감정을 수용하는데 매우 위축되어 있음 다른
                  사람에 대한 적개심
                </td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>눈이 너무 큼</th>
                <td>타인과 정서적 교류에 있어서 지나치게 예민함</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>눈이 너무 작음</th>
                <td>사회적 상호작용에서 위축되고 회피하고자 함. 자아도취</td>
              </tr>
              {/* row 6 */}
              <tr className="hover:bg-orange-200">
                <th>눈을 강조</th>
                <td>
                  감정적 교류에 있어서 불안감과 긴장감 타인과의 상호작용에서 의심이나 방어적 태도,
                  편집증적인 경향성
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>

      {/* 귀 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">귀</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            우리가 정서자극을 수용하고 이에 반응하는 방식에 대해 알 수 있다.
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
                <th>귀를 그리지 않음</th>
                <td>아동, 정서적 교류나 감정표현에 대해 불안하고 자신이 없어함</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>귀가 너무 큼</th>
                <td>대인관계 상황에서 너무 예민함</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>귀가 너무 작음</th>
                <td>정서적 자극을 피하고 싶고 위축되어 있음</td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>귀를 너무 강조</th>
                <td>
                  감정 교륭에 대한 불안감과 긴장감, 다른 사람이 나를 어떻게 생각 하는가에 대한
                  예민함, 타인의 의도에 대한 불신이나 의심
                </td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>귀걸이</th>
                <td>
                  피검자가 외모에 관심이 많음, 너무 정교하다면 타인에게 자신을 과시하고 드러내고
                  싶어하는 자기애적 욕구, 대인관계 불안감을 강박적으로 보상하고자 하는 욕구
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="divider"></div>

      {/* 머리카락 */}
      <section>
        <div className="my-1 ml-3">
          <h1 className="text-3xl text-orange-500">머리카락</h1>
          <h2 className="text-sm text-orange-400 mt-2 break-keep">
            자신의 외모를 어떻게 생각하는지에 대해 얼마나 관심이 많고 이를 얼마나 중요시 하는지
            짐작할 수 있다
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
                <th>단정치 못한 머리</th>
                <td>성적 부도덕 및 통제의 결여</td>
              </tr>
              {/* row 2 */}
              <tr className="hover:bg-orange-200">
                <th>머리의 과장된 세부묘사 강조</th>
                <td>활발한 공상</td>
              </tr>
              {/* row 3 */}
              <tr className="hover:bg-orange-200">
                <th>머리숱이 너무 많고 진함</th>
                <td>
                  성격적으로 지나치게 자신감, 적극적, 자기주장적 행동, 공격적인 태도, 자기애적 성격,
                  히스테리적 성격
                </td>
              </tr>
              {/* row 4 */}
              <tr className="hover:bg-orange-200">
                <th>머리숱이 너무 적음</th>
                <td>성적인 면에서 지나치게 수동적이거나 억제적인 태도</td>
              </tr>
              {/* row 5 */}
              <tr className="hover:bg-orange-200">
                <th>헝클어지거나 단정치 못한 여자머리</th>
                <td>청소년인 경우 성욕에의 충동성, 알콜중독자와 펀집증 여성의 망상에서 보여짐</td>
              </tr>
              {/* row 6 */}
              <tr className="hover:bg-orange-200">
                <th>머리카락에 많은 주의를 기울임</th>
                <td>자기애적, 자기중심적, 자만심이 강함</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default HtpPerson;
