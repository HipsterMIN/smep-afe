import '@svar-ui/react-grid/all.css';

import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LIST_PATH = '/event-info';

const createSearchParams = () => ({
  evntInfoTtlNm: '', // 행사명
  evntInfoFlfmtInstNm: '', // 수행기관명
  evntInfoRgnNm: '', // 지역
});

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

export default function EventInfoList() {
  const apiRef = useRef(null);
  const formatDateTime = (iso) =>
    iso ? iso.replace('T', ' ').substring(0, 16) : '';
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [cursor, setCursor] = useState(null);
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const appliedSearchParamsRef = useRef(createSearchParams());
  const [searchParams, setSearchParams] = useState(createSearchParams());

  useEffect(() => {
    fetchEventInfo(null, true);
    // fetchCount(searchParams);
  }, []);

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
      const response = await http.get('/api/v1/event-info', {
        params: buildParams(paramsToApply),
      });
      setTotalCount(response?.data?.totalCount ?? 0);
    } catch (error) {
      setTotalCount(0);
    }
  };

  //행사정보 목록 조회
  const fetchEventInfo = async (nextCursor = null, reset = false) => {
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
      const res = await http.get(`/api/v1/event-info`, {
        params: apiParams,
      });

      const page = res?.data ?? res ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];

      const withCount = list.map((item) => ({
        ...item,
        evntInfoId: item?.evntInfoId,
      }));

      setRows((prev) => {
        const merged = reset ? withCount : [...prev, ...withCount];
        const unique = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key = row?.evntInfoId;
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
      if (reset) setTotalCount(page?.totalCount ?? 0); // 목록 조회 시 받은 totalCount 반영
    } catch (error) {
      console.error('행사정보 목록 조회 실패:', error);
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

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => fetchEventInfo(cursor, false),
  });

  const handleSearch = () => {
    setRows([]);
    setCursor(null);
    setHasNext(true);
    fetchEventInfo(null, true);
    // fetchCount(searchParams);
  };

  const handleSave = async (formData) => {
    try {
      await http.post(`/api/v1/event-info`, formData);
      alert('행사 정보가 등록되었습니다.');

      fetchEventInfo(null, true);
      fetchCount(searchParams);
    } catch (error) {
      console.error('행사 정보 저장 실패:', error);

      const errorMessage =
        error.response?.data?.message || '행사 정보 저장에 실패했습니다.';
      alert(errorMessage);
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

  const eventInfoColumns = useMemo(
    () => [
      {
        id: '_rowIndex', // 번호 (순차적 번호)
        width: 60,
        header: '번호',
        headerAlign: 'center',
        dataAlign: 'center',
      },
      {
        id: 'evntInfoRgnNm', // 지역
        width: 100,
        header: '지역',
        dataAlign: 'center',
      },
      {
        id: 'evntInfoTtlNm', // 제목
        flexgrow: 2, // 제목이 가장 길게 차지하도록 설정
        header: '제목',
        dataAlign: 'left',
        cell: ({ row }) => (
          <span
            className="onlink-text" // 링크처럼 보이게 하는 클래스 (있다면 사용)
            style={{
              cursor: 'pointer',
              color: '#0056b3',
              textDecoration: 'underline',
              fontWeight: '500',
            }}
            onClick={() => {
              console.log(row.evntInfoId);
              // 상세 조회 페이지(detail)로 이동
              navigate(`${row.evntInfoId}`);
            }}
          >
            {row.evntInfoTtlNm}
          </span>
        ),
      },
      {
        id: 'evntPrdCn', // 행사기간
        width: 200,
        header: '행사기간',
        dataAlign: 'center',
      },
      {
        id: 'evntInfoFlfmtInstNm', // 수행기관
        width: 150,
        header: '수행기관',
        dataAlign: 'left',
      },
      {
        id: 'regDt',
        width: 120,
        header: '작성일',
        dataAlign: 'center',
        cell: (props) => formatDateTime(props.row.regDt),
      },
      {
        id: 'inqCnt', // 조회수
        width: 80,
        header: '조회수',
        headerAlign: 'center',
        dataAlign: 'right',
      },
      {
        id: 'edit',
        width: 80,
        header: '관리',
        dataAlign: 'center',
        cell: (props) => (
          <Button
            btnType="small add"
            btnNames="수정"
            onClick={() => {
              const id = props.row.evntInfoId;
              if (id) {
                navigate(`${id}/edit`);
              }
            }}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>행사 정보</h2>
        <ul className="onbreadcrumb">
          <li>정보 제공</li>
          <li>활용정보 관리</li>
          <li className="on">행사 정보</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="행사명"
                menuSize="200px"
                value={searchParams.evntInfoTtlNm}
                onChange={(e) =>
                  handleInputChange('evntInfoTtlNm', e.target.value)
                }
              />
              <MenuInputBox
                menuType="input"
                menuName="수행기관명"
                menuSize="200px"
                value={searchParams.evntInfoFlfmtInstNm}
                onChange={(e) =>
                  handleInputChange('evntInfoFlfmtInstNm', e.target.value)
                }
              />
              <MenuInputBox
                menuType="input"
                menuName="지역"
                menuSize="150px"
                value={searchParams.evntInfoRgnNm}
                onChange={(e) =>
                  handleInputChange('evntInfoRgnNm', e.target.value)
                }
              />
              <div style={{ marginLeft: 'auto' }}>
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
            <div style={{ marginLeft: 'auto' }}>
              <Button
                btnType="add"
                btnNames="등록"
                onClick={() => navigate('create')}
              />
            </div>
          </div>

          <div className="ongrid-tableform">
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  height: 'max(420px, calc(100dvh - 390px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  data={rows}
                  columns={eventInfoColumns}
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
