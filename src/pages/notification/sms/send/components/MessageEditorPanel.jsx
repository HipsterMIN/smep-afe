/* eslint-disable react/prop-types */
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';
import { useState } from 'react';
import http from '@lib/http.js';

// ── 상수 ─────────────────────────────────────────────────────────────────────
// MMS 제거
const MESSAGE_TYPE_TITLES = {
  SMS: '단문메시지(SMS)',
  LMS: '장문메시지(LMS)',
};

// BE SmsRecipient: phoneNo ^01[0-9]{8,9}$ 검증
const PHONE_REGEX = /^01[0-9]{8,9}$/;

// BE SmsSendRequest: contents SMS 90Byte / LMS 2000Byte
const BYTE_LIMIT = { SMS: 90, LMS: 2000 };

// UTF-8 바이트 계산 (한글 3Byte, 영문 1Byte)
function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    byte += str.charCodeAt(i) > 127 ? 3 : 1;
  }
  return byte;
}

// 전화번호 하이픈 제거 — BE phoneNo는 숫자만 허용
function sanitizePhone(value) {
  return value.replace(/[^0-9]/g, '');
}

// ── MessageEditorBasePanel ────────────────────────────────────────────────────
function MessageEditorBasePanel({
  panelTitle,
  messageType, // 'SMS' | 'LMS' — byte 제한 분기에 사용
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
  recipients, // [{ name, phoneNo }] — 부모(SmsSendCreate)에서 관리
  onRecipientsChange, // 수신자 목록 변경 콜백
}) {
  // ── 폼 state
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [scheduledAt, setScheduledAt] = useState(null); // 예약발송 일시

  // ── 수신자 직접 입력 state
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');

  // ── 발송 처리 state
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const byteLimit = BYTE_LIMIT[messageType];
  const currentByte = getByteLength(contents);

  // ── 수신자 직접 추가
  const handleAddRecipient = () => {
    const trimName = inputName.trim();
    const trimPhone = sanitizePhone(inputPhone);

    if (!PHONE_REGEX.test(trimPhone)) {
      alert('올바른 휴대전화번호 형식이 아닙니다. (예: 01012345678)');
      return;
    }
    // 중복 방지
    if (recipients.some((r) => r.phoneNo === trimPhone)) {
      alert('이미 추가된 휴대전화번호입니다.');
      return;
    }
    onRecipientsChange([...recipients, { name: trimName, phoneNo: trimPhone }]);
    setInputName('');
    setInputPhone('');
  };

  // ── 수신자 개별 삭제
  const handleRemoveRecipient = (phoneNo) => {
    onRecipientsChange(recipients.filter((r) => r.phoneNo !== phoneNo));
  };

  // ── 수신자 전체 삭제
  const handleClearRecipients = () => {
    onRecipientsChange([]);
  };

  // ── 내용 초기화
  const handleReset = () => {
    setTitle('');
    setContents('');
    setSenderPhone('');
    setScheduledAt(null);
    onSelectedValueChange('즉시발송');
  };

  // ── 발송 버튼
  const handleSend = async () => {
    // 클라이언트 유효성 검증
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

    // BE SmsSendRequest 형태로 직렬화
    const requestBody = {
      title: title.trim(),
      contents: contents.trim(),
      smsKind: messageType, // 'SMS' | 'LMS'
      senderPhone: senderPhone || null, // 미입력 시 null → BE가 yml 기본값 사용
      scheduledAt: selectedValue === '예약발송' ? scheduledAt : null,
      recipients: recipients, // [{ name, phoneNo }]
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
        // BE NotificationResult.errorCode 그대로 표시
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
          {/* ── 왼쪽: 메시지 작성 영역 ── */}
          <div className="onleft">
            {/* 제목 */}
            <div className="columnbox">
              <h5>메시지 내용</h5>
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="제목을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 파일 첨부 영역 제거 — MMS 삭제에 따라 첨부파일 기능 없앰 */}

            {/* 메시지 본문 */}
            <div className="columnbox">
              <TextareaBox
                menuSize="100%"
                placeholder="여기에 발송할 메시지를 입력해주세요"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
              />
            </div>

            {/* 바이트 카운터 / 초기화 / 양식 불러오기 */}
            <div className="columnbox end">
              <em
                style={{ color: currentByte > byteLimit ? 'red' : 'inherit' }}
              >
                {currentByte}/{byteLimit}Byte
              </em>
              <Button btnType="reset" btnNames="초기화" onClick={handleReset} />
              {/* TODO: 양식 불러오기 — 템플릿 목록 조회 API 연동 후 Popup으로 교체 */}
              <Button btnType="add" btnNames="양식 불러오기" />
            </div>

            {/* 발신번호 */}
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

            {/* 즉시/예약 발송 */}
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
                {/* 예약발송 선택 시에만 활성화 */}
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

          {/* ── 오른쪽: 수신자 영역 ── */}
          <div className="onright">
            {/* 수신자 헤더 버튼 */}
            <div className="columnbox end">
              <h5>수신자</h5>
              {/* TODO: onClick → 회원 목록 조회 API 연동 (SmsSendCreate에서 처리) */}
              <Button
                btnType="add"
                bgColor="color-gray"
                btnNames="회원목록"
                onClick={onOpenMemberPopup}
              />
              {/* TODO: 엑셀 업로드 API 연동 — 공통 모듈 완성 후 연동 예정 */}
              <Button btnType="add" btnNames="엑셀 불러오기" />
            </div>

            {/* 수신자 직접 입력 */}
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

            {/* 수신자 목록 */}
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

            {/* 총 인원 / 전체 삭제 */}
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

      {/* 발송 오류 메시지 */}
      {sendError && (
        <div style={{ color: 'red', padding: '8px 16px', fontSize: '13px' }}>
          {sendError}
        </div>
      )}

      {/* 하단 버튼 */}
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

// ── 퍼블 원본 SmsMessageEditorPanel / LmsMessageEditorPanel 구조 유지 ──────────
// MmsMessageEditorPanel 제거
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

// ── export ────────────────────────────────────────────────────────────────────
export default function MessageEditorPanel({
  messageType,
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
  recipients,
  onRecipientsChange,
}) {
  const commonProps = {
    selectedValue,
    onSelectedValueChange,
    onBack,
    onOpenMemberPopup,
    recipients,
    onRecipientsChange,
  };

  // MMS 분기 제거 — SMS/LMS 만 처리
  if (messageType === 'LMS') return <LmsMessageEditorPanel {...commonProps} />;
  return <SmsMessageEditorPanel {...commonProps} />;
}
