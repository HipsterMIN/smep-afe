import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload  from "../components/ui/FileUpload.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable.jsx';
import SearchBox from '../components/ui/SearchBox.jsx';

export default function CommonCode() {
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
        <div className="oncontents" style={{ padding : '24px 0px', overflowX : 'hidden' }}>
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
