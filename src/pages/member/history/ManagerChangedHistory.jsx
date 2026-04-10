import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_SEARCH_PARAMS = {
  lgnId: '',
  mngrAcntUseSttsCd: '',
  prcsRsnCn: '',
  excptnMttrCn: '',
  startHstryDt: null,
  endHstryDt: null,
};
const HISTORY_PAGE_SIZE = 20;
const DEFAULT_DEPT_NAME = '-';
const HISTORY_GRID_VIEWPORT_HEIGHT = 'max(420px, calc(100dvh - 360px))';

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    if (
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data) &&
      ('data' in response.data ||
        'hasNext' in response.data ||
        'nextCursor' in response.data ||
        'totalCount' in response.data)
    ) {
      return response.data;
    }

    if (
      'data' in response ||
      'hasNext' in response ||
      'nextCursor' in response ||
      'totalCount' in response
    ) {
      return response;
    }
  }

  return response?.data ?? response ?? {};
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

function normalizeDisplayText(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  const trimmed = String(value).trim();
  return trimmed ? trimmed : '-';
}

function normalizeHistoryRow(item, index) {
  return {
    id: item?.mbrNo ?? `history-${index}`,
    mbrNo: item?.mbrNo ?? '',
    hstryDt: item?.hstryDt ?? null,
    hasHistory: Boolean(item?.hasHistory),
    lgnId: item?.lgnId ?? '-',
    mbrNm: item?.mbrNm ?? '-',
    deptNm: item?.deptNm ?? DEFAULT_DEPT_NAME,
    mngrAcntUseSttsCd: item?.mngrAcntUseSttsCd ?? '',
    mngrAcntUseSttsCdNm: normalizeDisplayText(item?.mngrAcntUseSttsCdNm),
    prcsRsnCn: normalizeDisplayText(item?.prcsRsnCn),
    excptnMttrCn: normalizeDisplayText(item?.excptnMttrCn),
    mdfrId: normalizeDisplayText(item?.mdfrId),
  };
}

