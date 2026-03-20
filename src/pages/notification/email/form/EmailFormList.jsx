import Button from '@components/ui/Button.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const EMAIL_FORM_COLUMNS = [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'right',
  },
  {
    id: 'formId',
    header: '양식 ID',
    width: 110,
  },
  {
    id: 'formName',
    header: '양식명',
    resize: true,
    flexgrow: 1,
    dataAlign: 'left',
  },
  {
    id: 'writer',
    header: '작성자',
    width: 110,
  },
  {
    id: 'createdAt',
    header: '작성일',
    width: 120,
  },
  {
    id: 'management',
    header: '관리',
    width: 90,
  },
];

const MOCK_EMAIL_FORM_ROWS = [
  {
    id: 'email-form-10',
    rowNo: 10,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-9',
    rowNo: 9,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-8',
    rowNo: 8,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-7',
    rowNo: 7,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-6',
    rowNo: 6,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-5',
    rowNo: 5,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-4',
    rowNo: 4,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-3',
    rowNo: 3,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-2',
    rowNo: 2,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
  {
    id: 'email-form-1',
    rowNo: 1,
    formId: 'XXXX',
    formName: 'XXXXXXXXXXXXXXXX',
    writer: 'XXX',
    createdAt: '2025-12-10',
    management: '수정',
  },
];

export default function EmailFormList() {
  const navigate = useNavigate();
  const rows = useMemo(() => MOCK_EMAIL_FORM_ROWS, []);
  const totalCount = rows.length;

  const managementActionCell = createGridValueActionCell({
    getValue: () => '수정',
    fallback: '수정',
    onClick: (row) => {
      if (!row?.id) return;
      navigate(`${row.id}/update`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
    buttonProps: {
      title: '수정',
    },
  });

  const columns = EMAIL_FORM_COLUMNS.map((column) =>
    column.id === 'management'
      ? {
          ...column,
          cell: managementActionCell,
        }
      : column
  );

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 양식 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li className="on">이메일 양식 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="양식ID"
                menuSize="150px"
              />
              <MenuInputBox
                menuType="input"
                menuName="양식명"
                menuSize="300px"
              />
              <MenuInputBox
                menuType="input"
                menuName="작성자"
                menuSize="150px"
              />

              <div className="ondatepickerbox">
                <DatepickerBox menuName="작성일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="양식추가"
              onClick={() => navigate('create')}
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
