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
                <h2>통합로그인 사이트 상세조회</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>회원/권한 관리</li>
                  <li>통합로그인 사이트 관리</li>
                  <li>통합로그인 사이트 목록</li>
                  <li className="on">통합로그인 사이트 상세조회</li>
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
                          <td>사이트코드</td>
                          <td>placeholder</td>
                          <td>사이트명</td>
                          <td>placeholder</td>
                        </tr>
                        <tr>
                          <td>사이트 설명</td>
                          <td colSpan={3}>placeholder</td>
                        </tr>
                        <tr>
                          <td>사이트 URL</td>
                          <td colSpan={3}>placeholder</td>
                        </tr>
                        <tr>
                          <td>관리기관 명</td>
                          <td>placeholder</td>
                          <td>담당자 명</td>
                          <td>placeholder</td>
                        </tr>
                        <tr>
                          <td>노출여부</td>
                          <td>placeholder</td>
                          <td>사용여부</td>
                          <td>placeholder</td>
                        </tr>
                        <tr>
                          <td>회원구분</td>
                          <td colSpan={3}>placeholder</td>
                        </tr>
                        <tr>
                          <td>등록일시</td>
                          <td>YYYY-MM-DD HH:DD</td>
                          <td>등록자</td>
                          <td>placeholder</td>
                        </tr>
                        <tr>
                          <td>최종수정일시</td>
                          <td colSpan={3}>YYYY-MM-DD HH:DD</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="ontable-legend">
                    <Button btnType="list" btnNames="목록" />
                    <Button btnType="edit" btnNames="수정" />
                  </div>
                </div>
              </div>
            </div>
  );
}
