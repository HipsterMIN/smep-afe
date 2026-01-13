import { useState } from 'react';

import Button  from "../components/ui/Button.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import FileUpload from '../components/ui/FileUpload';
import TextareaBox  from "../components/ui/TextareaBox.jsx";
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import Popup from '../components/ui/Popup.jsx';
import CheckBox from '../components/ui/CheckBox.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 작성</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li className="on">SMS 작성</li>
        </ul>
      </div>
      <div className="oncontents onsocial">
        <div className="onsocialTab">
          <ul>
            <li>SNS</li>
            <li>LMS</li>
            <li className="active">MMS</li>
          </ul>
        </div>

        <div className="onsocialInner">
          <h4>멀티메시지(MMS)</h4>
          <div className="onsocialspace">
            <div className="onleft">
              <div className="columnbox">
                <h5>메시지 내용</h5>
                <MenuInputBox menuType="input" menuSize="100%" placeholder="제목을 입력하세요." />
              </div>

              <div className="columnbox">
                <Button btnType="addfile" btnNames="파일 선택"/>
                <input type="file" />
                <div className="onflex onflexcolumn">
                  <FileUpload mode="edit"/>
                  <FileUpload mode="edit"/>
                  <FileUpload mode="edit"/>
                </div>
              </div>

              <div className="columnbox">
                <TextareaBox menuSize="100%" placeholder="여기에 발송할 메시지를 입력해주세요" />
              </div>

              <div className="columnbox end">
                <em>{0}/2000Byte</em>
                <Button btnType="reset" btnNames="초기화" />
                <Button btnType="add" btnNames="양식 불러오기" />
              </div>

              <div className="columnbox grow">
                <Button btnType="event" btnNames="회신번호" />
                <MenuInputBox menuType="input" menuSize="100%" placeholder="번호를 입력하세요." />
              </div>

              <div className="columnbox row">
                <RadioButton
                  groupId="1"
                  radioGroup="group1"
                  radioValue="즉시발송"
                  radioName="즉시발송"
                  selectedValue={selectedValue}
                  onChange={setSelectedValue}
                />
                <div className="ondatepickerbox">
                  <DatepickerBox />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
                <RadioButton
                  groupId="2"
                  radioGroup="group1"
                  radioValue="예약발송"
                  radioName="예약발송"
                  selectedValue={selectedValue}
                  onChange={setSelectedValue}
                />
              </div>
            </div>

            <div className="onright">
              <div className="columnbox end">
                <h5>수신자</h5>
                <Button btnType="edit" btnNames="회원목록" />
                <Button btnType="add" btnNames="엑셀 불러오기" />
              </div>

              <div className="columnbox grow">
                <MenuInputBox menuType="input" menuSize="100%" placeholder="이름" />
                <MenuInputBox menuType="input" menuSize="100%" placeholder="휴대전화번호" />
                <Button btnType="add" btnNames="추가" />
              </div>

              <div className="columnbox line">
                <p>
                  <span>홍길동</span>
                  <span>010-1234-5678</span>
                  <i className="onicon close" />
                </p>
                <p>
                  <span>홍길동</span>
                  <span>010-1234-5678</span>
                  <i className="onicon close" />
                </p>
                <p>
                  <span>홍길동</span>
                  <span>010-1234-5678</span>
                  <i className="onicon close" />
                </p>
                <p>
                  <span>홍길동</span>
                  <span>010-1234-5678</span>
                  <i className="onicon close" />
                </p>
              </div>

              <div className="columnbox space">
                <span>발송 총 인원 <b>8명</b></span>
                <Button btnType="del" btnNames="전체 삭제" />
              </div>
            </div>
          </div>
        </div>
        <div className="onflexbtns" style={{ justifyContent: 'space-between' }}>
          <Button btnType="list" btnNames="목록" />
          <Button btnType="event" btnNames="발송" />
        </div>
      </div>

      <Popup title="회원 목록" isBtns={true} autoHeight={true}>
        <div className="ongrid-form" style={{ margin : '0 2px 8px' }}>
          <div className="flexRow">
            <MenuInputBox menuType="input" menuSize="300px" placeholder="검색어를 입력하세요." />
            <Button btnType="search" btnNames="검색" />
          </div>
          <Button btnType="add" btnNames="추가" />
        </div>
        <div className="oncontent ontable-form" style={{ padding : '0' }}>
          <div className="ontableBox onbgtable">
            <table>
              <colgroup>
                <col style={{ width: '60px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>선택</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>ID</td>
                  <td>이름</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>전화번호</td>
                  <td>이메일주소</td>
                </tr>
                <tr>
                  <td><CheckBox chkId="1" /></td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>ABC</td>
                  <td>홍길동</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>010-1234-5678</td>
                  <td>ABC@ABC.CO.KR</td>
                </tr>
                <tr>
                  <td><CheckBox chkId="2" /></td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>ABC</td>
                  <td>홍길동</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>010-1234-5678</td>
                  <td>ABC@ABC.CO.KR</td>
                </tr>
                <tr>
                  <td><CheckBox chkId="3" /></td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>ABC</td>
                  <td>홍길동</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>010-1234-5678</td>
                  <td>ABC@ABC.CO.KR</td>
                </tr>
                <tr>
                  <td><CheckBox chkId="4" /></td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>ABC</td>
                  <td>홍길동</td>
                  <td style={{ borderRight : '1px solid #E1E1E1' }}>010-1234-5678</td>
                  <td>ABC@ABC.CO.KR</td>
                </tr>
               
              </tbody>
            </table>
          </div>
        </div>
      </Popup>

    </div>
  );
}
