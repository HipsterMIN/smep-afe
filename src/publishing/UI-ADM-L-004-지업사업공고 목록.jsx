import React, { useState } from 'react';
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import CheckBox from "../components/ui/CheckBox.jsx";
import GridTable from '../components/ui/GridTable';
import SearchBox from '../components/ui/SearchBox';

import Button from '../components/ui/Button';

export default function CommonCode() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>지원사업 공고 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>지원사업 공고관리</li>
          <li className="on">지원사업공고 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open">
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph dashed">
              <MenuInputBox
                menuType="select"
                menuName="연계시스템"
                selectOption="2025"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="select"
                menuName="공개여부"
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
                menuName="공개구분"
                selectOption=""
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="공고명"
                menuSize='200px'
              />
              <MenuInputBox
                menuType="select"
                menuName="공개구분"
                selectOption=""
                menuSize='150px'
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button btnType="detail" btnNames="상세조건 접기" />
              </div>
              <div className="onbtn">
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph column">
              <dl>
                <dt>사업유형</dt>
                <dd>
                  <CheckBox chkId="1_1" chkName="전체" />
                </dd>
                <dd>
                  <CheckBox chkId="1_2" chkName="금융" />
                </dd>
                <dd>
                  <CheckBox chkId="1_3" chkName="기술" />
                </dd>
                <dd>
                  <CheckBox chkId="1_4" chkName="인력" />
                </dd>
                <dd>
                  <CheckBox chkId="1_5" chkName="수출" />
                </dd>
                <dd>
                  <CheckBox chkId="1_6" chkName="내수" />
                </dd>
                <dd>
                  <CheckBox chkId="1_7" chkName="창업" />
                </dd>
                <dd>
                  <CheckBox chkId="1_8" chkName="경영" />
                </dd>
                <dd>
                  <CheckBox chkId="1_9" chkName="소상공인" />
                </dd>
                <dd>
                  <CheckBox chkId="1_10" chkName="중견" />
                </dd>
                <dd>
                  <CheckBox chkId="1_11" chkName="기타" />
                </dd>
              </dl>
              <dl>
                <dt>지원유형</dt>
                <dd>
                  <CheckBox chkId="2_1" chkName="전체" />
                </dd>
                <dd>
                  <CheckBox chkId="2_2" chkName="창업" />
                </dd>
                <dd>
                  <CheckBox chkId="2_3" chkName="기술개발" />
                </dd>
                <dd>
                  <CheckBox chkId="2_3" chkName="정책자금" />
                </dd>
              </dl>
              <dl>
                <dt>지원기관</dt>
                <dd>
                  <CheckBox chkId="3_1" chkName="전체" />
                </dd>
                <dd>
                  <CheckBox chkId="3_2" chkName="중소벤처기업부" />
                </dd>
                <dd>
                  <CheckBox chkId="3_3" chkName="중소벤처기업진흥공단" />
                </dd>
                <dd>
                  <CheckBox chkId="3_4" chkName="중소기업기술정보진흥원" />
                </dd>
                <dd>
                  <CheckBox chkId="3_5" chkName="한국산업은행" />
                </dd>
                <dd>
                  <CheckBox chkId="3_6" chkName="한국수출입은행" />
                </dd>
              </dl>
              
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
