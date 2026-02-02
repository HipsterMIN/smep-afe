import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import LineChart from "../components/ui/LineChart.jsx";
import GridTable from '../components/ui/GridTable';
import DonutChart from '../components/ui/DonutChart';

export default function CommonCode() {
  const chartData = [
    { date: '2025-11-16', val1: 100, val2: 50, val3: 50 },
    { date: '2025-11-17', val1: 203, val2: 50, val3: 100 },
    { date: '2025-11-18', val1: 440, val2: 100, val3: 300 },
    { date: '2025-11-19', val1: 500, val2: 500, val3: 600 },
    { date: '2025-11-20', val1: 600, val2: 1000, val3: 600 },
    // ... 더 많은 데이터
    { date: '2025-12-14', val1: 900, val2: 700, val3: 500 },
  ];

  const data1 = [
    { label: 'ID/PW 인증', value: 50 },
    { label: '공인인증서 인증', value: 20 },
    { label: 'SMS 인증', value: 30 },
  ];
  
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>인증수단별 통계​</h2>
        <ul className="onbreadcrumb">
           <li>통계분석</li>
          <li>통계</li>
          <li className="on">인증수단별 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="회원구분" selectOption="" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="구분" selectOption="" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="성별" selectOption="" menuSize="150px" />
              
              <div className="ondatepickerbox">
                <DatepickerBox menuName="기간" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
  
              <div className=""  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
        </div>

        <div className="onsection">
          <div>
             <LineChart
                data={chartData}
                configurations={[
                  { key: 'val1', color: '#1C92FF', label: 'ID/PW 인증' },
                  { key: 'val2', color: '#FFB119', label: '공인인증서 인증' },
                  { key: 'val3', color: '#00DB99', label: 'SMS 인증' }
                ]}
              />
          </div>
        </div>

        <div className="onsection">
          <h3 className="onsubtitle mb-24">최근 1개월 통계</h3>
          <div className="ongrid-tableform mask">
            <GridTable />
          </div>

          {/* donut chart */}
           <div className="onstatistics mt-24">
            <div className="onflexrow onchartgroup">
              <dl>
                <dt>인증수단별 사용비율</dt>
                <dd>
                  <DonutChart
                    data={data1}
                  />
                </dd>
              </dl>
              <dl>
                <dt>인증수단 개인회원 총 사용비율​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>인증수단 기업회원 총 사용비율</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
