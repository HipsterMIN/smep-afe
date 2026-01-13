import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import RadioButton from '../components/ui/RadioButton.jsx';
import GridTable from '../components/ui/GridTable.jsx';
import MenuInputBox from '../components/ui/MenuInputBox.jsx';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>회원 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li className="on">회원 목록</li>
        </ul>
      </div>

      <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>회원 목록</h4>
            <div className="onselect-form open" style={{minHeight: 'auto'}}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox menuType="select" menuName="회원 구분" menuSize="100px" />
                <MenuInputBox menuType="input" menuName="회원 명" menuSize="150px" />
                <MenuInputBox menuType="select" menuName="상태" menuSize="100px" />

                <div style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" />
                </div>
              </div>
              <div className="onparagraph middle">
                <div className="ondatepickerbox">
                  <DatepickerBox menuName="가입기간" />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
                <div className="ondatepickerbox">
                  <DatepickerBox menuName="등록기간" />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>10</b>건
            </span>
            <Button btnType="add" btnNames="등록" />
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <GridTable />
          </div>
        </div>
    
        <div className="oncontent ontable-form">
          <h4>회원정보 등록/수정(개인)</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>아이디</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>상태</td>
                  <td><MenuInputBox menuType="select" menuSize="100px" /></td>
                </tr>
                <tr>
                  <td>기업 명</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>사업자등록번호</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>유선번호</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>대표전화번호</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="동의"
                        radioName="동의"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="미동의"
                        radioName="미동의"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>SMS 수신동의 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="동의"
                        radioName="동의"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="미동의"
                        radioName="미동의"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>최종 수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>생성일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>최종 로그인 일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>스마트 알림 사용 여부</td>
                  <td>
                    <div className="onflexrow">
                      <div className="onradioBox">
                        <RadioButton
                          groupId="1"
                          radioGroup="group1"
                          radioValue="사용"
                          radioName="사용"
                          selectedValue={selectedValue}
                          onChange={setSelectedValue}
                        />
                        <RadioButton
                          groupId="2"
                          radioGroup="group1"
                          radioValue="사용안함"
                          radioName="사용안함"
                          selectedValue={selectedValue}
                          onChange={setSelectedValue}
                        />
                      </div>
                      <Button btnType="search" btnNames="관심분야설정" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
            <Button btnType="add" btnNames="저장" />
            <Button btnType="del" btnNames="삭제" />
          </div>
        </div>
      </div>
    </div>
  );
}