export default function ManagerChangedHistory() {
  const navigate = useNavigate();
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const appliedSearchParamsRef = useRef(DEFAULT_SEARCH_PARAMS);
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);
  const [gridHistoryList, setGridHistoryList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleInputChange(name, value) {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    void handleSearch();
  }

  async function fetchStatusOptions() {
    try {
      const codes = await fetchAndConvertCommonCodes(['MNG_MBR_USE_STTS_CD']);
      setStatusOptions(codes?.MNG_MBR_USE_STTS_CD ?? []);
    } catch (error) {
      console.error(
        '[ManagerChangedHistory] 처리상태 공통코드 조회 실패',
        error
      );
      setStatusOptions([]);
    }
  }

  async function fetchHistoryList(nextCursor = null, reset = false) {
    if (loadingRef.current) {
      return;
    }

    if (!reset && !hasNext) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      if (reset) {
        // 무한 스크롤 중 입력이 바뀌어도 append 조회는 마지막 "검색 실행" 조건을 기준으로 이어가야 한다.
        appliedSearchParamsRef.current = { ...searchParams };
      }

      const requestSearchParams = reset
        ? searchParams
        : appliedSearchParamsRef.current;

      const response = await http.post('/api/v1/managers/history/search', {
        cursorPageRequest: {
          cursor: nextCursor,
          size: HISTORY_PAGE_SIZE,
        },
        lgnId: requestSearchParams.lgnId || null,
        mngrAcntUseSttsCd: requestSearchParams.mngrAcntUseSttsCd || null,
        prcsRsnCn: requestSearchParams.prcsRsnCn || null,
        excptnMttrCn: requestSearchParams.excptnMttrCn || null,
        startHstryDt: requestSearchParams.startHstryDt,
        endHstryDt: requestSearchParams.endHstryDt,
      });

      const payload = resolvePayload(response);
      const sourceList = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      const normalizedList = sourceList.map(normalizeHistoryRow);
      const resolvedNextCursor =
        payload?.nextCursor ?? payload?.cursor ?? normalizedList.at(-1)?.mbrNo ?? null;
      const resolvedHasNext =
        typeof payload?.hasNext === 'boolean'
          ? payload.hasNext
          : normalizedList.length >= HISTORY_PAGE_SIZE && Boolean(resolvedNextCursor);

      setGridHistoryList((prevList) => {
        const merged = reset ? normalizedList : [...prevList, ...normalizedList];
        const uniqueMap = new Map();

        merged.forEach((row, index) => {
          const uniqueKey = row?.mbrNo || row?.id || `history-${index}`;
          if (!uniqueMap.has(uniqueKey)) {
            uniqueMap.set(uniqueKey, row);
          }
        });

        return [...uniqueMap.values()].map((row, rowIndex) => ({
          ...row,
          no: rowIndex + 1,
        }));
      });
      setCursor(resolvedNextCursor);
      setHasNext(resolvedHasNext);
    } catch (error) {
      console.error(
        '[ManagerChangedHistory] 관리자 권한 변경 이력 조회 실패',
        error
      );

      if (reset) {
        setGridHistoryList([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  function handleSearch() {
    setCursor(null);
    setHasNext(true);
    setGridHistoryList([]);
    fetchHistoryList(null, true);
  }

  function handleMoveToDetail(row) {
    if (!row?.mbrNo) {
      return;
    }

    navigate(encodeURIComponent(row.mbrNo), {
      state: { historyRow: row },
    });
  }

  useEffect(() => {
    void fetchStatusOptions();
    void fetchHistoryList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => {
      if (cursor !== null && cursor !== undefined) {
        fetchHistoryList(cursor, false);
      }
    },
  });

  const columns = [
    {
      id: 'no',
      header: [{ text: '번호', rowspan: 2 }],
      width: 50,
    },
    {
      id: 'lgnId',
      header: [{ text: '대상자정보', colspan: 4 }, { text: '아이디' }],
      width: 140,
    },
    {
      id: 'mbrNm',
      header: ['', { text: '성명' }],
      width: 120,
    },
    {
      id: 'deptNm',
      header: ['', { text: '부서명' }],
      width: 120,
      cell: ({ row }) => row?.deptNm || DEFAULT_DEPT_NAME,
    },
    {
      id: 'roleNm',
      header: ['', { text: '권한명' }],
      width: 180,
      // 목록은 사용자 기준이고 상세에서 이력 묶음을 볼 예정이라, 권한 축은 여기서 해석하지 않는다.
      cell: () => '-',
    },
    {
      id: 'mngrAcntUseSttsCdNm',
      header: [{ text: '처리상태', rowspan: 2 }],
      width: 110,
    },
    {
      id: 'prcsRsnCn',
      header: [{ text: '처리사유', rowspan: 2 }],
      width: 220,
      resize: true,
      dataAlign: 'left',
    },
    {
      id: 'excptnMttrCn',
      header: [{ text: '특이사항', rowspan: 2 }],
      width: 220,
      resize: true,
      dataAlign: 'left',
    },
    {
      id: 'hstryDt',
      header: [{ text: '수정일시', rowspan: 2 }],
      width: 180,
      cell: ({ row }) => formatTimestamp(row?.hstryDt),
    },
    {
      id: 'mdfrId',
      header: [{ text: '수정자', rowspan: 2 }],
      width: 120,
    },
    {
      id: 'management',
      header: [{ text: '관리', rowspan: 2 }],
      width: 100,
      cell: ({ row }) => (
        <Button
          btnType="edit small"
          btnNames="상세"
          onClick={() => handleMoveToDetail(row)}
        />
      ),
    },
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>관리자 권한 변경 이력</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>관리자 관리</li>
          <li>관리자 계정 관리</li>
          <li className="on">관리자 권한 변경 이력</li>
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
                menuName="아이디"
                inputId="manager-history-search-lgnId"
                menuSize="150px"
                placeholder="아이디 입력"
                value={searchParams.lgnId}
                onChange={(event) =>
                  handleInputChange('lgnId', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="처리상태"
                inputId="manager-history-search-status"
                menuSize="100px"
                options={statusOptions}
                value={searchParams.mngrAcntUseSttsCd}
                onChange={(event) =>
                  handleInputChange('mngrAcntUseSttsCd', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="처리사유"
                inputId="manager-history-search-prcs-rsn"
                menuSize="150px"
                placeholder="처리사유 입력"
                value={searchParams.prcsRsnCn}
                onChange={(event) =>
                  handleInputChange('prcsRsnCn', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="특이사항"
                inputId="manager-history-search-excptn"
                menuSize="150px"
                placeholder="특이사항 입력"
                value={searchParams.excptnMttrCn}
                onChange={(event) =>
                  handleInputChange('excptnMttrCn', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />

              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="수정일"
                  value={searchParams.startHstryDt}
                  onChange={(value) => handleInputChange('startHstryDt', value)}
                  outputFormat="datetime"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endHstryDt}
                  onChange={(value) => handleInputChange('endHstryDt', value)}
                  outputFormat="datetime"
                />
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

          <div className="ongrid-tableform">
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  // /mngrAcnt 와 같은 체감으로, 페이지가 아니라 grid viewport가 스크롤 책임을 갖게 한다.
                  height: HISTORY_GRID_VIEWPORT_HEIGHT,
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  columns={columns}
                  data={gridHistoryList}
                  useWillow={false}
                />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
