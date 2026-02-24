import Button from '@components/ui/Button';
import CheckBox from '@components/ui/CheckBox.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '@components/ui/DatepickerTimeBox.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import React from 'react';

export default function PolicyFinanceList() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>정책금융 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>정책금융 관리</li>
          <li className="on">정책금융 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="연계시스템"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="select"
                menuName="상품유형"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="select"
                menuName="승인여부"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="select"
                menuName="신청방식"
                selectOption=""
                menuSize="150px"
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="select"
                menuName="접수상황"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="select"
                menuName="기업규모"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="select"
                menuName="우대기업유형"
                selectOption=""
                menuSize="150px"
              />
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                menuName="상품명"
                placeholder="사업명을 입력하세요."
              />
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>468</b>개
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="메세지 작성" />
              <Button btnType="add" btnNames="이메일 작성" />
              <Button btnType="list" btnNames="이용 가이드" />
              <Button btnType="add" btnNames="등록" />
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
