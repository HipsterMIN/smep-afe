import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '@components/ui/DatepickerTimeBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import React, { useState } from 'react';

export default function PolicyFinanceForm() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>정책금융 등록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>정책금융 관리</li>
          <li>정책금융 목록</li>
          <li className="on">정책금융 등록</li>
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
                  <td>승인여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="승인"
                        radioName="승인"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="승인대기"
                        radioName="승인대기"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                  <td>접수상황</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                  <td>상품명</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}>
                    <div className="oneditcontent" />
                  </td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                  <td>보증한도</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                </tr>
                <tr>
                  <td>보증비율</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                  <td>보증료율 감면</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                </tr>
                <tr>
                  <td>지원대상자금</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                  <td>신청방식</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="300px" />
                  </td>
                </tr>
                <tr>
                  <td>보증제한대상</td>
                  <td colSpan={3}>
                    <div className="oneditcontent" />
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}>
                    <div className="oneditcontent" />
                  </td>
                </tr>
                <tr>
                  <td>신청기간(일시)</td>
                  <td colSpan={3}>
                    <div className="ondatepickerbox">
                      <DatepickerBox />
                      <DatepickerTimeBox />
                      <span className="onunit">~</span>
                      <DatepickerBox />
                      <DatepickerTimeBox />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>상세 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>문의 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>신청 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>첨부파일 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="1_1" chkName="예비창업" />
                      <CheckBox chkId="1_2" chkName="소상공인" />
                      <CheckBox chkId="1_3" chkName="중소기업" />
                    </div>
                  </td>
                  <td>업종</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>우대기업 유형</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                  <td>상품종류</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>기업규모 요약</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                  <td>지원대상자금(용도) 요약</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>보증비율 요약코드</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                  <td>보증비율 요약</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="100%" />
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td></td>
                  <td>등록일시</td>
                  <td></td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td></td>
                  <td>최종 수정일시</td>
                  <td></td>
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
