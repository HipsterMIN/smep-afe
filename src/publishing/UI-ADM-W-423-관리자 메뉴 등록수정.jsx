import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import RadioButton from '../components/ui/RadioButton.jsx';
import GridTable from '../components/ui/GridTable.jsx';
import MenuInputBox from '../components/ui/MenuInputBox.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>관리자 메뉴 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>관리자 메뉴관리</li>
          <li className="on">관리자 메뉴목록</li>
        </ul>
      </div>

      <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>메뉴 목록</h4>
            <div className="onselect-form open" style={{minHeight: 'auto'}}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="input"
                  menuName="메뉴ID"
                  menuSize="150px"
                  placeholder="ID 입력"
                />
                <MenuInputBox
                  menuType="input"
                  menuName="메뉴명"
                  menuSize="300px"
                />
                <div style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" />
                </div>
              </div>
              <div className="onparagraph middle"> 
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  menuName="URL"
                />
                <MenuInputBox
                  menuType="select"
                  menuName="유형"
                  selectOption="Y"
                />
                <MenuInputBox
                  menuType="select"
                  menuName="사용여부"
                  selectOption="전체"
                />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>10</b>건
            </span>
            <div className="onbtns">
              <button className="onallopen-ico"/>
              <button className="onallclose-ico"/>
            </div>
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <GridTable/>
          </div>
        </div>
    
        <div className="oncontent ontable-form">
          <h4>메뉴 등록/수정</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>메뉴 ID</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>메뉴 명</td>
                  <td><MenuInputBox menuType="select" menuSize="100px" /></td>
                </tr>
                <tr>
                  <td>상위메뉴</td>
                  <td>시스템 관리 {'>'} 시스템 설정 {'>'} 게시판 관리</td>
                </tr>
                <tr>
                  <td>유형</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="그룹메뉴"
                        radioName="그룹메뉴"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="화면"
                        radioName="화면"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>전시 순서</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>URL</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>유형</td>
                  <td>
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
                        radioValue="사용 안함"
                        radioName="사용 안함"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>최종수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
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
