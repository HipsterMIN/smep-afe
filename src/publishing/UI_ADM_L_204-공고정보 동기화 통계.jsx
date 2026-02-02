import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';


export default function CommonCode() {

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

        </div>
      </div>
    </div>
  );
}
