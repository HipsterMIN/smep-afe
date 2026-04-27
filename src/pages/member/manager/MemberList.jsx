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

import MemberDetailPanel from './components/MemberDetailPanel.jsx';
import MemberEditPanel from './components/MemberEditPanel.jsx';

const PAGE_SIZE = 20;
const MEMBER_TYPE_CODES = ['IND', 'ENT'];
const ONCONTENTS_MAX_HEIGHT = 'calc(100vh - 247px)';
const SPLIT_PANEL_HEIGHT = `min(700px, ${ONCONTENTS_MAX_HEIGHT})`;
const SPLIT_PANEL_STYLE = { height: SPLIT_PANEL_HEIGHT };
const DEFAULT_SEARCH_PARAMS = {
  mbrTypeCd: '',
  mbrSttsCd: '',
  mbrNm: '',
  joinStartDt: null,
  endJoinDt: null,
  startRegDt: null,
  endRegDt: null,
};

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
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    if (isCursorPagedPayload(response)) {
      return response;
    }

    const responseData = response.data;

    // http 인터셉터와 ApiResponse 래핑을 거치면 페이지 객체가 response.data에 한 번 더 들어온다.
    // 여기서 배열까지 벗기면 nextCursor/hasNext를 잃고 목록이 빈 배열처럼 처리된다.
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

    return response.data ?? response;
  }

  return response ?? {};
}

function getFallbackCursorFromRows(rows) {
  if (!rows?.length) return null;
  const lastRow = rows[rows.length - 1];
  return lastRow?.mbrNo || lastRow?.lgnId || null;
}

function normalizeMemberRow(row, rowIndex) {
  return {
    ...row,
    id: row?.mbrNo || row?.lgnId || `member-${rowIndex}`,
    index: rowIndex + 1,
  };
}

function normalizeMemberRows(rows) {
  const uniqueRows = [];
  const seen = new Set();

  rows.forEach((row, rowIndex) => {
    const key =
      row?.mbrNo || row?.lgnId || `${row?.mbrNm || 'member'}-${rowIndex}`;
    if (seen.has(key)) return;
    seen.add(key);
    uniqueRows.push(row);
  });

  return uniqueRows.map(normalizeMemberRow);
}

