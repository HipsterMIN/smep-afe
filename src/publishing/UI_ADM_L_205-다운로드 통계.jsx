import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>다운로드 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">다운로드 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="메뉴" menuSize="200px" />
              <MenuInputBox menuType="input" menuName="사유" menuSize="300px" />
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

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
