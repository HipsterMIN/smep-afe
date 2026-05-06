import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

const POPUP_TITLE = '활동내역(스크랩)';
const PAGE_SIZE = 20;
const SCRAP_GRID_VIEWPORT_HEIGHT = '340px';
const DEFAULT_SEARCH_PARAMS = {
  pbancTypeSeCd: '',
  startRegDt: null,
  endRegDt: null,
  businessName: '',
};
const SCRAP_TYPE_CODES = ['BIZP', 'PLCF'];

function isCursorPagedPayload(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Array.isArray(value.data) &&
    ('hasNext' in value || 'nextCursor' in value || 'totalCount' in value)
  );
}

function resolvePayload(response) {
  if (isCursorPagedPayload(response)) {
    return response;
  }

  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (isCursorPagedPayload(responseData)) {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }
  }

  return response ?? {};
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

function buildRowKey(row, rowIndex) {
  return `${row?.pbancTypeSeCd || 'PBANC'}-${row?.pbancScrpSn || rowIndex}`;
}

function mergeScrapRows(previousRows, incomingRows) {
  const seen = new Set(previousRows.map((row) => row.id));
  const mergedRows = [...previousRows];

  incomingRows.forEach((row, rowIndex) => {
    const id = buildRowKey(row, previousRows.length + rowIndex);
    if (seen.has(id)) return;
    seen.add(id);
    mergedRows.push({ ...row, id });
  });

  return mergedRows.map((row, index) => ({
    ...row,
    no: index + 1,
  }));
}

const SCRAP_COLUMNS = [
  { id: 'no', header: '순번', width: 60 },
  {
    id: 'pbancTypeSeCdNm',
    header: '구분',
    width: 110,
    cell: ({ row }) => row?.pbancTypeSeCdNm || row?.pbancTypeSeCd || '-',
  },
  {
    id: 'pbancTitle',
    header: '제목',
    flexgrow: 1,
    dataAlign: 'left',
    cell: ({ row }) => row?.pbancTitle || '-',
  },
  {
    id: 'regDt',
    header: '일시',
    width: 170,
    cell: ({ row }) => formatTimestamp(row?.regDt),
  },
];

