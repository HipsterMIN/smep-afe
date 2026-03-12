import Button from '@components/ui/Button';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

export default function PolicyFinanceList() {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const rowsRef = useRef([]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState({
    linkSystem: '',
    productType: '',
    approvalStatus: '',
    applyMethod: '',
    receiptStatus: '',
    companyScale: '',
    preferredCompanyType: '',
    productName: '',
  });

  const managementActionCell = createGridValueActionCell({
    getValue: () => '수정',
    fallback: '수정',
    onClick: (row) => {
      if (!row?.plcyFnncGdsSn) return;
      navigate(`${row.plcyFnncGdsSn}/update`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
  });

  const columns = [
    {
      id: 'rowNumber',
      header: '순번',
      width: 50,
      cell: ({ row }) => {
        if (!Number.isFinite(row?._rowIndex)) return '-';
        if (!Number.isFinite(totalCount) || totalCount <= 0) {
          return row._rowIndex;
        }

        const calculated = totalCount - (row._rowIndex - 1);
        return calculated > 0 ? calculated : row._rowIndex;
      },
    },
    {
      id: 'plcyFnncGdsTypeCdNm',
      header: '유형',
      width: 60,
      cell: ({ row }) => toDisplayText(row?.plcyFnncGdsTypeCdNm),
    },
    {
      id: 'plcyFnncAplyMthCdNm',
      header: '신청방식',
      width: 170,
      dataAlign: 'left',
      cell: ({ row }) => toDisplayText(row?.plcyFnncAplyMthCdNm),
    },
    {
      id: 'approvalStatus',
      header: '승인여부',
      width: 80,
      cell: ({ row }) => toDisplayText(row?.plcyFnncGdsSttsCdNm),
    },
    {
      id: 'plcyFnncEntSclCdNm',
      header: '기업규모',
      width: 160,
      dataAlign: 'left',
      cell: ({ row }) => toDisplayText(row?.plcyFnncEntSclCdNm),
    },
    {
      id: 'industry',
      header: '업종',
      width: 170,
      dataAlign: 'left',
      cell: ({ row }) => toDisplayText(row?.plcyFnncTpbizNmNm),
    },
    {
      id: 'preferredEnterpriseType',
      header: '우대기업유형',
      width: 180,
      dataAlign: 'left',
      cell: ({ row }) => toDisplayText(row?.plcyFnncAddDtlCndCnNm),
    },
    {
      id: 'plcyFnncRcptSttsCdNm',
      header: '접수상황',
      width: 90,
      cell: ({ row }) => toDisplayText(row?.plcyFnncRcptSttsCdNm),
    },
    {
      id: 'rgtrId',
      header: '등록자',
      width: 90,
      cell: ({ row }) => toDisplayText(row?.rgtrId),
    },
    {
      id: 'regDt',
      header: '등록일시',
      width: 160,
      cell: ({ row }) => formatDate(row?.regDt, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'mdfrId',
      header: '수정자',
      width: 90,
      cell: ({ row }) => toDisplayText(row?.mdfrId),
    },
    {
      id: 'mdfcnDt',
      header: '수정일시',
      width: 170,
      cell: ({ row }) => formatDate(row?.mdfcnDt, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'management',
      header: '관리',
      width: 90,
      cell: managementActionCell,
    },
  ];

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);

    try {
      const response = await http.post('/api/v1/policy-finance/search', {
        cursorPageRequest: {
          size: PAGE_SIZE,
          cursor: nextCursor,
        },
      });

      const page = response?.data ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];
      const baseRows = reset ? [] : rowsRef.current;
      const mergedRows = [...baseRows, ...list];
      const uniqueRows = [];
      const seen = new Set();

      mergedRows.forEach((item, index) => {
        const key =
          item?.plcyFnncGdsSn !== null && item?.plcyFnncGdsSn !== undefined
            ? String(item.plcyFnncGdsSn)
            : `${item?.plcyFnncGdsCd || 'policy-finance'}-${index}`;

        if (seen.has(key)) return;
        seen.add(key);
        uniqueRows.push(item);
      });

      const numberedRows = uniqueRows.map((item, rowIndex) => ({
        ...item,
        _rowIndex: rowIndex + 1,
      }));
      setRows(numberedRows);
      rowsRef.current = numberedRows;

      const nextTotalCount = Number(page?.totalCount);
      setTotalCount(
        Number.isFinite(nextTotalCount) && nextTotalCount >= 0
          ? nextTotalCount
          : numberedRows.length
      );
      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (error) {
      console.error('정책금융 목록 조회 실패:', error);
      alert('정책금융 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setRows([]);
        setTotalCount(0);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchList(null, true);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    fetchList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchList(cursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading]);

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
                menuName="연계시스템"
                menuSize="150px"
                value={searchParams.linkSystem}
                onChange={(e) => handleInputChange('linkSystem', e)}
              />
              <MenuInputBox
                menuType="select"
                menuName="상품유형"
                menuSize="150px"
                value={searchParams.productType}
                onChange={(e) => handleInputChange('productType', e)}
              />
              <MenuInputBox
                menuType="select"
                menuName="승인여부"
                menuSize="150px"
                value={searchParams.approvalStatus}
                onChange={(e) => handleInputChange('approvalStatus', e)}
              />
              <MenuInputBox
                menuType="select"
                menuName="신청방식"
                menuSize="150px"
                value={searchParams.applyMethod}
                onChange={(e) => handleInputChange('applyMethod', e)}
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="select"
                menuName="접수상황"
                menuSize="150px"
                value={searchParams.receiptStatus}
                onChange={(e) => handleInputChange('receiptStatus', e)}
              />
              <MenuInputBox
                menuType="select"
                menuName="기업규모"
                menuSize="150px"
                value={searchParams.companyScale}
                onChange={(e) => handleInputChange('companyScale', e)}
              />
              <MenuInputBox
                menuType="select"
                menuName="우대기업유형"
                menuSize="150px"
                value={searchParams.preferredCompanyType}
                onChange={(e) => handleInputChange('preferredCompanyType', e)}
              />
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                menuName="상품명"
                placeholder="사업명을 입력하세요."
                value={searchParams.productName}
                onChange={(e) => handleInputChange('productName', e)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount.toLocaleString()}</b>건
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="메세지 작성" />
              <Button btnType="add" btnNames="이메일 작성" />
              <Button btnType="list" btnNames="이용 가이드" />
              <Button
                btnType="add"
                btnNames="등록"
                onClick={() => navigate('create')}
              />
            </div>
          </div>

          <div className="ongrid-tableform">
            <GridTable data={rows} columns={columns} />
            <div ref={observerRef} style={{ height: 40 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
