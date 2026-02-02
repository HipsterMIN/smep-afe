import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import LineChart from "../components/ui/LineChart.jsx";
import DonutChart from '../components/ui/DonutChart';
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  const chartData = [
    { date: '2025-11-16', val1: 0.8, val2: 4.0,},
    { date: '2025-11-17', val1: 12.0, val2: 8.0,},
    { date: '2025-11-18', val1: 2.0, val2: 12.0,},
    { date: '2025-11-19', val1: 5.0, val2: 40.0,},
    { date: '2025-11-20', val1: 8.0, val2: 3.0,},
    { date: '2025-11-21', val1: 9.0, val2: 8.0,},
  ];

  const data1 = [
    { label: 'null', value: 50 },
    { label: '대중소기업농어업협력재단', value: 50 },
  ];
  
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>제안관리 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">제안관리 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="구분" selectOption="" menuSize="150px" />
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
          <div className="infoNumber-box">
            <ul className="infoNumber-list">
              <li className="infoNumber-item">
                <span className="infoNumber-tit">총계</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">미 답변</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">답변 완료</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">만족도 조사참여</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">평균만족도</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
            </ul>
          </div>
          {/* donut chart */}
          <div className="onstatistics mt-24">
            {/* line */}
            <div>
              <LineChart
                data={chartData}
                configurations={[
                  { key: 'val1', color: '#1C92FF', label: '제안건수' },
                  { key: 'val2', color: '#00DB99', label: '평균만족도' },
                ]}
              />
            </div>
            <div className="ongrid-tableform mask mt-24">
              <GridTable />
            </div>
            {/* donut chart */}
             <div className="onflexrow onchartgroup mt-24">
              <dl>
                <dt>담당기관별 제안 통계</dt>
                <dd>
                  <DonutChart
                    data={data1}
                  />
                </dd>
              </dl>
              <dl>
                <dt>담당기관별 제안처리율</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>담당기관별 제안미처리율​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
