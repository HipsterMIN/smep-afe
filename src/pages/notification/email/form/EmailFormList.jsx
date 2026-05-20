import Button from '@components/ui/Button.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

const EMAIL_FORM_COLUMNS = [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'right',
  },
  {
    id: 'tplId',
    header: '양식 ID',
    width: 110,
  },
  {
    id: 'tplTitle',
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
    id: 'inDate',
    header: '작성일',
    width: 120,
  },
  {
    id: 'management',
    header: '관리',
    width: 90,
  },
];

function formatDate(value) {
  if (!value) return '';
  if (/^\d{14}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
}

function normalizeRows(rows = [], totalCount = 0, cursorOffset = 0) {
  return rows.map((row, index) => ({
    ...row,
    id: String(row.tplId),
    rowNo: totalCount - (cursorOffset + index),
    inDate: formatDate(row.inDate),
    management: '수정',
  }));
}

export default function EmailFormList() {
  const navigate = useNavigate();

  const [tplId, setTplId] = useState('');
  const [tplTitle, setTplTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [inDateFrom, setInDateFrom] = useState(null);
  const [inDateTo, setInDateTo] = useState(null);

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const gridViewportRef = useRef(null);

  const toDateParam = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const buildRequestParams = (nextCursor = null) => ({
    tplId: tplId.trim() ? Number(tplId.trim()) : null,
    tplTitle: tplTitle.trim() || null,
    writer: writer.trim() || null,
    inDateFrom: toDateParam(inDateFrom),
    inDateTo: toDateParam(inDateTo),
    cursor: nextCursor,
    size: PAGE_SIZE,
  });

  const fetchEmailTemplateList = async (nextCursor = null, reset = false) => {
    if (loadingRef.current) return;
    if (!hasNext && !reset) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await http.get('/api/v1/notification/email/templates', {
        params: buildRequestParams(reset ? null : nextCursor),
      });

      const payload = response?.data?.data
        ? response.data
        : (response?.data ?? response ?? {});

      const content = Array.isArray(payload?.data) ? payload.data : [];
      const next = payload?.nextCursor ?? null;
      const nextHasNext = Boolean(payload?.hasNext);
      const nextTotalCount = payload?.totalCount ?? 0;

      setTotalCount(nextTotalCount);
      setCursor(next);

      if (reset) {
        setRows(normalizeRows(content, nextTotalCount, 0));
        setHasNext(nextHasNext);
      } else {
        setRows((prev) => [
          ...prev,
          ...normalizeRows(content, nextTotalCount, prev.length),
        ]);
        setHasNext(nextHasNext);
      }
    } catch (error) {
      console.error('이메일 양식 목록 조회 실패:', error);
      if (reset) {
        setRows([]);
        setTotalCount(0);
        setCursor(null);
        setHasNext(false);
      }
      alert('이메일 양식 목록 조회 중 오류가 발생했습니다.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchEmailTemplateList(null, true);
  };

  const handleLoadMore = () => {
    if (!cursor) return;
    fetchEmailTemplateList(cursor, false);
  };

  useEffect(() => {
    fetchEmailTemplateList(null, true);
  }, []);

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: handleLoadMore,
  });

  const managementActionCell = createGridValueActionCell({
    getValue: () => '수정',
    fallback: '수정',
    onClick: (row) => {
      if (!row?.tplId) return;
      navigate(`${row.tplId}/update`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
    buttonProps: {
      title: '수정',
    },
  });

  const columns = useMemo(
    () =>
      EMAIL_FORM_COLUMNS.map((column) =>
        column.id === 'management'
          ? {
              ...column,
              cell: managementActionCell,
            }
          : column
      ),
    [managementActionCell]
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
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="양식ID"
                menuSize="150px"
                value={tplId}
                onChange={(e) => setTplId(e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuName="양식명"
                menuSize="300px"
                value={tplTitle}
                onChange={(e) => setTplTitle(e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuName="작성자"
                menuSize="150px"
                value={writer}
                onChange={(e) => setWriter(e.target.value)}
              />

              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="작성일"
                  value={inDateFrom}
                  onChange={setInDateFrom}
                />
                <span className="onunit">~</span>
                <DatepickerBox value={inDateTo} onChange={setInDateTo} />
              </div>

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
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

          <div
            className="ongrid-tableform"
            ref={gridViewportRef}
            style={{ overflow: 'auto', maxHeight: '600px' }}
          >
            <GridTable data={rows} columns={columns} />
          </div>

          {loading && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                color: '#666',
              }}
            >
              조회 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
