import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import React, { useState } from 'react';

export default function IntegrationLoginSiteForm() {
  const [prtlSysExpsrYn, setPrtlSysExpsrYn] = useState(null); // radio button 분기변수
  const [useYn, setUseYn] = useState(null); // radio button 분기변수
  const [inkUseTrgtSeCd, setInkUseTrgtSeCd] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>통합로그인 사이트 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>통합로그인 사이트 관리</li>
          <li>통합로그인 사이트 목록</li>
          <li className="on">통합로그인 사이트 등록/수정</li>
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
                  <td>
                    <MenuInputBox menuType="input" menuSize="150px" />
                  </td>
                  <td>사이트명</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="150px" />
                  </td>
                </tr>
                <tr>
                  <td>사이트 설명</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                </tr>
                <tr>
                  <td>사이트 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                </tr>
                <tr>
                  <td>관리기관 명</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                  <td>담당자 명</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                </tr>
                <tr>
                  <td>노출여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group1_1"
                        radioGroup="group1"
                        radioValue="노출"
                        radioName="노출"
                        selectedValue={prtlSysExpsrYn}
                        onChange={setPrtlSysExpsrYn}
                      />
                      <RadioButton
                        groupId="group1_2"
                        radioGroup="group1"
                        radioValue="노출 안함"
                        radioName="노출 안함"
                        selectedValue={prtlSysExpsrYn}
                        onChange={setPrtlSysExpsrYn}
                      />
                    </div>
                  </td>
                  <td>사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group2_1"
                        radioGroup="group2"
                        radioValue="사용"
                        radioName="사용"
                        selectedValue={useYn}
                        onChange={setUseYn}
                      />
                      <RadioButton
                        groupId="group2_2"
                        radioGroup="group2"
                        radioValue="사용 안함"
                        radioName="사용 안함"
                        selectedValue={useYn}
                        onChange={setUseYn}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>회원구분</td>
                  <td colSpan={3}>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group3_1"
                        radioGroup="group3"
                        radioValue="개인"
                        radioName="개인"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                      <RadioButton
                        groupId="group3_2"
                        radioGroup="group3"
                        radioValue="기업"
                        radioName="기업"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                      <RadioButton
                        groupId="group3_3"
                        radioGroup="group3"
                        radioValue="모든 회원"
                        radioName="모든 회원"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                    </div>
                  </td>
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
