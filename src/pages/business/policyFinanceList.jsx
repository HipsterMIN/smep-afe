import Button from '@components/ui/Button';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

const BIZ_FLFMT_INST_OPTIONS = [
  { value: 'B554009', label: '중소벤처기업진흥공단' },
  { value: 'B553694', label: '기술보증기금' },
  { value: 'B190030', label: '한국산업은행' },
  { value: 'B190021', label: '중소기업은행' },
  { value: 'B190031', label: '한국수출입은행' },
  { value: 'B190016', label: '신용보증기금' },
  { value: 'B553077', label: '소상공인시장진흥공단' },
  { value: 'B552696', label: '한국무역보험공사' },
];

const POLICY_FINANCE_CODE_GROUPS = [
  'PLCY_FNNC_GDS_TYPE_CD',
  'PLCY_FNNC_GDS_STTS_CD',
  'PLCY_FNNC_APLY_MTH_CD',
  'PLCY_FNNC_RCPT_STTS_CD',
  'PLCY_FNNC_ENT_SCL_CD',
  'PLCY_FNNC_DTL_CND_CD',
];

const toMenuOptions = (codeList = []) =>
  codeList.map((item) => ({
    value: item.comCd,
    label: item.comCdNm,
  }));

const formatCommaSeparated = (value) =>
  value ? String(value).split(',').join(', ') : '-';

const getFallbackCursorFromRows = (rows) => {
  if (!rows?.length) return null;
  const lastRow = rows[rows.length - 1];
  return lastRow?.plcyFnncNo ? String(lastRow.plcyFnncNo) : null;
};

const parseNextCursor = (data, rows) => {
  const cursorCandidates = [
    data?.nextCursor,
    data?.cursor,
    data?.next,
    data?.cursorPageResponse?.nextCursor,
    data?.page?.nextCursor,
    getFallbackCursorFromRows(rows),
  ];

  const validCursor = cursorCandidates.find(
    (value) => value !== undefined && value !== null && value !== ''
  );

  return validCursor ?? null;
};

const parseHasNext = (data, rows, nextCursorValue) => {
  const raw =
    data?.hasNext ?? data?.cursorPageResponse?.hasNext ?? data?.page?.hasNext;

  if (typeof raw === 'boolean') return raw;
  if (raw === 'Y') return true;
  if (raw === 'N') return false;

  return rows.length >= PAGE_SIZE && Boolean(nextCursorValue);
};