export default function MemberScrapActivityPopup({ member, onClose }) {
  const memberNo = member?.mbrNo;
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);
  const [scrapTypeOptions, setScrapTypeOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const hasNextRef = useRef(true);
  const appliedSearchParamsRef = useRef(DEFAULT_SEARCH_PARAMS);

  const updateHasNext = useCallback((nextValue) => {
    hasNextRef.current = nextValue;
    setHasNext(nextValue);
  }, []);

  const buildSearchRequest = useCallback((params, nextCursor) => {
    return {
      cursorPageRequest: {
        size: PAGE_SIZE,
        cursor: nextCursor,
      },
      pbancTypeSeCd: params.pbancTypeSeCd || null,
      startRegDt: params.startRegDt,
      endRegDt: params.endRegDt,
      businessName: params.businessName,
    };
  }, []);

  const fetchScraps = useCallback(
    async ({ nextCursor = null, reset = false, params = null } = {}) => {
      if (!memberNo || loadingRef.current) return;
      if (!reset && !hasNextRef.current) return;

      const effectiveParams = params || appliedSearchParamsRef.current;
      loadingRef.current = true;
      setLoading(true);

      if (reset) {
        appliedSearchParamsRef.current = { ...effectiveParams };
        setRows([]);
      }

      try {
        const response = await http.post(
          `/api/v1/member/${encodeURIComponent(memberNo)}/activity/scraps/search`,
          buildSearchRequest(effectiveParams, nextCursor)
        );
        const data = resolvePayload(response);
        const responseRows = Array.isArray(data?.data) ? data.data : [];
        const nextCursorValue = data?.nextCursor ?? null;
        const nextHasNext =
          typeof data?.hasNext === 'boolean'
            ? data.hasNext
            : responseRows.length >= PAGE_SIZE && Boolean(nextCursorValue);

        setRows((previousRows) =>
          mergeScrapRows(reset ? [] : previousRows, responseRows)
        );
        setTotalCount(Number(data?.totalCount ?? responseRows.length));
        setCursor(nextCursorValue);
        updateHasNext(nextHasNext);
      } catch (fetchError) {
        console.error(
          '[MemberScrapActivityPopup] 스크랩 활동내역 조회 실패',
          fetchError
        );
        if (reset) {
          setRows([]);
          setTotalCount(0);
        }
        setCursor(null);
        updateHasNext(false);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [buildSearchRequest, memberNo, updateHasNext]
  );

  useEffect(() => {
    async function fetchScrapTypeOptions() {
      try {
        const codes = await fetchAndConvertCommonCodes(['PBANC_TYPE_SE_CD']);
        setScrapTypeOptions(
          (codes.PBANC_TYPE_SE_CD || []).filter((option) =>
            SCRAP_TYPE_CODES.includes(option.value)
          )
        );
      } catch (fetchError) {
        console.error(
          '[MemberScrapActivityPopup] 스크랩 구분 코드 조회 실패',
          fetchError
        );
      }
    }

    void fetchScrapTypeOptions();
  }, []);

  useEffect(() => {
    const initialParams = { ...DEFAULT_SEARCH_PARAMS };
    setSearchParams(initialParams);
    setCursor(null);
    updateHasNext(true);
    setTotalCount(0);
    setRows([]);

    if (memberNo) {
      void fetchScraps({ reset: true, params: initialParams });
    }
  }, [fetchScraps, memberNo, updateHasNext]);

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => {
      if (cursor) {
        void fetchScraps({ nextCursor: cursor });
      }
    },
  });

  function handleSearchParamChange(name, value) {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSearch() {
    setCursor(null);
    updateHasNext(true);
    void fetchScraps({ reset: true, params: searchParams });
  }

  function handleSearchKeyDown(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleSearch();
  }

  return (
    <Popup title={POPUP_TITLE} isBtns={true} onClose={onClose}>
      <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight: 'auto' }}>
          <div className="onparagraph">
            <MenuInputBox
              menuType="select"
              options={scrapTypeOptions}
              value={searchParams.pbancTypeSeCd}
              onChange={(event) =>
                handleSearchParamChange('pbancTypeSeCd', event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              menuSize="100px"
            />
            <div className="ondatepickerbox">
              <DatepickerBox
                value={searchParams.startRegDt}
                outputFormat="datetime"
                onChange={(date) => handleSearchParamChange('startRegDt', date)}
              />
              <span className="onunit">~</span>
              <DatepickerBox
                value={searchParams.endRegDt}
                outputFormat="datetime"
                onChange={(date) => handleSearchParamChange('endRegDt', date)}
              />
            </div>
            <MenuInputBox
              menuType="input"
              placeholder="사업명"
              value={searchParams.businessName}
              onChange={(event) =>
                handleSearchParamChange('businessName', event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              menuSize="150px"
            />
            <div style={{ marginLeft: 'auto' }}>
              <Button
                btnType="menuSearch"
                btnNames="검색"
                onClick={handleSearch}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="ontable-legend">
          <span>
            총 <b>{totalCount}</b>개
          </span>
        </div>

        <div className="ongrid-tableform">
          <Willow>
            {/* Grid 내부 .wx-scroll이 스크롤 주체가 되도록 외부 viewport 스크롤을 막는다. */}
            <div
              ref={gridViewportRef}
              style={{
                height: SCRAP_GRID_VIEWPORT_HEIGHT,
                overflow: 'hidden',
              }}
            >
              <GridTable
                data={rows}
                columns={SCRAP_COLUMNS}
                useWillow={false}
              />
            </div>
          </Willow>
        </div>
      </div>
    </Popup>
  );
}

MemberScrapActivityPopup.propTypes = {
  member: PropTypes.object,
  onClose: PropTypes.func,
};

MemberScrapActivityPopup.defaultProps = {
  member: null,
  onClose: undefined,
};
