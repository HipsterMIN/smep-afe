import { useState } from 'react';

import Button from '../components/ui/Button.jsx';
import RadioButton from '../components/ui/RadioButton';
import CheckBox from '../components/ui/CheckBox';
import GridTable from '../components/ui/GridTable.jsx';
import MenuInputBox from '../components/ui/MenuInputBox.jsx';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import FileUpload from '../components/ui/FileUpload.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수
  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>팝업 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">배너 목록</li>
        </ul>
      </div>

      <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
          <h4>배너 목록</h4>
            <div className="onselect-form ">
              {' '}
              <div className="onparagraph">
                <MenuInputBox menuType="select" menuName="배너구분" menuSize="100px" />
                <MenuInputBox menuType="input" menuName="제목" menuSize="300px" />
                <div className="ondatepickerbox">
                  <DatepickerBox menuName="게시기간" />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
                <MenuInputBox menuType="select" menuName="사용여부" menuSize="100px" />
                
                <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" />
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
          <h4>배너 등록수정</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>배너구분</td>
                  <td><MenuInputBox menuType="select" menuSize="150px" selectOption="선택" /></td>
                </tr>
                <tr>
                  <td>제목</td>
                  <td><MenuInputBox menuType="input" menuName="제목" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>부제목</td>
                  <td><MenuInputBox menuType="input" menuName="부제목" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>이미지 파일(PC)</td>
                  <td>
                    <div className="onflexcolumn">
                      <FileUpload mode="view" />
                      <MenuInputBox
                        menuType="input"
                        menuName="대체문구"
                        menuSize="300px"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>이미지 파일(태블릿)</td>
                  <td>
                    <div className="onflexcolumn">
                      <FileUpload mode="view" />
                      <MenuInputBox
                        menuType="input"
                        menuName="대체문구"
                        menuSize="300px"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>이미지 파일(모바일)</td>
                  <td>
                    <div className="onflexcolumn">
                      <FileUpload mode="view" />
                      <MenuInputBox
                        menuType="input"
                        menuName="대체문구"
                        menuSize="300px"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>링크</td>
                  <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                </tr>
                <tr>
                  <td>링크타겟</td>
                  <td>
                    <div className="onflexrow">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="현재창"
                        radioName="현재창"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="새창"
                        radioName="새창"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>게시기간</td>
                  <td>
                    <div className="onparagraph">
                      <div className="ondatepickerbox">
                        <DatepickerBox />
                        <span className="onunit">~</span>
                        <DatepickerBox />
                        <CheckBox chkId="1A" chkName="상시사용" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>사용여부</td>
                  <td>
                    <div className="onflexrow">
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns" style={{ justifyContent : 'flex-end' }}>
            <Button btnType="add" btnNames="저장" />
            <Button btnType="del" btnNames="삭제" />
          </div>
        </div>
      </div>
    </div>
  );
}