export default function PolicyFinanceList() {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const appliedSearchParamsRef = useRef({
    bizFlfmtInstCd: '',
    plcyFnncGdsTypeCd: '',
    plcyFnncGdsSttsCd: '',
    plcyFnncAplyMthCd: '',
    plcyFnncRcptSttsCd: '',
    plcyFnncEntSclCd: '',
    plcyFnncDtlCndCd: '',
    plcyFnncNm: '',
  });

  const bizFlfmtInstMap = useMemo(
    () =>
      BIZ_FLFMT_INST_OPTIONS.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {}),
    []
  );

  const [gridPolicyFinanceList, setGridPolicyFinanceList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  const [plcyFnncGdsTypeOptions, setPlcyFnncGdsTypeOptions] = useState([]);
  const [plcyFnncGdsSttsOptions, setPlcyFnncGdsSttsOptions] = useState([]);
  const [plcyFnncAplyMthOptions, setPlcyFnncAplyMthOptions] = useState([]);
  const [plcyFnncRcptSttsOptions, setPlcyFnncRcptSttsOptions] = useState([]);
  const [plcyFnncEntSclOptions, setPlcyFnncEntSclOptions] = useState([]);
  const [plcyFnncDtlCndOptions, setPlcyFnncDtlCndOptions] = useState([]);

  const [searchParams, setSearchParams] = useState({
    bizFlfmtInstCd: '',
    plcyFnncGdsTypeCd: '',
    plcyFnncGdsSttsCd: '',
    plcyFnncAplyMthCd: '',
    plcyFnncRcptSttsCd: '',
    plcyFnncEntSclCd: '',
    plcyFnncDtlCndCd: '',
    plcyFnncNm: '',
  });

  const handleInputChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    fetchPolicyFinanceList(null, true);
  };

  const fetchPolicyFinanceList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const response = await http.post('/api/v1/policy-finance/search', {
        cursorPageRequest: {
          size: PAGE_SIZE,
          cursor: nextCursor,
        },
        condition: {
          useYn: 'Y',
          bizFlfmtInstCd: params.bizFlfmtInstCd,
          plcyFnncGdsTypeCd: params.plcyFnncGdsTypeCd,
          plcyFnncGdsSttsCd: params.plcyFnncGdsSttsCd,
          plcyFnncAplyMthCd: params.plcyFnncAplyMthCd,
          plcyFnncRcptSttsCd: params.plcyFnncRcptSttsCd,
          plcyFnncEntSclCd: params.plcyFnncEntSclCd,
          plcyFnncDtlCndCd: params.plcyFnncDtlCndCd,
          plcyFnncNm: params.plcyFnncNm,
        },
      });

      const data = response?.data || {};
      const policyFinanceList = data?.data || [];
      const resolvedTotalCount = Number(
        data?.totalCount ?? data?.totlaCount ?? 0
      );
      const formattedData = policyFinanceList.map((item, index) => ({
        id: item?.plcyFnncNo
          ? `policy-${item.plcyFnncNo}`
          : `policy-${nextCursor || 'first'}-${index}`,
        plcyFnncNo: item?.plcyFnncNo ?? null,
        plcyFnncGdsTypeCdNm:
          item?.plcyFnncGdsTypeCdNm || item?.plcyFnncGdsTypeCd || '-',
        bizFlfmtInstCdNm:
          item?.bizFlfmtInstCdNm ||
          bizFlfmtInstMap[item?.bizFlfmtInstCd] ||
          item?.bizFlfmtInstCd ||
          item?.bizFlfmtInstAbbrNm ||
          '-',
        plcyFnncNm: item?.plcyFnncNm || '-',
        plcyFnncAplyMthCdNm: formatCommaSeparated(
          item?.plcyFnncAplyMthCdNm || item?.plcyFnncAplyMthCd
        ),
        plcyFnncGdsSttsCdNm:
          item?.plcyFnncGdsSttsCdNm || item?.plcyFnncGdsSttsCd || '-',
        plcyFnncEntSclCdNm:
          item?.plcyFnncEntSclCdNm || item?.plcyFnncEntSclCd || '-',
        industry:
          [item?.tpbizLclsfCd, item?.ksicCd].filter(Boolean).join(' / ') || '-',
        plcyFnncDtlCndCdNm:
          item?.plcyFnncDtlCndCdNm || item?.plcyFnncDtlCndCd || '-',
        plcyFnncRcptSttsCdNm:
          item?.plcyFnncRcptSttsCdNm || item?.plcyFnncRcptSttsCd || '-',
        rgtrId: item?.rgtrId || '-',
        regDt: item?.regDt || null,
        mdfrId: item?.mdfrId || '-',
        mdfcnDt: item?.mdfcnDt || null,
      }));

      setGridPolicyFinanceList((prev) => {
        const merged = reset ? formattedData : [...prev, ...formattedData];
        const uniqueRows = [];
        const seen = new Set();

        merged.forEach((row, rowIndex) => {
          const key = row?.plcyFnncNo || row?.id || `policy-row-${rowIndex}`;
          if (seen.has(key)) return;
          seen.add(key);
          uniqueRows.push(row);
        });

        return uniqueRows.map((row, rowIndex) => ({
          ...row,
          index: rowIndex + 1,
        }));
      });

      const resolvedNextCursor = parseNextCursor(data, formattedData);
      const resolvedHasNext = parseHasNext(
        data,
        formattedData,
        resolvedNextCursor
      );

      setTotalCount(Number.isNaN(resolvedTotalCount) ? 0 : resolvedTotalCount);
      setCursor(resolvedNextCursor);
      setHasNext(resolvedHasNext);
    } catch (error) {
      console.error('정책금융 목록 조회 실패:', error);
      alert('정책금융 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setGridPolicyFinanceList([]);
      }
      setTotalCount(0);
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToDetail = (plcyFnncNo) => {
    if (!plcyFnncNo) {
      alert('정책금융번호가 없습니다.');
      return;
    }
    navigate(`${plcyFnncNo}`);
  };

  const handleMoveToUpdate = (plcyFnncNo) => {
    if (!plcyFnncNo) {
      alert('정책금융번호가 없습니다.');
      return;
    }
    navigate(`${plcyFnncNo}/update`);
  };

  const policyFinanceNameActionCell = createGridValueActionCell({
    valueKey: 'plcyFnncNm',
    fallback: '-',
    onClick: (row) => handleMoveToDetail(row?.plcyFnncNo),
    variant: 'link',
  });

  const columns = [
    { id: 'index', header: '순번', width: 44 },
    { id: 'plcyFnncGdsTypeCdNm', header: '유형', width: 45 },
    { id: 'bizFlfmtInstCdNm', header: '사업수행기관', width: 140 },
    {
      id: 'plcyFnncNm',
      header: '상품명',
      width: 230,
      dataAlign: 'left',
      cell: policyFinanceNameActionCell,
    },
    { id: 'plcyFnncAplyMthCdNm', header: '신청 방식', width: 90 },
    { id: 'plcyFnncGdsSttsCdNm', header: '승인여부', width: 80 },
    { id: 'plcyFnncEntSclCdNm', header: '기업 규모', width: 80 },
    { id: 'industry', header: '업종', width: 100 },
    { id: 'plcyFnncDtlCndCdNm', header: '우대기업유형', width: 100 },
    { id: 'plcyFnncRcptSttsCdNm', header: '접수 상황', width: 95 },
    { id: 'rgtrId', header: '등록자', width: 80 },
    {
      id: 'regDt',
      header: '등록 일시',
      width: 150,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    { id: 'mdfrId', header: '수정자', width: 80 },
    {
      id: 'mdfcnDt',
      header: '수정 일시',
      width: 150,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'management',
      header: '관리',
      width: 89,
      cell: ({ row }) => (
        <button
          type="button"
          className="defaultbutton edit"
          data-action="ignore-click"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleMoveToUpdate(row?.plcyFnncNo);
          }}
        >
          수정
        </button>
      ),
    },
  ];

  useEffect(() => {
    const fetchPolicyFinanceCodes = async () => {
      try {
        const response = await fetchCommonCodes(POLICY_FINANCE_CODE_GROUPS);
        const findCodeList = (groupId) =>
          response?.[groupId] ||
          response?.[groupId.toUpperCase()] ||
          response?.[groupId.toLowerCase()] ||
          [];

        setPlcyFnncGdsTypeOptions(
          toMenuOptions(findCodeList('plcy_fnnc_gds_type_cd'))
        );
        setPlcyFnncGdsSttsOptions(
          toMenuOptions(findCodeList('plcy_fnnc_gds_stts_cd'))
        );
        setPlcyFnncAplyMthOptions(
          toMenuOptions(findCodeList('plcy_fnnc_aply_mth_cd'))
        );
        setPlcyFnncRcptSttsOptions(
          toMenuOptions(findCodeList('plcy_fnnc_rcpt_stts_cd'))
        );
        setPlcyFnncEntSclOptions(
          toMenuOptions(findCodeList('plcy_fnnc_ent_scl_cd'))
        );
        setPlcyFnncDtlCndOptions(
          toMenuOptions(findCodeList('plcy_fnnc_dtl_cnd_cd'))
        );
      } catch (error) {
        console.error('정책금융 공통코드 조회 실패:', error);
      }
    };

    fetchPolicyFinanceCodes();
  }, []);

  useEffect(() => {
    fetchPolicyFinanceList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          const fallbackCursor =
            cursor ?? getFallbackCursorFromRows(gridPolicyFinanceList);
          fetchPolicyFinanceList(fallbackCursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading, gridPolicyFinanceList]);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>정책금융 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>정책금융 관리</li>
          <li className="on">정책금융 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="사업수행기관"
                menuSize="150px"
                options={BIZ_FLFMT_INST_OPTIONS}
                value={searchParams.bizFlfmtInstCd}
                onChange={(e) =>
                  handleInputChange('bizFlfmtInstCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="상품유형"
                menuSize="150px"
                options={plcyFnncGdsTypeOptions}
                value={searchParams.plcyFnncGdsTypeCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncGdsTypeCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="승인상태"
                menuSize="150px"
                options={plcyFnncGdsSttsOptions}
                value={searchParams.plcyFnncGdsSttsCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncGdsSttsCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="신청방식"
                menuSize="150px"
                options={plcyFnncAplyMthOptions}
                value={searchParams.plcyFnncAplyMthCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncAplyMthCd', e.target.value)
                }
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={() => fetchPolicyFinanceList(null, true)}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="select"
                menuName="접수상황"
                menuSize="150px"
                options={plcyFnncRcptSttsOptions}
                value={searchParams.plcyFnncRcptSttsCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncRcptSttsCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="기업규모"
                menuSize="150px"
                options={plcyFnncEntSclOptions}
                value={searchParams.plcyFnncEntSclCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncEntSclCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="우대기업유형"
                menuSize="150px"
                options={plcyFnncDtlCndOptions}
                value={searchParams.plcyFnncDtlCndCd}
                onChange={(e) =>
                  handleInputChange('plcyFnncDtlCndCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                menuName="상품명"
                placeholder="사업명을 입력하세요."
                value={searchParams.plcyFnncNm}
                onChange={(e) =>
                  handleInputChange('plcyFnncNm', e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="메세지 작성" />
              <Button btnType="add" btnNames="이메일 작성" />
              <Button btnType="list" btnNames="이용 가이드" />
            </div>
          </div>

          <div
            className="ongrid-tableform"
            style={{ scrollbarGutter: 'stable' }}
          >
            <GridTable data={gridPolicyFinanceList} columns={columns} />
            <div ref={observerRef} style={{ height: 40 }} />
            <div
              className="loading"
              style={{
                minHeight: 20,
                visibility: loading ? 'visible' : 'hidden',
              }}
            >
              데이터를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
