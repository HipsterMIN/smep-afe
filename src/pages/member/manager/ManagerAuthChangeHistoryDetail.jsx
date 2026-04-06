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
                <h2>관리자 권한 변경 이력 상세조회</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>회원/권한 관리</li>
                  <li>관리자 관리</li>
                  <li>관리자 계정 관리</li>
                  <li>관리자 권한 변경 이력</li>
                  <li className="on">관리자 권한 변경 이력 상세조회</li>
                </ul>
              </div>
              <div className="oncontents">
                <div className="oncontent ontable-form">
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>권한그룹</td>
                          <td>placeholder</td>
                          <td>아이디</td>
                          <td>ABC123</td>
                        </tr>
                        <tr>
                          <td>기관</td>
                          <td>placeholder</td>
                          <td>이름</td>
                          <td>홍길동</td>
                        </tr>
                        <tr>
                          <td>휴대폰번호</td>
                          <td>010-1234-5678</td>
                          <td>승인여부</td>
                          <td>placeholder</td>
                        </tr>
                        <tr>
                          <td>사용여부</td>
                          <td>유효</td>
                          <td>등록일</td>
                          <td>YYYY-MM-DD HH:DD</td>
                        </tr>
                        <tr>
                          <td>만료일</td>
                          <td rowSpan={3}>YYYY-MM-DD HH:DD</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="ontable-legend">
                    <Button btnType="list" btnNames="목록" />
                  </div>

                  <div className="ongrid-tableform mask">
                    <GridTable />
                  </div>
                </div>
              </div>
            </div>
  );
}
