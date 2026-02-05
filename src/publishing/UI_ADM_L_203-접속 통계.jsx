import { useState } from 'react';
import Button  from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import StackedBarChart from "../components/ui/StackedBarChart.jsx";
import DateBarChart from "../components/ui/DateBarChart.jsx";

export default function CommonCode() {
  const chartData = [
    { label: '더많은 정책사업 조회', visitor: 45000, pageview: 60000 },
    { label: '알림메시지', visitor: 25000, pageview: 85000 },
    { label: 'Home', visitor: 18000, pageview: 42000 },
    { label: '교육', visitor: 15000, pageview: 15000 },
    { label: '행사', visitor: 10000, pageview: 12000 },
  ];

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
        <h2>접속 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">접속 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="사이트" selectOption="" menuSize="200px" />

              <div className="onsidebtns">
                <Button btnType="edit" btnNames="일별" />
                <Button btnType="edit" btnNames="월별" />
                <Button btnType="edit" btnNames="연도별" />
              </div>
            </div>
          </div>

          <div className="ondividegroup">
            <div className="ondividegroup-item">
               <div className="ontableBox">
                <table className="">
                  <colgroup>
                    <col style={{ width: '150px' }} />
                    <col style={{ width: 'auto' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th colSpan={2}>방문자</th>
                      <th colSpan={2}>게시물등록</th>
                      <th colSpan={2}>회원</th>
                    </tr>
                    <tr>
                      <th>구분</th>
                      <th>방문자수</th>
                      <th>구분</th>
                      <th>등록건수</th>
                      <th>가입자수</th>
                      <th>탈퇴자수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">금일</td>
                      <td className="onbgtxtcenter">999,999</td>
                    </tr>
                    <tr>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">금일</td>
                      <td className="onbgtxtcenter">999,999</td>
                    </tr>
                    <tr>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">전체</td>
                      <td className="onbgtxtcenter br-right">999,999</td>
                      <td className="onbgtxtcenter">금일</td>
                      <td className="onbgtxtcenter">999,999</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ondividegroup-item">
              <StackedBarChart
                data={chartData}
                legend={["방문자수", "페이지뷰"]}
                chartTitle="방문 페이지별"
              />
            </div>
          </div>
          
          <h3 className="onsubtitle mb-24">일별 방문자(최근 30일)</h3>
          <div>
              <DateBarChart data={dailyData} legend="일별 방문자(최근 30일)" />
          </div>
        </div>
      </div>
    </div>
  );
}
