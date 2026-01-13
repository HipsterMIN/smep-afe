import { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload  from "../components/ui/FileUpload.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable.jsx';

export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>로그인 정보 수정</h2>
        <ul className="onbreadcrumb">
          <li className="on">로그인 정보 수정</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>권한그룹</td>
                  <td>Placeholder</td>
                </tr>
                <tr>
                  <td>아이디</td>
                  <td>ABC</td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>휴대폰번호</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>현재 비밀번호</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>새 비밀번호</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>새 비밀번호 확인</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>만료일</td>
                  <td>2025-12-10(변경불가)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
          <Button btnType="add" btnNames="저장" />
        </div>
      </div>
    </div>
  );
}
