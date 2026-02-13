import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import React, { useState } from 'react';

export default function IntegrationLoginSiteSort() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>통합로그인 사이트 순서변경</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>통합로그인 사이트 관리</li>
          <li>통합로그인 사이트 목록</li>
          <li className="on">통합로그인 사이트 순서변경</li>
        </ul>
      </div>

      <div className="oncontentbox">
        <div
          className="oncontents"
          style={{ padding: '24px 0px', overflowX: 'hidden' }}
        >
          <div className="ontable-legend">
            <Button btnType="list" btnNames="목록" />
            <Button btnType="add" btnNames="저장" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
