import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const EMAIL_SEND_COLUMNS = [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'right',
  },
  {
    id: 'recipient',
    header: '수신자',
    width: 100,
  },
  {
    id: 'title',
    header: '제목',
    resize: true,
    flexgrow: 1,
    dataAlign: 'left',
    cell: ({ row }) => {
      const text = toDisplayText(row?.title);
      return <span title={text === '-' ? '' : String(text)}>{text}</span>;
    },
  },
  {
    id: 'sendType',
    header: '발송유형',
    width: 100,
  },
  {
    id: 'sendStatus',
    header: '발송상태',
    width: 100,
  },
  {
    id: 'sender',
    header: '발신자',
    width: 110,
  },
  {
    id: 'sentAt',
    header: '발송일시',
    width: 130,
  },
  {
    id: 'totalCount',
    header: '발송 총 건수',
    width: 100,
    dataAlign: 'right',
  },
  {
    id: 'actualCount',
    header: '실제 건수',
    width: 110,
    dataAlign: 'right',
  },
];

const MOCK_EMAIL_SEND_ROWS = [
  {
    id: 'email-send-10',
    rowNo: 10,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 관심등교 공고 접수안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-9',
    rowNo: 9,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 관심등교 공고 접수안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-8',
    rowNo: 8,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 관심등교 공고 접수안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-7',
    rowNo: 7,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 주요사업일정 확인안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-6',
    rowNo: 6,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 주요사업일정 확인안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-5',
    rowNo: 5,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 정책물음 일정 안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-4',
    rowNo: 4,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 정책물음 일정 안내',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-3',
    rowNo: 3,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-2',
    rowNo: 2,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sendType: '예약발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
  {
    id: 'email-send-1',
    rowNo: 1,
    recipient: 'ㄱㄴㄷㄹ',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sendType: '예약발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    sentAt: '2025-01-17 43',
    totalCount: 1,
    actualCount: '100/100',
  },
];

export default function EmailSendList() {
  const navigate = useNavigate();
  const rows = useMemo(() => MOCK_EMAIL_SEND_ROWS, []);
  const totalCount = rows.length;

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 발송 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">이메일 관리</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="분류"
                selectOption="전체"
              />
              <MenuInputBox
                menuType="select"
                menuName="발송유형"
                selectOption="전체"
              />
              <MenuInputBox
                menuType="select"
                menuName="발송상태"
                selectOption="전체"
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="발신자"
                menuSize="150px"
              />
              <MenuInputBox menuType="input" menuName="제목" menuSize="300px" />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="발송일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="이메일 작성"
              onClick={() => navigate('create')}
            />
          </div>

          <div className="ongrid-tableform">
            <GridTable data={rows} columns={EMAIL_SEND_COLUMNS} />
          </div>
        </div>
      </div>
    </div>
  );
}
