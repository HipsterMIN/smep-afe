import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import MessageEditorPanel from '@pages/notification/sms/send/components/MessageEditorPanel.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MESSAGE_TYPES = ['SMS', 'LMS', 'MMS'];
const TAB_BUTTON_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
};

export default function SmsSendCreate() {
  const [selectedValue, setSelectedValue] = useState('즉시발송');
  const [activeMessageType, setActiveMessageType] = useState('MMS');
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const navigate = useNavigate();

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
            {MESSAGE_TYPES.map((type) => (
              <li key={type} className={activeMessageType === type ? 'active' : ''}>
                <button
                  type="button"
                  style={TAB_BUTTON_STYLE}
                  onClick={() => setActiveMessageType(type)}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <MessageEditorPanel
          messageType={activeMessageType}
          selectedValue={selectedValue}
          onSelectedValueChange={setSelectedValue}
          onBack={() => navigate('..')}
          onOpenMemberPopup={() => setIsMemberPopupOpen(true)}
        />
      </div>

      {isMemberPopupOpen && (
        <Popup
          title="회원 목록"
          autoHeight={true}
          onClose={() => setIsMemberPopupOpen(false)}
        >
          <div className="ongrid-form" style={{ margin: '0 2px 8px' }}>
            <div className="flexRow">
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                placeholder="검색어를 입력하세요."
              />
              <Button btnType="search" btnNames="검색" />
            </div>
            <Button btnType="add" btnNames="추가" />
          </div>
          <div className="oncontent ontable-form" style={{ padding: '0' }}>
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
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>ID</td>
                    <td>이름</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>
                      전화번호
                    </td>
                    <td>이메일주소</td>
                  </tr>
                  <tr>
                    <td>
                      <CheckBox chkId="1" />
                    </td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                    <td>홍길동</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>
                      010-1234-5678
                    </td>
                    <td>ABC@ABC.CO.KR</td>
                  </tr>
                  <tr>
                    <td>
                      <CheckBox chkId="2" />
                    </td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                    <td>홍길동</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>
                      010-1234-5678
                    </td>
                    <td>ABC@ABC.CO.KR</td>
                  </tr>
                  <tr>
                    <td>
                      <CheckBox chkId="3" />
                    </td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                    <td>홍길동</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>
                      010-1234-5678
                    </td>
                    <td>ABC@ABC.CO.KR</td>
                  </tr>
                  <tr>
                    <td>
                      <CheckBox chkId="4" />
                    </td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                    <td>홍길동</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>
                      010-1234-5678
                    </td>
                    <td>ABC@ABC.CO.KR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
