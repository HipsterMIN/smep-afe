import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import {Willow} from "@svar-ui/react-grid";

const PAGE_SIZE = 20;
const FIXED_APPLY_BIZ_SE_CD = 'BIZP';

export default function ApplicationCompanyInfoList() {
  const observerRef = useRef(null);
  const [isDetailOpen] = useState(true);
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [linkInstOptions, setLinkInstOptions] = useState([]);
  const [searchParams, setSearchParams] = useState({
    aplyBizSeCd: FIXED_APPLY_BIZ_SE_CD,
    bizPbancNm: '',
    mbrNm: '',
    cmpnyNm: '',
    bizAplyPrgrsSttsNm: '',
    bizPbancLinkInstCd: '',
    regDtFrom: '',
    regDtTo: '',
  });

  const columns = [
    {
      id: 'rowNumber',
      header: '순번',
      width: 70,
      cell: ({ row }) =>
        Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '',
    },
    {
      id: 'aplyBizSeNm',
      header: '신청구분',
      width: 100,
      cell: ({ row }) => row?.aplyBizSeNm || '외부연계',
    },
    { id: 'bizPbancNm', header: '사업공고명', dataAlign: 'left', flexgrow: 1},
    { id: 'mbrNm', header: '신청자명', width: 120 },
    {
      id: 'cmpnyNm',
      header: '기업명',
      width: 120,
      cell: ({ row }) => row?.cmpnyNm || row?.mbrNm || '',
    },
    { id: 'bizAplyPrgrsSttsNm', header: '신청상태명', width: 120 },
    {
      id: 'bizAplyRsltNm',
      header: '신청결과',
      width: 120,
      cell: ({ row }) => row?.bizAplyRsltNm || row?.bizAplyPrgrsSttsNm || '',
    },
    { id: 'bizPbancLinkInstCdNm', header: '연계기관명', width: 130 },
    {
      id: 'reqstDt',
      header: '신청일시',
      width: 180,
      cell: ({ row }) => row?.reqstDt,
    },
  ];

  const buildParams = (params, nextCursor = null) => {
    const request = {
      aplyBizSeCd: FIXED_APPLY_BIZ_SE_CD,
      bizPbancNm: params.bizPbancNm || undefined,
      mbrNm: params.mbrNm || undefined,
      cmpnyNm: params.cmpnyNm || undefined,
      bizAplyPrgrsSttsNm: params.bizAplyPrgrsSttsNm || undefined,
      bizPbancLinkInstCd: params.bizPbancLinkInstCd || undefined,
      regDtFrom: params.regDtFrom || undefined,
      regDtTo: params.regDtTo || undefined,
    };

    if (nextCursor) request.cursor = nextCursor;
    return request;
  };

  const fetchCount = async () => {
    try {
      const res = await http.get('/api/v1/biz-applications/companies/count', {
        params: buildParams(searchParams),
      });
      setTotalCount(Number(res?.data) || 0);
    } catch (error) {
      console.error('신청기업정보 건수 조회 실패:', error);
      setTotalCount(0);
    }
  };

  const fetchList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await http.get('/api/v1/biz-applications/companies', {
        params: { ...buildParams(searchParams, nextCursor), size: PAGE_SIZE },
      });

      const page = res?.data ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];
        return merged.map((row, idx) => ({ ...row, _rowIndex: idx + 1 }));
      });
      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (error) {
      console.error('신청기업정보 목록 조회 실패:', error);
      setHasNext(false);
      if (reset) setRows([]);
      alert('신청기업정보 목록 조회 중 오류가 발생했습니다.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchList(null, true);
    fetchCount();
  };

  const onChangeParam = (key, value) => {
    const v = value?.target ? value.target.value : value;
    setSearchParams((prev) => ({ ...prev, [key]: v }));
  };

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const result = await fetchAndConvertCommonCodes(['BIZ_PBANC_LINK_INST_CD']);
        setLinkInstOptions(result?.BIZ_PBANC_LINK_INST_CD || []);
      } catch {
        setLinkInstOptions([]);
      }
    };
    loadCommonCodes();
  }, []);

  useEffect(() => {
    fetchList(null, true);
    fetchCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchList(cursor);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading]);

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
        <h2>신청기업정보 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>신청 관리</li>
          <li className="on">신청기업정보</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className={`onselect-form ${isDetailOpen ? 'open' : ''}`} style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="신청구분"
                menuSize="150px"
                value={searchParams.aplyBizSeCd}
                disabled
                options={[{ value: FIXED_APPLY_BIZ_SE_CD, label: '외부연계' }]}
                showAllOption={false}
              />
              <MenuInputBox
                menuType="input"
                menuName="사업명"
                menuSize="300px"
                value={searchParams.bizPbancNm}
                onChange={(e) => onChangeParam('bizPbancNm', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="신청자"
                menuSize="150px"
                value={searchParams.mbrNm}
                onChange={(e) => onChangeParam('mbrNm', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="기업명"
                menuSize="300px"
                value={searchParams.cmpnyNm}
                onChange={(e) => onChangeParam('cmpnyNm', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" onClick={handleSearch} />
              </div>
            </div>

            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="신청상태"
                menuSize="150px"
                value={searchParams.bizAplyPrgrsSttsNm}
                onChange={(e) => onChangeParam('bizAplyPrgrsSttsNm', e)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="연계시스템"
                menuSize="150px"
                value={searchParams.bizPbancLinkInstCd}
                onChange={(e) => onChangeParam('bizPbancLinkInstCd', e)}
                options={linkInstOptions}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="신청일"
                  value={searchParams.regDtFrom}
                  outputFormat="dash"
                  onChange={(value) => onChangeParam('regDtFrom', value)}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.regDtTo}
                  outputFormat="dash"
                  onChange={(value) => onChangeParam('regDtTo', value)}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount.toLocaleString()}</b>건
            </span>
          </div>
          <div className="ongrid-tableform">
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  height: 'max(420px, calc(100dvh - 420px))',
                  overflow: 'hidden',
                }}
              >
            <GridTable columns={columns} data={rows}
                       useWillow={false} />
            <div ref={observerRef} style={{ height: 40 }} />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
