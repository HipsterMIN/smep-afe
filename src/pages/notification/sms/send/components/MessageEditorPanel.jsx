/* eslint-disable react/prop-types */
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';
import { useState } from 'react';
import http from '@lib/http.js';

const MESSAGE_TYPE_TITLES = {
  SMS: '단문메시지(SMS)',
  LMS: '장문메시지(LMS)',
};

const PHONE_REGEX = /^01[0-9]{8,9}$/;
const BYTE_LIMIT = { SMS: 90, LMS: 2000 };

function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    byte += str.charCodeAt(i) > 127 ? 3 : 1;
  }
  return byte;
}

function sanitizePhone(value) {
  return value.replace(/[^0-9]/g, '');
}

function MessageEditorBasePanel({
  panelTitle,
  messageType,
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
  onOpenTemplatePopup,
  recipients,
  onRecipientsChange,
  title,
  contents,
  onTitleChange,
  onContentsChange,
}) {
  const [senderPhone, setSenderPhone] = useState('');
  const [scheduledAt, setScheduledAt] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const byteLimit = BYTE_LIMIT[messageType];
  const currentByte = getByteLength(contents);

  const handleAddRecipient = () => {
    const trimName = inputName.trim();
    const trimPhone = sanitizePhone(inputPhone);

    if (!PHONE_REGEX.test(trimPhone)) {
      alert('올바른 휴대전화번호 형식이 아닙니다. (예: 01012345678)');
      return;
    }

    if (recipients.some((r) => r.phoneNo === trimPhone)) {
      alert('이미 추가된 휴대전화번호입니다.');
      return;
    }

    onRecipientsChange([...recipients, { name: trimName, phoneNo: trimPhone }]);
    setInputName('');
    setInputPhone('');
  };

  const handleRemoveRecipient = (phoneNo) => {
    onRecipientsChange(recipients.filter((r) => r.phoneNo !== phoneNo));
  };

  const handleClearRecipients = () => {
    onRecipientsChange([]);
  };

  const handleReset = () => {
    onTitleChange('');
    onContentsChange('');
    setSenderPhone('');
    setScheduledAt(null);
    onSelectedValueChange('즉시발송');
  };

  const handleSend = async () => {
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!contents.trim()) {
      alert('메시지 내용을 입력하세요.');
      return;
    }
    if (currentByte > byteLimit) {
      alert(
        `메시지 내용이 ${byteLimit}Byte를 초과했습니다. (현재 ${currentByte}Byte)`
      );
      return;
    }
    if (recipients.length === 0) {
      alert('수신자를 1명 이상 추가하세요.');
      return;
    }
    if (senderPhone && !/^\d{7,12}$/.test(senderPhone)) {
      alert('발신번호는 숫자만 7~12자리 입력하세요.');
      return;
    }

    const requestBody = {
      title: title.trim(),
      contents: contents.trim(),
      smsKind: messageType,
      senderPhone: senderPhone || null,
      scheduledAt: selectedValue === '예약발송' ? scheduledAt : null,
      recipients: recipients,
    };

    setIsSending(true);
    setSendError(null);

    try {
      const result = await http.post(
        '/api/v1/notification/sms/send',
        requestBody
      );

      if (result.success) {
        alert('발송이 완료되었습니다.');
        onBack();
      } else {
        setSendError(`발송 실패: ${result.errorCode ?? '알 수 없는 오류'}`);
      }
    } catch (err) {
      setSendError(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="onsocialInner">
        <h4>{panelTitle}</h4>
        <div className="onsocialspace">
          <div className="onleft">
            <div className="columnbox">
              <h5>메시지 내용</h5>
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="제목을 입력하세요."
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>

            <div className="columnbox">
              <TextareaBox
                menuSize="100%"
                placeholder="여기에 발송할 메시지를 입력해주세요"
                value={contents}
                onChange={(e) => onContentsChange(e.target.value)}
              />
            </div>

            <div className="columnbox end">
              <em
                style={{ color: currentByte > byteLimit ? 'red' : 'inherit' }}
              >
                {currentByte}/{byteLimit}Byte
              </em>
              <Button btnType="reset" btnNames="초기화" onClick={handleReset} />
              <Button
                btnType="add"
                btnNames="양식 불러오기"
                onClick={onOpenTemplatePopup}
              />
            </div>

            <div className="columnbox grow">
              <Button btnType="event" btnNames="회신번호" />
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="번호를 입력하세요. (미입력 시 기본값 사용)"
                value={senderPhone}
                onChange={(e) => setSenderPhone(sanitizePhone(e.target.value))}
              />
            </div>

            <div className="columnbox row">
              <RadioButton
                groupId="send-now"
                radioGroup="sendSchedule"
                radioValue="즉시발송"
                radioName="즉시발송"
                selectedValue={selectedValue}
                onChange={onSelectedValueChange}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  disabled={selectedValue !== '예약발송'}
                  value={scheduledAt}
                  onChange={(date) => setScheduledAt(date)}
                />
              </div>
              <RadioButton
                groupId="send-reserved"
                radioGroup="sendSchedule"
                radioValue="예약발송"
                radioName="예약발송"
                selectedValue={selectedValue}
                onChange={onSelectedValueChange}
              />
            </div>
          </div>

          <div className="onright">
            <div className="columnbox end">
              <h5>수신자</h5>
              <Button
                btnType="add"
                bgColor="color-gray"
                btnNames="회원목록"
                onClick={onOpenMemberPopup}
              />
              <Button btnType="add" btnNames="엑셀 불러오기" />
            </div>

            <div className="columnbox grow">
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="이름"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="휴대전화번호 (예: 01012345678)"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
              />
              <Button
                btnType="add"
                btnNames="추가"
                onClick={handleAddRecipient}
              />
            </div>

            <div className="columnbox line">
              {recipients.length === 0 && (
                <p
                  style={{ color: '#999', fontSize: '13px', padding: '8px 0' }}
                >
                  수신자를 추가하세요.
                </p>
              )}
              {recipients.map((r) => (
                <p key={r.phoneNo}>
                  <span>{r.name || '(이름 없음)'}</span>
                  <span>{r.phoneNo}</span>
                  <i
                    className="onicon close"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveRecipient(r.phoneNo)}
                  />
                </p>
              ))}
            </div>

            <div className="columnbox space">
              <span>
                발송 총 인원 <b>{recipients.length}명</b>
              </span>
              <Button
                btnType="del"
                btnNames="전체 삭제"
                onClick={handleClearRecipients}
              />
            </div>
          </div>
        </div>
      </div>

      {sendError && (
        <div style={{ color: 'red', padding: '8px 16px', fontSize: '13px' }}>
          {sendError}
        </div>
      )}

      <div className="onflexbtns" style={{ justifyContent: 'space-between' }}>
        <Button btnType="list" btnNames="목록" onClick={onBack} />
        <Button
          btnType="event"
          btnNames={isSending ? '발송 중...' : '발송'}
          disabled={isSending}
          onClick={handleSend}
        />
      </div>
    </>
  );
}

function SmsMessageEditorPanel(props) {
  return (
    <MessageEditorBasePanel
      panelTitle={MESSAGE_TYPE_TITLES.SMS}
      messageType="SMS"
      {...props}
    />
  );
}

function LmsMessageEditorPanel(props) {
  return (
    <MessageEditorBasePanel
      panelTitle={MESSAGE_TYPE_TITLES.LMS}
      messageType="LMS"
      {...props}
    />
  );
}

export default function MessageEditorPanel({
  messageType,
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
  onOpenTemplatePopup,
  recipients,
  onRecipientsChange,
  title,
  contents,
  onTitleChange,
  onContentsChange,
}) {
  const commonProps = {
    selectedValue,
    onSelectedValueChange,
    onBack,
    onOpenMemberPopup,
    onOpenTemplatePopup,
    recipients,
    onRecipientsChange,
    title,
    contents,
    onTitleChange,
    onContentsChange,
  };

  if (messageType === 'LMS') return <LmsMessageEditorPanel {...commonProps} />;
  return <SmsMessageEditorPanel {...commonProps} />;
}
