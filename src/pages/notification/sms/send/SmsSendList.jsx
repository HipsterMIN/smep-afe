import Button from '@components/ui/Button.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const SMS_LOG_COLUMNS = [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'right',
  },
  {
    id: 'messageType',
    header: '메시지 구분',
    width: 100,
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
    id: 'title',
    header: '제목',
    resize: true,
    flexgrow: 1,
    dataAlign: 'left',
  },
  {
    id: 'sentAt',
    header: '발송일시',
    width: 160,
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
    width: 90,
    dataAlign: 'right',
  },
];

const MOCK_SMS_LOG_ROWS = [
  {
    id: 'sms-log-10',
    rowNo: 10,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 관심등교 공고 접수안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 4,
    actualCount: '-',
  },
  {
    id: 'sms-log-9',
    rowNo: 9,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 관심등교 공고 접수안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 3,
    actualCount: '-',
  },
  {
    id: 'sms-log-8',
    rowNo: 8,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 주요사업일정 확인안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 2,
    actualCount: '-',
  },
  {
    id: 'sms-log-7',
    rowNo: 7,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 정책물음 일정 안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 23,
    actualCount: 1,
  },
  {
    id: 'sms-log-6',
    rowNo: 6,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 주요사업일정 확인안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 3,
    actualCount: '-',
  },
  {
    id: 'sms-log-5',
    rowNo: 5,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 정책물음 일정 안내',
    sentAt: '2025-08-01 17:43',
    totalCount: 54,
    actualCount: 3,
  },
  {
    id: 'sms-log-4',
    rowNo: 4,
    messageType: 'SMS',
    sendType: '즉시발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sentAt: '2025-08-01 17:43',
    totalCount: 3,
    actualCount: '-',
  },
  {
    id: 'sms-log-3',
    rowNo: 3,
    messageType: 'SMS',
    sendType: '예약발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sentAt: '2025-08-01 17:43',
    totalCount: 5,
    actualCount: '-',
  },
  {
    id: 'sms-log-2',
    rowNo: 2,
    messageType: 'SMS',
    sendType: '예약발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sentAt: '2025-08-01 17:43',
    totalCount: 6,
    actualCount: '-',
  },
  {
    id: 'sms-log-1',
    rowNo: 1,
    messageType: 'SMS',
    sendType: '예약발송',
    sendStatus: '발송완료',
    sender: '○○관리자',
    title: '[농협물품권] 증명서 발급이 완료되었습니다.',
    sentAt: '2025-08-01 17:43',
    totalCount: 34,
    actualCount: '-',
  },
];

export default function SmsSendList() {
  const navigate = useNavigate();
  const rows = useMemo(() => MOCK_SMS_LOG_ROWS, []);
  const totalCount = rows.length;
  const handleMoveToCreate = () => navigate('create');
  const handleMoveToDetail = (row) => {
    if (!row?.id) return;
    navigate(`${row.id}`);
  };

  const titleActionCell = createGridValueActionCell({
    getValue: (row) => {
      const text = toDisplayText(row?.title);
      return <span title={text === '-' ? '' : String(text)}>{text}</span>;
    },
    onClick: (row) => handleMoveToDetail(row),
    variant: 'link',
    style: { textAlign: 'left' },
  });

  const columns = SMS_LOG_COLUMNS.map((column) =>
    column.id === 'title'
      ? {
          ...column,
          cell: titleActionCell,
        }
      : column
  );

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 발송 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">SMS 관리</li>
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
                menuName="메시지 구분"
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
              btnNames="메시지 작성"
              onClick={handleMoveToCreate}
            />
          </div>

          <div className="ongrid-tableform">
            <GridTable data={rows} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}
