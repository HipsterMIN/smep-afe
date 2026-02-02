import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
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
    { date: '12-1', value: 55 },
    { date: '12-2', value: 55 },
    { date: '12-3', value: 55 },
    { date: '12-4', value: 55 },
    { date: '12-5', value: 55 },
    { date: '12-6', value: 55 },
    { date: '12-7', value: 55 },
    { date: '12-8', value: 55 },
    { date: '12-9', value: 55 },
    { date: '12-10', value: 55 },
    { date: '12-11', value: 55 },
    { date: '12-12', value: 55 },
    { date: '12-13', value: 55 },
    { date: '12-14', value: 55 },
    { date: '12-15', value: 55 },
    { date: '12-16', value: 55 },
    { date: '12-17', value: 55 },
    { date: '12-18', value: 55 },
    { date: '12-19', value: 55 },
    { date: '12-20', value: 55 },
    { date: '12-21', value: 55 },
    { date: '12-22', value: 55 },
    { date: '12-23', value: 55 },
    { date: '12-24', value: 55 },
    { date: '12-25', value: 55 },
    { date: '12-26', value: 55 },
    { date: '12-27', value: 55 },
    { date: '12-28', value: 55 },
    { date: '12-29', value: 55 },
    { date: '12-30', value: 55 },
    { date: '12-31', value: 55 },
    { date: '1-1', value: 55 },
    { date: '1-2', value: 55 },
    { date: '1-3', value: 55 },
    { date: '1-4', value: 55 },
    { date: '1-5', value: 55 },
    { date: '1-6', value: 55 },
    { date: '1-7', value: 55 },
    { date: '1-8', value: 55 },
    { date: '1-9', value: 55 },
    { date: '1-10', value: 55 },
    { date: '1-11', value: 55 },
    { date: '1-12', value: 55 },
    { date: '1-13', value: 55 },
    { date: '1-14', value: 55 },
    { date: '1-15', value: 55 },
    { date: '1-16', value: 55 },
    { date: '1-17', value: 55 },
    { date: '1-18', value: 55 },
    { date: '1-19', value: 55 },
    { date: '1-20', value: 55 },
    { date: '1-21', value: 55 },
    { date: '1-22', value: 55 },
    { date: '1-23', value: 55 },
    { date: '1-24', value: 55 },
    { date: '1-25', value: 55 },
    { date: '1-26', value: 55 },
    { date: '1-27', value: 55 },
    { date: '1-28', value: 55 },
    { date: '1-29', value: 55 },
    { date: '1-30', value: 55 },
    
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
         <h2>정책자금 상담 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">정책자금 상담 통계</li>
        </ul>
      </div>
      <div className="oncontents">
       <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <div className="ondatepickerbox">
                <DatepickerBox menuName="기간" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <div className="onsidebtns">
                <Button btnType="edit" btnNames="전체" />
                <Button btnType="edit" btnNames="일별" />
                <Button btnType="edit" btnNames="월별" />
                <Button btnType="edit" btnNames="검색연도별" />
              </div>
            </div>
        </div>

        <div className="onsection">
          <h3 className="onsubtitle mb-24">정책자금 상담 접수 현황</h3>
          <div className="onstatistics mt-24">
            <div >
              <DateBarChart 
                data={dailyData} 
                legend="정책자금 상담 접수 건 수"
                />
            </div>
          </div>
        </div>

        <div className="onsection">
           <h3 className="onsubtitle mb-24">카테고리 현황</h3>
          <div className="ontableBox">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">중소기업진흥공단</th>
                  <th scope="col">소상공인시장진흥공단</th>
                  <th scope="col">기술보증기금</th>
                  <th scope="col">신용보즘기금</th>
                  <th scope="col">신용보증재단</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right">999,999,999 건​</td>
                  <td className="onbgtxtcenter br-right">999,999,999 건​</td>
                  <td className="onbgtxtcenter br-right">999,999,999 건​</td>
                  <td className="onbgtxtcenter br-right">999,999,999 건​</td>
                  <td className="onbgtxtcenter br-right">999,999,999 건​</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
}
