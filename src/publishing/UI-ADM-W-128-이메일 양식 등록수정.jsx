import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload2  from "../components/ui/FileUpload2.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 양식 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li>이메일 양식 목록</li>
          <li className="on">이메일 양식 등록/수정</li>
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
                  <td>양식ID</td>
                  <td>아이디</td>
                </tr>
                <tr>
                  <td>양식명</td>
                  <td>제목</td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td><div className="oneditcontent"></div></td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td>
                    <Button btnType="addfile" btnNames="파일 선택"/>
                    <input type="file" />
                    <div className="onflex onflexcolumn">
                      <FileUpload2 mode="edit"/>
                      <FileUpload2 mode="edit"/>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>작성자</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>작성일</td>
                  <td>2025-12-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" />
          </div>
          <Button btnType="del" btnNames="삭제" />
          <Button btnType="add" btnNames="저장" />
        </div>
      </div>
    </div>
  );
}
