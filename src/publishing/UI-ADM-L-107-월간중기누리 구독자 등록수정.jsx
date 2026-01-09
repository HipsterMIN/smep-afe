import { useState } from 'react';

import RadioButton  from "../components/ui/RadioButton.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import Button from '../components/ui/Button';
import GridTable from '../components/ui/GridTable';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import Popup from '../components/ui/Popup.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>월간중기누리 구독자 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>활용정보 관리</li>
          <li>월간중기누리</li>
          <li className="on">월간중기누리 구독자 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="구독자명"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="이메일"
                menuSize='150px'
              />
              <MenuInputBox
                menuType="input"
                menuName="휴대전화 번호"
                menuSize='150px'
              />
               <MenuInputBox
                menuType="select"
                menuName="회원구분"
                selectOption=""
                menuSize='150px'
              />
               <MenuInputBox
                menuType="select"
                menuName="수신동의"
                selectOption=""
                menuSize='150px'
              />
              <div style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <div className="ondatepickerbox">
                <DatepickerBox menuName="구독신청일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <div className="ondatepickerbox">
                <DatepickerBox menuName="수신거부일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
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

      <Popup title="월간중기누리 구독자 등록/수정" isBtns={true}>
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>구독자 명</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>휴대전화 번호</td>
                  <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                </tr>
                <tr>
                  <td>회원구분</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="id1"
                        radioGroup="group1"
                        radioValue="회원"
                        radioName="회원"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="id2"
                        radioGroup="group1"
                        radioValue="비회원"
                        radioName="비회원"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>수신여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="id3"
                        radioGroup="group2"
                        radioValue="수신"
                        radioName="수신"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="id4"
                        radioGroup="group2"
                        radioValue="미수신"
                        radioName="미수신"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>구독신청일시</td>
                  <td>
                    <DatepickerBox />
                  </td>
                </tr>
                <tr>
                  <td>등록자/일시</td>
                  <td>등록자 YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>수정자/일시</td>
                  <td>수정자 YYYY-MM-DD HH:MM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="btns">
          <Button btnType="list" btnNames="닫기" />
          <Button btnType="add" btnNames="저장" />
        </div>
      </Popup>
    </div>
  );
}
