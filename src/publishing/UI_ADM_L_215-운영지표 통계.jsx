import Button from "../components/ui/Button.jsx";
import DateBarChart from "../components/ui/DateBarChart.jsx";
export default function CommonCode() {
  const dailyData = [
  { date: '11-1', value: 5 },
  { date: '11-2', value: 52 },
  { date: '11-3', value: 45 },
  { date: '11-4', value: 38 },
  { date: '11-5', value: 55 },
  { date: '11-6', value: 55 },
  { date: '11-7', value: 55 },
  { date: '11-8', value: 55 },
  { date: '11-9', value: 5 },
  { date: '11-10', value: 52 },
  { date: '11-18', value: 45 },
  { date: '11-19', value: 38 },
  { date: '11-20', value: 55 },
  { date: '11-21', value: 55 },
  { date: '11-22', value: 55 },
  { date: '11-23', value: 55 },
  { date: '11-24', value: 55 },
  { date: '11-25', value: 55 },
  { date: '11-26', value: 55 },
  { date: '11-27', value: 55 },
  { date: '11-28', value: 55 },
  { date: '11-29', value: 55 },
  { date: '11-30', value: 55 },
];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>운영지표 통계</h2>

        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">운영지표 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
              {/** open 클래스로 동작, 펼치기/접기 */}
              <div className="onparagraph">
                <div className="onsidebtns">
                  <Button btnType="edit" btnNames="일별" />
                  <Button btnType="edit" btnNames="월별" />
                  <Button btnType="edit" btnNames="검색연도별" />
                </div>
              </div>
            </div>
          </div>

          <div className="ontableBox mt-24">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" colSpan={5}>개인회원</th>
                  <th scope="col" colSpan={4}>기업회원</th>
                </tr>
                <tr>
                  <th scope="col">날짜</th>
                  <th scope="col">회원</th>
                  <th scope="col">비회원</th>
                  <th scope="col">탈퇴회원</th>
                  <th scope="col">총개인회원</th>
                  <th scope="col">개인사업자</th>
                  <th scope="col">법인사업자</th>
                  <th scope="col">탈퇴기업</th>
                  <th scope="col">중기업회원</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                  <td className="onbgtxtcenter br-right">99,999</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontableBox mt-24">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" colSpan={10}>통합플랫폼</th>
                  <th scope="col" colSpan={2}>대민통합</th>
                </tr>
                <tr>
                  <th scope="col" colSpan={3}>회원가입</th>
                  <th scope="col" colSpan={3}>방문자</th>
                  <th scope="col" colSpan={4}>운영현황(YYYY-MM-DD ~ YYYY-MM-DD)</th>
                  <th scope="col" rowSpan={2}>방문자</th>
                  <th scope="col" rowSpan={2}>누적방문자</th>
                </tr>
                <tr>
                  <th scope="col">개인</th>
                  <th scope="col">기업</th>
                  <th scope="col">합계</th>
                  <th scope="col">방문자</th>
                  <th scope="col">누적방문자</th>
                  <th scope="col">7000만돌파</th>
                  <th scope="col">누적회원</th>
                  <th scope="col">신규가입건수</th>
                  <th scope="col">주간접속건수</th>
                  <th scope="col">누적접속건수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">YYYY-MM-DD</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">999</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ display : 'flex', justifyContent : 'space-between', alignItems : 'center' }}>
            <div style={{ width : '100%' }}>
              <h3 className="onsubtitle mb-24">개인회원 운영지표</h3>
              <div>
                  <DateBarChart data={dailyData} legend="개인회원 운영지표" />
              </div>
            </div>

            <div style={{ width : '100%' }}>
              <h3 className="onsubtitle mb-24">기업회원 운영지표</h3>
              <div>
                  <DateBarChart data={dailyData} legend="기업회원 운영지표" />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
