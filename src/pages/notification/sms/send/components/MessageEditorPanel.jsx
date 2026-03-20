/* eslint-disable react/prop-types */
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';

const MESSAGE_TYPE_TITLES = {
  SMS: '단문메시지(SMS)',
  LMS: '장문메시지(LMS)',
  MMS: '멀티메시지(MMS)',
};

function MessageEditorBasePanel({
  panelTitle,
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
}) {
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
              />
            </div>

            <div className="columnbox">
              <Button btnType="addfile" btnNames="파일 선택" />
              <input type="file" />
              <div className="onflex onflexcolumn">
                <FileUpload mode="edit" />
                <FileUpload mode="edit" />
                <FileUpload mode="edit" />
              </div>
            </div>

            <div className="columnbox">
              <TextareaBox
                menuSize="100%"
                placeholder="여기에 발송할 메시지를 입력해주세요"
              />
            </div>

            <div className="columnbox end">
              <em>{0}/2000Byte</em>
              <Button btnType="reset" btnNames="초기화" />
              <Button btnType="add" btnNames="양식 불러오기" />
            </div>

            <div className="columnbox grow">
              <Button btnType="event" btnNames="회신번호" />
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="번호를 입력하세요."
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
                <DatepickerBox />
                <span className="onunit">~</span>
                <DatepickerBox />
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
              />
              <MenuInputBox
                menuType="input"
                menuSize="100%"
                placeholder="휴대전화번호"
              />
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
              <span>
                발송 총 인원 <b>8명</b>
              </span>
              <Button btnType="del" btnNames="전체 삭제" />
            </div>
          </div>
        </div>
      </div>

      <div className="onflexbtns" style={{ justifyContent: 'space-between' }}>
        <Button btnType="list" btnNames="목록" onClick={onBack} />
        <Button btnType="event" btnNames="발송" />
      </div>
    </>
  );
}

function SmsMessageEditorPanel(props) {
  return (
    <MessageEditorBasePanel panelTitle={MESSAGE_TYPE_TITLES.SMS} {...props} />
  );
}

function LmsMessageEditorPanel(props) {
  return (
    <MessageEditorBasePanel panelTitle={MESSAGE_TYPE_TITLES.LMS} {...props} />
  );
}

function MmsMessageEditorPanel(props) {
  return (
    <MessageEditorBasePanel panelTitle={MESSAGE_TYPE_TITLES.MMS} {...props} />
  );
}

export default function MessageEditorPanel({
  messageType,
  selectedValue,
  onSelectedValueChange,
  onBack,
  onOpenMemberPopup,
}) {
  const commonProps = {
    selectedValue,
    onSelectedValueChange,
    onBack,
    onOpenMemberPopup,
  };

  if (messageType === 'SMS') return <SmsMessageEditorPanel {...commonProps} />;
  if (messageType === 'LMS') return <LmsMessageEditorPanel {...commonProps} />;
  return <MmsMessageEditorPanel {...commonProps} />;
}