export default function MemberList() {
  const [gridMemberList, setGridMemberList] = useState([]);
  const [mbrSttscdList, setMbrSttscdList] = useState([]);
  const [mbrTypecdList, setMbrTypecdList] = useState([]);
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [saving, setSaving] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [rightMode, setRightMode] = useState('empty');
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const detailRequestSeqRef = useRef(0);
  const appliedSearchParamsRef = useRef(DEFAULT_SEARCH_PARAMS);

  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '회원 관리';

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

  const buildSearchRequest = (params, nextCursor) => {
    const selectedType = params.mbrTypeCd;

    // 이 화면의 "전체"는 회원 전체가 아니라 개인/기업 전체다.
    // MNG가 커서 페이지에 끼면 화면 필터 후 누락이 생기므로 서버 조회 조건으로 먼저 제한한다.
    return {
      cursorPageRequest: {
        size: PAGE_SIZE,
        cursor: nextCursor,
      },
      mbrTypeCd: selectedType || null,
      mbrTypeCds: selectedType ? [selectedType] : MEMBER_TYPE_CODES,
      mbrSttsCd: params.mbrSttsCd,
      mbrNm: params.mbrNm,
      startRegDt: params.startRegDt,
      endRegDt: params.endRegDt,
    };
  };

  async function fetchMemberDetail(mbrNo, nextMode = 'detail') {
    if (!mbrNo) return;

    // 자동 첫 행 상세와 사용자 직접 클릭이 겹칠 수 있어 최신 요청만 우측 패널을 갱신한다.
    const requestSeq = detailRequestSeqRef.current + 1;
    detailRequestSeqRef.current = requestSeq;

    try {
      setDetailLoading(true);
      setDetailError('');
      const response = await http.get(
        `/api/v1/member/${encodeURIComponent(mbrNo)}`
      );
      const data = resolvePayload(response);

      if (detailRequestSeqRef.current !== requestSeq) return;

      if (!MEMBER_TYPE_CODES.includes(data?.mbrTypeCd)) {
        setSelectedMember(null);
        setRightMode('empty');
        setDetailError('개인/기업 회원만 처리할 수 있습니다.');
        return;
      }

      setSelectedMember(data);
      setRightMode(nextMode);
    } catch (error) {
      if (detailRequestSeqRef.current !== requestSeq) return;

      console.error('[MemberList] 회원 상세 조회 실패', error);
      setDetailError('회원 정보를 불러오는데 실패했습니다.');
      setRightMode('detail');
    } finally {
      if (detailRequestSeqRef.current === requestSeq) {
        setDetailLoading(false);
      }
    }
  }

  async function fetchMemberList(nextCursor = null, reset = false) {
    if (loadingRef.current) return;
    if (!hasNext && !reset) return;

    loadingRef.current = true;
    setLoading(true);
    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
      detailRequestSeqRef.current += 1;
      setDetailLoading(false);
      setSelectedMember(null);
      setRightMode('empty');
      setDetailError('');
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const response = await http.post(
        '/api/v1/member/search',
        buildSearchRequest(params, nextCursor)
      );
      const data = resolvePayload(response);
      const memberList = Array.isArray(data?.data) ? data.data : [];
      const resetRows = reset ? normalizeMemberRows(memberList) : null;

      setGridMemberList((prev) => {
        if (reset) return resetRows;
        return normalizeMemberRows([...prev, ...memberList]);
      });

      if (reset) {
        const firstRow = resetRows.find((row) => row?.mbrNo);
        if (firstRow) {
          fetchMemberDetail(firstRow.mbrNo, 'detail');
        }
      }

      const resolvedNextCursor = parseNextCursor(data, memberList);
      const resolvedHasNext = parseHasNext(
        data,
        memberList,
        resolvedNextCursor
      );

      setCursor(resolvedNextCursor);
      setHasNext(resolvedHasNext);
    } catch (error) {
      console.error('[MemberList] 회원 목록 조회 실패', error);
      alert('회원 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setGridMemberList([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  function handleSearchParamChange(name, value) {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSearch() {
    setCursor(null);
    setHasNext(true);
    fetchMemberList(null, true);
  }

  function handleSearchKeyDown(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleSearch();
  }

  function handleShowDetail(row) {
    fetchMemberDetail(row?.mbrNo, 'detail');
  }

  function handleShowEdit(row) {
    fetchMemberDetail(row?.mbrNo, 'edit');
  }

  async function handleSaved(updatedMember) {
    const savedMbrNo = updatedMember?.mbrNo || selectedMember?.mbrNo;
    if (savedMbrNo) {
      await fetchMemberDetail(savedMbrNo, 'detail');
    }
  }

  useEffect(() => {
    const fetchCommonCode = async () => {
      try {
        const response = await fetchCommonCodes(['MBR_TYPE_CD', 'MBR_STTS_CD']);

        const mbrTypeOptions = (response.MBR_TYPE_CD || [])
          .filter((item) => MEMBER_TYPE_CODES.includes(item.comCd))
          .map((item) => ({
            value: item.comCd,
            label: item.comCdNm,
          }));

        const mbrSttsOptions = (response.MBR_STTS_CD || []).map((item) => ({
          value: item.comCd,
          label: item.comCdNm,
        }));

        setMbrTypecdList(mbrTypeOptions);
        setMbrSttscdList(mbrSttsOptions);
      } catch (error) {
        console.error('[MemberList] 공통코드 조회 실패', error);
      }
    };
    fetchCommonCode();
  }, []);

  useEffect(() => {
    fetchMemberList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid 내부 .wx-scroll만 append 트리거로 삼아 외부 wrapper와 sentinel 재계산으로 생기는 우측 여백 흔들림을 막는다.
  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => {
      const nextCursor = cursor ?? getFallbackCursorFromRows(gridMemberList);
      if (nextCursor !== null && nextCursor !== undefined) {
        fetchMemberList(nextCursor, false);
      }
    },
  });

  const defaultColumns = [
    { id: 'index', header: '순번', width: 42 },
    { id: 'mbrTypeCdNm', header: '유형', flexgrow: 1 },
    { id: 'lgnId', header: 'ID', flexgrow: 1 },
    {
      id: 'mbrNm',
      header: '성명',
      flexgrow: 0.5,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => handleShowDetail(row)}
          style={{
            background: 'none',
            border: 0,
            padding: 0,
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlinePosition: 'under',
          }}
        >
          {row?.mbrNm || '-'}
        </button>
      ),
    },
    { id: 'telno', header: '전화번호', width: 110 },
    { id: 'emlAddr', header: '이메일', flexgrow: 1 },
    { id: 'mbrSttsCdNm', header: '상태', flexgrow: 0.5 },
    {
      id: 'regDt',
      flexgrow: 2,
      header: '등록일시',
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'management',
      header: '관리',
      width: 76,
      cell: ({ row }) => (
        <button
          type="button"
          className="defaultbutton edit"
          onClick={(event) => {
            event.stopPropagation();
            handleShowEdit(row);
          }}
        >
          수정
        </button>
      ),
    },
  ];

  const rightPanel =
    // URL 라우팅 대신 React state가 우측 패널의 단일 상태 원천이다.
    // 좌측 목록 state를 보존하면서 상세/수정 컴포넌트만 교체하기 위한 구조다.
    rightMode === 'edit' ? (
      <MemberEditPanel
        member={selectedMember}
        statusOptions={mbrSttscdList}
        panelStyle={SPLIT_PANEL_STYLE}
        saving={saving}
        onCancel={() => setRightMode(selectedMember ? 'detail' : 'empty')}
        onSaved={handleSaved}
        onSavingChange={setSaving}
      />
    ) : (
      <MemberDetailPanel
        member={selectedMember}
        loading={detailLoading}
        error={detailError}
        panelStyle={SPLIT_PANEL_STYLE}
        onEdit={handleShowEdit}
      />
    );

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="oncontent" style={SPLIT_PANEL_STYLE}>
          <div className="ongrid-form">
            <h4>회원 목록</h4>
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="회원유형"
                  inputId="mbrTypeCd"
                  options={mbrTypecdList}
                  value={searchParams.mbrTypeCd}
                  onChange={(event) =>
                    handleSearchParamChange('mbrTypeCd', event.target.value)
                  }
                  onKeyDown={handleSearchKeyDown}
                />
                <MenuInputBox
                  menuType="input"
                  menuName="회원 명"
                  inputId="mbrNm"
                  menuSize="150px"
                  value={searchParams.mbrNm}
                  onChange={(event) =>
                    handleSearchParamChange('mbrNm', event.target.value)
                  }
                  onKeyDown={handleSearchKeyDown}
                />
                <MenuInputBox
                  menuType="select"
                  menuName="상태"
                  inputId="mbrSttsCd"
                  options={mbrSttscdList}
                  value={searchParams.mbrSttsCd}
                  onChange={(event) =>
                    handleSearchParamChange('mbrSttsCd', event.target.value)
                  }
                  onKeyDown={handleSearchKeyDown}
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
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="가입기간"
                    value={searchParams.joinStartDt}
                    outputFormat="datetime"
                    disabled
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    value={searchParams.endJoinDt}
                    outputFormat="datetime"
                    disabled
                  />
                </div>
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="등록기간"
                    value={searchParams.startRegDt}
                    outputFormat="datetime"
                    onChange={(date) =>
                      handleSearchParamChange('startRegDt', date)
                    }
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    value={searchParams.endRegDt}
                    outputFormat="datetime"
                    onChange={(date) =>
                      handleSearchParamChange('endRegDt', date)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{gridMemberList.length}</b>건
            </span>
            <Button btnType="add" btnNames="등록" disabled />
          </div>

          <div
            className="ongrid-tableform"
            style={{ scrollbarGutter: 'stable' }}
          >
            <Willow>
              <div
                ref={gridViewportRef}
                style={{
                  height: '530px',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  data={gridMemberList}
                  columns={defaultColumns}
                  useWillow={false}
                />
              </div>
            </Willow>
          </div>
        </div>

        {rightPanel}
      </div>
    </div>
  );
}
