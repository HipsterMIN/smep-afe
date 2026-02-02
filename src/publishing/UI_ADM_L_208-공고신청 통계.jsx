import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import LineChart from "../components/ui/LineChart.jsx";
import DonutChart from '../components/ui/DonutChart';

export default function CommonCode() {
  const chartData = [
    { date: '2025-11-16', val1: 0.8, val2: 4.0},
    { date: '2025-11-17', val1: 12.0, val2: 8.0},
    { date: '2025-11-18', val1: 2.0, val2: 12.0},
    { date: '2025-11-19', val1: 5.0, val2: 40.0},
    { date: '2025-11-20', val1: 8.0, val2: 3.0},
    { date: '2025-11-21', val1: 9.0, val2: 8.0},
  ];

  const data1 = [
    { label: '전체', value: 30 },
    { label: '금융', value: 12 },
    { label: '기술', value: 12 },
    { label: '인력', value: 12 },
    { label: '수출', value: 12 },
    { label: '내수', value: 12 },
    { label: '창업', value: 12 },
    { label: '경영', value: 12 },
    { label: '소상공인', value: 12 },
    { label: '협업', value: 12 },
  ];
  
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>공고신청 통계​</h2>
        <ul className="onbreadcrumb">
           <li>통계분석</li>
          <li>통계</li>
          <li className="on">공고신청 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
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
                <span className="infoNumber-tit">전체 신청 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">신청 완료 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">직접 신청 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">직접 신청 완료 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">직접 신청 중 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
            </ul>
          </div>
          {/* donut chart */}
          <div className="onstatistics mt-24">
            <div className="onflexrow onchartgroup">
              <dl>
                <dt>주관기관별 신청건수</dt>
                <dd>
                  <DonutChart
                    data={data1}
                  />
                </dd>
              </dl>
              <dl>
                <dt>연계 시스템별 신청건수​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>
            {/* line */}
            <h3 className="onsubtitle mb-24">일별 사업신청 건수</h3>
            <div>
              <LineChart
                data={chartData}
                configurations={[
                  { key: 'val1', color: '#1C92FF', label: '신청건수' },
                  { key: 'val2', color: '#00DB99', label: '직접신청건수' },
                ]}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
