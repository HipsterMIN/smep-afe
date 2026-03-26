import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';
import DateBarChart from "../components/ui/DateBarChart.jsx";

export default function CommonCode() {
  const dailyData = [
    { date: '중소가업기술정보진흥원1', value: 20 },
    { date: '중소가업기술정보진흥원2', value: 38 },
    { date: '중소가업기술정보진흥원3', value: 62 },
    { date: '중소가업기술정보진흥원4', value: 41 },
    { date: '중소가업기술정보진흥원5', value: 17 },
    { date: '중소가업기술정보진흥원6', value: 80 },
    { date: '중소가업기술정보진흥원7', value: 80 },
    { date: '중소가업기술정보진흥원8', value: 80 },
    { date: '중소가업기술정보진흥원9', value: 80 },
    { date: '중소가업기술정보진흥원10', value: 80 },
    { date: '중소가업기술정보진흥원11', value: 32 },
    { date: '중소가업기술정보진흥원12', value: 42 },
    { date: '중소가업기술정보진흥원13', value: 11 },
    { date: '중소가업기술정보진흥원14', value: 2 },
    { date: '중소가업기술정보진흥원15', value: 5 },
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>공고정보 동기화 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">공고정보 동기화 통계</li>
        </ul>
      </div>
      <div className="oncontents">
       <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="연도" selectOption="" menuSize="200px" />

              <div style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <h3 className="onsubtitle">기간별 전체공고</h3>
          <div className="infoNumber-box">
            <ul className="infoNumber-list">
              <li className="infoNumber-item">
                <span className="infoNumber-tit">진행중인 공고 수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">등록 공고 수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
            </ul>
          </div>

          <div className="onsection">
            <h3 className="onsubtitle mb-24">기관별 공고</h3>
            <div className="onflex">
              <div className="ongridbox">
                <div className="ongrid-tableform " style={{ width: '640px', flexGrow : '1' }}>
                  <GridTable />
                </div>
                <div className="ongrid-tableform " style={{ width: '640px', flexGrow : '1' }}>
                  <GridTable />
                </div>
              </div>
            </div>
          </div>

          <div className="onsection">
            <h3 className="onsubtitle mb-24">공고 매핑 건수</h3>
            <div className="ongrid-tableform mask">
              <GridTable />
            </div>
          </div>

          <div className="onsection">
            <h3 className="onsubtitle mb-24">기관별 공고 현황</h3>
            <div>
              <DateBarChart data={dailyData} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
