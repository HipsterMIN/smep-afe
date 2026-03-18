import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';

const LIST_PATH = '/sprtBiz/bizPbanc/bizInfo';

const COMMON_CODE_GROUPS = [
  'BIZ_PBANC_CLSF_CD',
  'BIZ_PBANC_SPRT_INST_CD',
  'LFCY_TRGT_ENT_SE_CD',
];

const createSearchParams = () => ({
  sprtBizCrtrYr: '',
  sprtBizNm: '',
  bizPbancClsfCd: [],
  bizPbancSprtInstCd: [],
  lfcyTrgtEntSeCd: [],
});

const getLabel = (options, value) => {
  const matched = options.find((item) => item.value === value);
  return matched?.label || value || '-';
};

const toApiValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(',');
  }
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

export default function SupportBusiness() {
  const navigate = useNavigate();
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const appliedSearchParamsRef = useRef(createSearchParams());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState(createSearchParams);
  const [commonCodeOptions, setCommonCodeOptions] = useState({});

  const bizTypeOptions = commonCodeOptions.BIZ_PBANC_CLSF_CD || [];
  const supportInstOptions = commonCodeOptions.BIZ_PBANC_SPRT_INST_CD || [];
  const targetEntOptions = commonCodeOptions.LFCY_TRGT_ENT_SE_CD || [];

  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';

  const pageTitle = routeMenuName || '통합로그인 사이트 목록';

  const supportBusinessNameActionCell = createGridValueActionCell({
    valueKey: 'sprtBizNm',
    fallback: '-',
    onClick: (row) => {
      if (!row?.sprtBizId) return;
      navigate(`${row.sprtBizId}`);
    },
    variant: 'link',
    style: { textAlign: 'left' },
  });

  const supportBusinessEditActionCell = createGridValueActionCell({
    getValue: () => '수정',
    fallback: '수정',
    onClick: (row) => {
      if (!row?.sprtBizId) return;
      navigate(`${row.sprtBizId}/edit`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
  });

  const columns = [
    {
      id: 'rowNumber',
      header: '번호',
      width: 70,
      cell: ({ row }) =>
        Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '-',
    },
    { id: 'sprtBizId', header: '사업ID', width: 220 },
    { id: 'sprtBizCrtrYr', header: '사업년도', width: 90 },
    {
      id: 'sprtBizNm',
      header: '사업명',
      width: 450,
      dataAlign: 'left',
      cell: supportBusinessNameActionCell,
    },
    {
      id: 'bizPbancClsfCd',
      header: '사업유형',
      width: 120,
      template: (value) => getLabel(bizTypeOptions, value),
    },
    {
      id: 'bizPbancSprtInstCd',
      header: '지원기관',
      width: 170,
      template: (value) => getLabel(supportInstOptions, value),
    },
    {
      id: 'lfcyTrgtEntSeCd',
      header: '기업구분',
      width: 120,
      template: (value) => getLabel(targetEntOptions, value),
    },
    { id: 'announcementCount', header: '공고수', width: 80 },
    {
      id: 'mdfcnDt',
      header: '최종수정일',
      width: 150,
      template: (value) => formatDate(value, 'yyyy-MM-dd'),
    },
    {
      id: 'management',
      header: '관리',
      width: 90,
      cell: supportBusinessEditActionCell,
    },
  ];

  const buildParams = (baseParams) => {
    const params = {
      size: 20,
      ...baseParams,
    };

    const filtered = {};
    Object.entries(params).forEach(([key, value]) => {
      const normalized = toApiValue(value);
      if (normalized !== '') filtered[key] = normalized;
    });

    return filtered;
  };

  const fetchCount = async (paramsToApply) => {
    try {
      const res = await http.get('/api/v1/support-business/count', {
        params: buildParams(paramsToApply),
      });
      const value =
        typeof res?.data === 'number'
          ? res.data
          : typeof res === 'number'
            ? res
            : 0;
      setTotalCount(value);
    } catch (error) {
      setTotalCount(0);
    }
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
      if (nextCursor) {
        apiParams.cursor = nextCursor;
      }

      const res = await http.get('/api/v1/support-business', {
        params: apiParams,
      });

      const page = res?.data ?? res ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];
      const withCount = list.map((item) => ({
        ...item,
        announcementCount: Number(item?.bizPbancCnt ?? 0),
      }));

      setRows((prev) => {
        const merged = reset ? withCount : [...prev, ...withCount];
        const unique = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key = row?.sprtBizId;
          if (!key || seen.has(key)) return;
          seen.add(key);
          unique.push(row);
        });

        return unique.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1,
        }));
      });

      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (error) {
      console.error('지원사업 목록 조회 실패:', error);
      if (reset) {
        setRows([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggleDetail = () => {
    setIsDetailOpen((prev) => !prev);
  };

  const handleMultiCheck = (key, value, checked) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: checked
        ? prev[key].includes(value)
          ? prev[key]
          : [...prev[key], value]
        : prev[key].filter((item) => item !== value),
    }));
  };

  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchList(null, true);
    fetchCount(searchParams);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const codes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUPS);
        setCommonCodeOptions(codes || {});
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
        setCommonCodeOptions({});
      }
    };

    loadCommonCodes();
  }, []);

  useEffect(() => {
    fetchList(null, true);
    fetchCount(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className={`onselect-form ${isDetailOpen ? 'open' : ''}`}>
            <div className="onparagraph dashed">
              <MenuInputBox
                menuType="input"
                menuName="사업년도"
                menuSize="100px"
                value={searchParams.sprtBizCrtrYr}
                onChange={(e) => handleInputChange('sprtBizCrtrYr', e)}
                onKeyDown={handleSearchKeyDown}
              />

              <MenuInputBox
                menuType="input"
                menuName="사업명"
                menuSize="300px"
                value={searchParams.sprtBizNm}
                onChange={(e) => handleInputChange('sprtBizNm', e)}
                onKeyDown={handleSearchKeyDown}
              />

              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="detail"
                  btnNames={isDetailOpen ? '상세조건 접기' : '상세조건 펼치기'}
                  onClick={handleToggleDetail}
                />
              </div>

              <div className="onbtn">
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="onparagraph column">
              <dl>
                <dt>사업유형</dt>
                {bizTypeOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`search-biz-type-${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={searchParams.bizPbancClsfCd.includes(
                        option.value
                      )}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('bizPbancClsfCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>

              <dl>
                <dt>지원기관</dt>
                {supportInstOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`search-support-inst-${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={searchParams.bizPbancSprtInstCd.includes(
                        option.value
                      )}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('bizPbancSprtInstCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>

              <dl>
                <dt>기업구분</dt>
                {targetEntOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`search-target-ent-${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={searchParams.lfcyTrgtEntSeCd.includes(
                        option.value
                      )}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('lfcyTrgtEntSeCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="등록"
              onClick={() => navigate('create')}
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
                <GridTable columns={columns} data={rows} useWillow={false} />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
