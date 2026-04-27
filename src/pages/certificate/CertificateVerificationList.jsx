import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useMatches } from 'react-router-dom';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';

const PRDOC_EXST_OPTIONS = [
  { value: 'Y', label: '존재' },
  { value: 'N', label: '미존재' },
];

const createSearchParams = () => ({
  brno: '',
  prdocCd: '',
  dmndDtFrom: '',
  dmndDtTo: '',
  prdocExstYn: '',
});

export default function CertificateVerificationList() {
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const appliedSearchParamsRef = useRef(createSearchParams());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState(createSearchParams);
  const [certificateOptions, setCertificateOptions] = useState([]);

  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((m) => m?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '증명서 일괄 확인 이력';

  // 컬럼 정의
  const columns = [
    {
      id: 'rowNumber',
      header: '순번',
      width: 120,
      cell: ({ row }) =>
        Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '-',
    },
    { id: 'brno', header: '사업자번호', width: 130 },
    { id: 'prdocTtl', header: '증명서명', flexgrow: 1, dataAlign: 'left' },
    {
      id: 'dmndDt',
      header: '요청일시',
      width: 170,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm'),
    },
    {
      id: 'prdocExstYn',
      header: '증명서존재여부',
      width: 120,
      template: (value) => (value === 'Y' ? '존재' : '미존재'),
    },
  ];

  // 증명서 옵션 조회
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await http.get('/api/v1/certificates/options');
        setCertificateOptions(response.data || []);
      } catch (error) {
        console.error('증명서 옵션 조회 실패:', error);
      }
    };
    fetchInitialData();
  }, []);

  // 최초 목록 조회
  useEffect(() => {
    fetchList(null, true);
  }, []);

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

  const fetchList = async (nextCursor = null, reset = false) => {
    if (loadingRef.current) return;
    if (!hasNext && !reset) return;

    loadingRef.current = true;
    setLoading(true);

    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const apiParams = buildParams(params);
      if (nextCursor) apiParams.cursor = nextCursor;

      const res = await http.get('/api/v1/certificates/idnty-requests', {
        params: apiParams,
      });

      const page = res?.data ?? res ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];
        const unique = [];
        const seen = new Set();
        merged.forEach((row) => {
          const key = row?.prdocIdntyDmndNo;
          if (seen.has(key)) return;
          seen.add(key);
          unique.push(row);
        });
        return unique.map((row, idx) => ({ ...row, _rowIndex: idx + 1 }));
      });

      if (reset) {
        setTotalCount(page?.totalCount ?? list.length);
      }

      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (error) {
      console.error('증명서 일괄확인이력 조회 실패:', error);
      if (reset) setRows([]);
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
      setTimeout(() => {
        loadingRef.current = false;
      }, 0);
    }
  };

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchList(null, true);
  };

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => fetchList(cursor, false),
  });

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>

      <div className="oncontents">
        <div className="oncontent">
          {/* 검색 조건 */}
          <div className="ongrid-form">
            <div className="onselect-form">
              <div className="onparagraph">
                <MenuInputBox
                  menuType="input"
                  menuName="사업자번호"
                  menuSize="150px"
                  value={searchParams.brno}
                  onChange={(e) => handleInputChange('brno', e)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <MenuInputBox
                  menuType="select"
                  menuName="증명서"
                  menuSize="180px"
                  options={certificateOptions}
                  value={searchParams.prdocCd}
                  onChange={(e) => handleInputChange('prdocCd', e)}
                />
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="신청일"
                    outputFormat="ymd"
                    value={searchParams.dmndDtFrom}
                    onChange={(val) =>
                      setSearchParams((prev) => ({ ...prev, dmndDtFrom: val }))
                    }
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    outputFormat="ymd"
                    value={searchParams.dmndDtTo}
                    onChange={(val) =>
                      setSearchParams((prev) => ({ ...prev, dmndDtTo: val }))
                    }
                  />
                </div>
                <MenuInputBox
                  menuType="select"
                  menuName="증명서존재여부"
                  menuSize="130px"
                  options={PRDOC_EXST_OPTIONS}
                  value={searchParams.prdocExstYn}
                  onChange={(e) => handleInputChange('prdocExstYn', e)}
                />
                <div className="onbtn" style={{ marginLeft: 'auto' }}>
                  <Button
                    btnType="menuSearch"
                    btnNames="검색"
                    onClick={handleSearch}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 목록 헤더 */}
          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
          </div>

          {/* 그리드 */}
          <div className="ongrid-tableform">
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  height: 'max(420px, calc(100dvh - 380px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable columns={columns} data={rows} useWillow={false} />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
