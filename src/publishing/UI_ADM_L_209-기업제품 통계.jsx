import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import LineChart from "../components/ui/LineChart.jsx";
import DonutChart from '../components/ui/DonutChart';
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  const chartData = [
    { date: '2025-11-16', val1: 0.8, val2: 4.0, val3: 12.0},
    { date: '2025-11-17', val1: 12.0, val2: 8.0, val3: 15.0},
    { date: '2025-11-18', val1: 2.0, val2: 12.0, val3: 20.0},
    { date: '2025-11-19', val1: 5.0, val2: 40.0, val3: 50.0},
    { date: '2025-11-20', val1: 8.0, val2: 3.0, val3: 70.0},
    { date: '2025-11-21', val1: 9.0, val2: 8.0, val3: 14.0},
  ];

  const data1 = [
    { label: '(주)타나', value: 90 },
    { label: '기타', value: 10 },
  ];
  
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>기업제품 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">기업제품 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="조회기준일" selectOption="" menuSize="150px" />
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
                <span className="infoNumber-tit">등록 건수 총 계</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">추천 수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">문의 수</span>
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
                  { key: 'val1', color: '#1C92FF', label: '등록건수' },
                  { key: 'val2', color: '#00DB99', label: '추천수' },
                  { key: 'val3', color: '#FFB119', label: '문의수' },
                ]}
              />
            </div>
            <div className="ongrid-tableform mask mt-24">
              <GridTable />
            </div>
            {/* donut chart */}
             <div className="onflexrow onchartgroup mt-24">
              <dl>
                <dt>산업구분별 제품등록 통계</dt>
                <dd>
                  <DonutChart
                    data={data1}
                  />
                </dd>
              </dl>
              <dl>
                <dt>기업별 제품등록 통계​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>추천수별 기업 통계​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
