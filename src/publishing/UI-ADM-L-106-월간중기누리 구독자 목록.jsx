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
        <h2>월간중기누리 구독자 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>활용정보 관리</li>
          <li>월간중기누리</li>
          <li className="on">월간중기누리 구독자 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="구독자명"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="이메일"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="휴대전화 번호"
                menuSize='150px'
              />
               <MenuInputBox
                menuType="select"
                menuName="회원구분"
                selectOption=""
                menuSize='150px'
              />
               <MenuInputBox
                menuType="select"
                menuName="수신동의"
                selectOption=""
                menuSize='150px'
              />
              <div style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <div className="ondatepickerbox">
                <DatepickerBox menuName="구독신청일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <div className="ondatepickerbox">
                <DatepickerBox menuName="수신거부일" />
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
