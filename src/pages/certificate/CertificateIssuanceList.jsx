import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useMatches } from 'react-router-dom';

const createSearchParams = () => ({
  prdocIssuAplyNo: '',
  prdocCd: '',
  brno: '',
  cmpnyNm: '',
  prdocIssuPrgrsSttsCd: '',
  vldBgngYmdFrom: '',
  vldBgngYmdTo: '',
  aplyDtFrom: '',
  aplyDtTo: '',
});

export default function CertificateIssuanceList() {
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const appliedSearchParamsRef = useRef(createSearchParams());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState(createSearchParams);
  const [prdocIssuPrgrsSttsCdList, setPrdocIssuPrgrsSttsCdList] = useState([]);
  const [certificateOptions, setCertificateOptions] = useState([]);

  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((m) => m?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '증명서 발급 이력';

  const columns = [
    {
      id: 'rowNumber',
      header: '순번',
      width: 70,
      cell: ({ row }) =>
        Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '-',
    },
    { id: 'prdocIssuAplyNo', header: '신청번호', width: 160 },
    { id: 'prdocTtl', header: '증명서명', flexgrow: 1, dataAlign: 'left' },
    { id: 'brno', header: '사업자등록번호', width: 130 },
    { id: 'cmpnyNm', header: '기업명', width: 180 },
    {
      id: 'vldBgngYmd',
      header: '유효시작일',
      width: 110,
      template: (value) => formatDate(value, 'yyyy-MM-dd'),
    },
    {
      id: 'vldEndYmd',
      header: '유효종료일',
      width: 110,
      template: (value) => formatDate(value, 'yyyy-MM-dd'),
    },
    {
      id: 'aplyDt',
      header: '신청일시',
      width: 160,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm'),
    },
    { id: 'prdocIssuPrgrsSttsCdNm', header: '발급상태', width: 120 },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [commonCodeResponse, certificateResponse] = await Promise.all([
          fetchCommonCodes(['PRDOC_ISSU_PRGRS_STTS_CD']),
          http.get('/api/v1/certificates/options'),
        ]);

        const options = (commonCodeResponse.PRDOC_ISSU_PRGRS_STTS_CD || []).map(
          (item) => ({
            value: item.comCd,
            label: item.comCdNm,
          })
        );

        setPrdocIssuPrgrsSttsCdList(options);
        setCertificateOptions(certificateResponse.data || []);
      } catch (error) {
        console.error('초기 데이터 조회 실패:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const res = await http.get('/api/v1/certificate-issuances', {
        params: apiParams,
      });

      const page = res?.data ?? res ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];
        const unique = [];
        const seen = new Set();
        merged.forEach((row) => {
          const key = row?.prdocIssuAplyNo;
          if (!key || seen.has(key)) return;
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
      console.error('증명서 발급 이력 조회 실패:', error);
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
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="신청번호"
                menuSize="150px"
                value={searchParams.prdocIssuAplyNo}
                onChange={(e) => handleInputChange('prdocIssuAplyNo', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="증명서"
                menuSize="150px"
                options={certificateOptions}
                value={searchParams.prdocCd}
                onChange={(e) => handleInputChange('prdocCd', e)}
              />
              <MenuInputBox
                menuType="input"
                menuName="기업명"
                menuSize="300px"
                value={searchParams.cmpnyNm}
                onChange={(e) => handleInputChange('cmpnyNm', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="발급상태"
                menuSize="150px"
                options={prdocIssuPrgrsSttsCdList}
                value={searchParams.prdocIssuPrgrsSttsCd}
                onChange={(e) => handleInputChange('prdocIssuPrgrsSttsCd', e)}
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
            <div className="onparagraph middle">
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="유효기간"
                  value={searchParams.vldBgngYmdFrom}
                  onChange={(val) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      vldBgngYmdFrom: val,
                    }))
                  }
                  outputFormat="ymd"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.vldBgngYmdTo}
                  onChange={(val) =>
                    setSearchParams((prev) => ({ ...prev, vldBgngYmdTo: val }))
                  }
                  outputFormat="ymd"
                />
              </div>
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="신청일"
                  value={searchParams.aplyDtFrom}
                  onChange={(val) =>
                    setSearchParams((prev) => ({ ...prev, aplyDtFrom: val }))
                  }
                  outputFormat="dash"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.aplyDtTo}
                  onChange={(val) =>
                    setSearchParams((prev) => ({ ...prev, aplyDtTo: val }))
                  }
                  outputFormat="dash"
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
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
                <GridTable columns={columns} data={rows} useWillow={false} />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
