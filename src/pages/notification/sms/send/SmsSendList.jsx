import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

// 초깃값 팩토리 함수 생성
const createSearchParams = () => ({
  meKind: '',
  mSendType: '',
  mSenderId: '',
  mTitle: '',
  startDate: '',
  endDate: '',
});

export default function SmsSendList() {
  const navigate = useNavigate();
  const gridViewportRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  const loadingRef = useRef(false);
  const appliedSearchParamsRef = useRef(createSearchParams());
  const [searchParams, setSearchParams] = useState(createSearchParams);

  const columns = [
    {
      id: 'rowNo',
      header: '번호',
      width: 70,
      dataAlign: 'right',
      cell: ({ row }) => {
        return Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '-';
      },
    },
    {
      id: 'meKind',
      header: '메시지 구분',
      width: 100,
      cell: ({ row }) => toDisplayText(row?.meKind),
    },
    {
      id: 'mTitle',
      header: '제목',
      resize: true,
      flexgrow: 1,
      dataAlign: 'left',
      cell: ({ row }) => {
        const text = toDisplayText(row?.mTitle);
        return (
          <span
            title={text === '-' ? '' : String(text)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {text}
          </span>
        );
      },
    },
    {
      id: 'mSendType',
      header: '발송상태',
      width: 100,
      cell: ({ row }) => {
        const statusCode = row?.mSendType;
        if (statusCode === '1') return '발송완료';
        if (statusCode === '0') return '발송실패';
        if (statusCode === '2') return '발송중';
        return toDisplayText(statusCode);
      },
    },
    {
      id: 'mSenderId',
      header: '발신자',
      width: 110,
      cell: ({ row }) => toDisplayText(row?.mSenderId),
    },
    {
      id: 'mRegDate',
      header: '발송일시',
      width: 160,
      cell: ({ row }) => {
        if (!row?.mRegDate) return '-';
        return row.mRegDate.replace('T', ' ').substring(0, 19);
      },
    },
    {
      id: 'mSendCount',
      header: '발송 총 건수',
      width: 100,
      cell: ({ row }) => toDisplayText(row?.mSendCount),
    },
    {
      id: 'tmsFail',
      header: '실패건수',
      width: 90,
      cell: ({ row }) => toDisplayText(row?.tmsFail),
    },
  ];

  // 파라미터 빌더 함수 (사이즈 지정 및 빈 값 제거)
  const buildParams = (baseParams) => {
    const params = { size: 20, ...baseParams };
    const filtered = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filtered[key] = value;
      }
    });
    return filtered;
  };

  // 목록 데이터 API 호출
  const fetchSmsLogList = async (nextCursor = null, reset = false) => {
    if (loadingRef.current) return;
    if (!reset && !hasNext) return;

    loadingRef.current = true;
    setLoading(true);

    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const apiParams = buildParams(params);
      if (nextCursor) apiParams.cursor = nextCursor;

      Object.keys(apiParams).forEach((key) => {
        if (!apiParams[key]) delete apiParams[key];
      });

      const response = await http.get('/api/v1/notification/sms/list', {
        params: apiParams,
      });
      const page = response.data ?? {};
      const list = Array.isArray(page.data) ? page.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];

        const seen = new Set();
        return merged
          .filter((item) => {
            const key = item.mSeq || item.mseq;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .map((row, idx) => ({
            ...row,
            id: String(row.mSeq || row.mseq || idx),
            _rowIndex: idx + 1,
          }));
      });

      if (reset) setTotalCount(page?.totalCount ?? 0);
      setCursor(page.nextCursor ?? null);
      setHasNext(Boolean(page.hasNext));
    } catch (error) {
      if (reset) setRows([]);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSmsLogList(null, true);
  }, []);

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => fetchSmsLogList(cursor, false),
  });

  const handleInputChange = (key, val) => {
    setSearchParams((prev) => ({ ...prev, [key]: val }));
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchSmsLogList(null, true);
  };

  const handleMoveToCreate = () => navigate('create');

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
          {/* 검색 폼 구역 */}
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="메시지 구분"
                menuSize="150px"
                options={[
                  { value: 'SMS', label: 'SMS' },
                  { value: 'LMS', label: 'LMS' },
                ]}
                value={searchParams.meKind}
                onChange={(e) => handleInputChange('meKind', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="발송상태"
                menuSize="150px"
                options={[
                  { value: '2', label: '발송중' },
                  { value: '1', label: '발송완료' },
                  { value: '0', label: '발송실패' },
                ]}
                value={searchParams.mSendType}
                onChange={(e) => handleInputChange('mSendType', e.target.value)}
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="발신자"
                menuSize="150px"
                value={searchParams.mSenderId}
                onChange={(e) => handleInputChange('mSenderId', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="제목"
                menuSize="300px"
                value={searchParams.mTitle}
                onChange={(e) => handleInputChange('mTitle', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="발송일"
                  value={searchParams.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  outputFormat="dash"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  outputFormat="dash"
                />
              </div>
            </div>
          </div>

          {/* 목록 상단 툴바 */}
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
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  height: 'max(420px, calc(100dvh - 410px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  columns={columns}
                  data={rows}
                  useWillow={false}
                  gridProps={{
                    init: (api) => {
                      api.on('select-row', (ev) => {
                        if (ev?.id) {
                          navigate(`${ev.id}`);
                        }
                      });
                    },
                  }}
                />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
