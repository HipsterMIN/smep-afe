import React, { useState } from 'react';
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import CheckBox from "../components/ui/CheckBox.jsx";
import GridTable from '../components/ui/GridTable';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '../components/ui/DatepickerTimeBox.jsx';

import Button from '../components/ui/Button';

export default function CommonCode() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 정보 목록</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li>증명서 정보 관리</li>
          <li className="on">증명서 정보 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
                <MenuInputBox
                menuType="input"
                menuName="증명서"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="소관기관"
                menuSize='150px'
              />
               <MenuInputBox
                menuType="input"
                menuName="발급기관"
                menuSize='150px'
              />
               <MenuInputBox
                menuType="select"
                menuName="공개여부"
                selectOption=""
                menuSize='150px'
              />
              <div style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
               <MenuInputBox
                menuType="select"
                menuName="직접발급 여부"
                selectOption=""
                menuSize='150px'
              />
             <MenuInputBox
                menuType="select"
                menuName="전자증명서 대상여부"
                selectOption=""
                menuSize='150px'
              />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="등록일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>468</b>개
            </span>
            <Button btnType="add" btnNames="등록" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
