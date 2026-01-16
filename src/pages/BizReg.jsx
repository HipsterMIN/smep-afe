import { useState } from 'react';
import Button from '../components/ui/Button';
import MenuInputBox from '../components/ui/MenuInputBox';
import RadioButton from '../components/ui/RadioButton';

export default function BizReg() {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>사업정보 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li className="on">사업정보 관리</li>
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
                  <td>사업ID</td>
                  <td>ABC1234</td>
                  <td>스크랩수</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>사업년도</td>
                  <td>
                    <MenuInputBox menuType="select" selectOption="2025" />
                  </td>
                  <td>공개여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="A"
                        radioName="공개"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="B"
                        radioName="비공개"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="3"
                        radioGroup="group2"
                        radioValue="disable"
                        radioName="미사용"
                        disabled={true}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>2025-03-26 14:32:35</td>
                  <td>최종수정일시</td>
                  <td>2025-03-26 14:32:35</td>
                </tr>
                <tr>
                  <td>사업유형(정책분류)</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="150px"
                      selectOption="2025"
                    />
                  </td>
                  <td>지원기관</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="150px"
                      selectOption="중소벤처기업부"
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업구분</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="select"
                      menuSize="150px"
                      selectOption="2025"
                    />
                  </td>
                </tr>
                <tr>
                  <td>순번</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="380px"
                      placeholder="검색어를 입력하세요."
                    />
                    <span className="onsubinfo">
                      ※ 엑셀파일의 POLICY_INDEX를 입력해 주세요.
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업정보</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>사업ID</td>
                  <td className="br-right">ABC1234</td>
                  <td className="noneBg">2</td>
                </tr>
                <tr>
                  <td>콘텐츠</td>
                  <td colSpan={2}>
                    <div className="oneditcontent" />
                  </td>
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
          <Button btnType="edit" btnNames="수정" />
          <Button btnType="add" btnNames="등록" />
        </div>
      </div>
    </div>
  );
}
