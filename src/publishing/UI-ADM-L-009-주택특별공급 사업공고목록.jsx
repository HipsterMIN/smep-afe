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
        <h2>주택특별공급 사업공고 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>주택특별공급 사업공고 관리</li>
          <li className="on">주택특별공급 사업공고 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="사업유형"
                selectOption=""
                menuSize='150px'
              />
              <MenuInputBox
                menuType="select"
                menuName="지원유형"
                selectOption=""
                menuSize='150px'
              />
              <MenuInputBox
                menuType="select"
                menuName="진행상태"
                selectOption=""
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
                menuType="input"
                menuName="공고명"
                menuSize='300px'
              />
              <MenuInputBox
                menuType="input"
                menuName="지원기관"
                menuSize='150px'
              />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="신청기간" />
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
