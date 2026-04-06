import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

const DEFAULT_SEARCH_PARAMS = {
  lgnId: '',
  mbrNm: '',
  roleId: '',
  useYn: '',
};

const STATUS_OPTIONS = [
  { value: 'Y', label: '유효' },
  { value: 'N', label: '폐기' },
];

const DEFAULT_ROLE_SEARCH_OPTIONS = [{ value: '', label: '전체' }];

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

// 관리자 목록 API는 axios raw response / {data:{...}} / payload 직접 반환 형태가 섞여 있었다.
// 화면은 응답 래퍼 차이보다 목록 계약 자체에만 집중할 수 있도록 여기서 한 번 평탄화한다.
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

function resolveCount(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeManagerRow(item, index) {
  const mbrNo = item?.mbrNo ?? item?.mngMbrNo ?? item?.id ?? '';
  const lgnId = item?.lgnId ?? item?.loginId ?? '-';
  const mbrNm = item?.mbrNm ?? item?.managerName ?? '-';
  const roleId = item?.roleId ?? '';
  const roleNm = item?.roleNm ?? item?.roleName ?? '-';
  const useYn = item?.useYn ?? '-';
  const regDt = item?.regDt ?? item?.rgtrDt ?? item?.createDt ?? null;
  const mdfcnDt = item?.mdfcnDt ?? item?.mdfcnDtm ?? item?.modifyDt ?? null;

  // 번호는 서버 rowIndex를 신뢰하지 않고, 화면에서 최종 머지 순서 기준으로 다시 부여한다.
  return {
    id: mbrNo || lgnId || `manager-${index}`,
    no: index + 1,
    mbrNo,
    lgnId,
    mbrNm,
    roleId,
    roleNm,
    useYn,
    useYnNm: useYn === 'Y' ? '유효' : useYn === 'N' ? '폐기' : '-',
    regDt,
    mdfcnDt,
  };
}

export default function ManagerList() {
  const navigate = useNavigate();
  const matches = useMatches();
  const gridViewportRef = useRef(null);
  const loadingRef = useRef(false);
  const appliedSearchParamsRef = useRef(DEFAULT_SEARCH_PARAMS);

  const [gridManagerList, setGridManagerList] = useState([]);
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);
  const [roleOptions, setRoleOptions] = useState(DEFAULT_ROLE_SEARCH_OPTIONS);
  const [roleLoading, setRoleLoading] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '관리자 목록';
  const displayTotalCount =
    totalCount === null || totalCount === undefined
      ? gridManagerList.length
      : totalCount;

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
    handleSearch();
  }

  function handleMoveToEdit(row) {
    if (!row?.mbrNo) {
      return;
    }

    navigate(`${row.mbrNo}/update`);
  }

  async function fetchRoleOptions() {
    try {
      setRoleLoading(true);
      const response = await http.get('/api/v1/roles');
      const payload = resolvePayload(response);
      const sourceList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      const normalizedOptions = sourceList
        .map((item) => ({
          value: item?.roleId ?? '',
          label: item?.roleNm ?? '',
        }))
        .filter((item) => item.value && item.label);

      setRoleOptions([...DEFAULT_ROLE_SEARCH_OPTIONS, ...normalizedOptions]);
    } catch (error) {
      console.error('[ManagerList] 권한그룹 목록 조회 실패', error);
      setRoleOptions(DEFAULT_ROLE_SEARCH_OPTIONS);
    } finally {
      setRoleLoading(false);
    }
  }

  async function fetchManagerList(nextCursor = null, reset = false) {
    if (loadingRef.current) {
      return;
    }

    if (!reset && !hasNext) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    if (reset) {
      // 무한 스크롤 중 검색어가 바뀌어도 현재 페이지네이션은 "검색 버튼을 눌렀을 때의 조건"으로 고정한다.
      appliedSearchParamsRef.current = { ...searchParams };
    }

    const requestSearchParams = reset
      ? searchParams
      : appliedSearchParamsRef.current;

    try {
      const response = await http.post('/api/v1/managers/search', {
        cursorPageRequest: {
          size: PAGE_SIZE,
          cursor: nextCursor,
        },
        lgnId: requestSearchParams.lgnId,
        mbrNm: requestSearchParams.mbrNm,
        roleId: requestSearchParams.roleId,
        useYn: requestSearchParams.useYn,
      });

      const payload = resolvePayload(response);
      const sourceList = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      const normalizedList = sourceList.map(normalizeManagerRow);
      const resolvedTotalCount = resolveCount(payload?.totalCount);
      const resolvedNextCursor =
        payload?.nextCursor ??
        payload?.cursor ??
        normalizedList.at(-1)?.mbrNo ??
        null;
      const resolvedHasNext =
        typeof payload?.hasNext === 'boolean'
          ? payload.hasNext
          : normalizedList.length >= PAGE_SIZE && Boolean(resolvedNextCursor);

      setGridManagerList((prevList) => {
        const merged = reset
          ? normalizedList
          : [...prevList, ...normalizedList];
        const uniqueMap = new Map();

        // 커서 재호출이나 느린 응답으로 동일 회원이 다시 들어와도 Grid는 1행만 유지한다.
        merged.forEach((row, index) => {
          const uniqueKey =
            row?.mbrNo || row?.lgnId || row?.id || `row-${index}`;
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
      setTotalCount(resolvedTotalCount);
    } catch (error) {
      console.error('[ManagerList] 관리자 목록 조회 실패', error);
      if (reset) {
        setGridManagerList([]);
        setTotalCount(null);
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
    setGridManagerList([]);
    setTotalCount(null);
    fetchManagerList(null, true);
  }

  useEffect(() => {
    fetchRoleOptions();
    fetchManagerList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGridInfiniteScroll({
    viewportRef: gridViewportRef,
    loading,
    loadingRef,
    hasNext,
    onLoadMore: () => {
      if (cursor !== null && cursor !== undefined) {
        fetchManagerList(cursor, false);
      }
    },
  });

  const columns = [
    { id: 'no', header: '번호', width: 90 },
    { id: 'lgnId', header: '아이디', width: 180 },
    { id: 'mbrNm', header: '관리자명', width: 200 },
    {
      id: 'roleNm',
      header: '권한그룹명',
      width: 390,
      cell: ({ row }) => row?.roleNm || '-',
    },
    { id: 'useYnNm', header: '사용여부', width: 120 },
    {
      id: 'mdfcnDt',
      header: '최종수정일',
      width: 220,
      cell: ({ row }) => formatTimestamp(row?.mdfcnDt),
    },
    {
      id: 'regDt',
      header: '최초생성일',
      width: 220,
      cell: ({ row }) => formatTimestamp(row?.regDt),
    },
    {
      id: 'management',
      header: '관리',
      width: 140,
      cell: ({ row }) => (
        <button
          type="button"
          className="defaultbutton edit"
          data-action="ignore-click"
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            handleMoveToEdit(row);
          }}
        >
          수정
        </button>
      ),
    },
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
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
                inputId="manager-search-lgnId"
                menuSize="150px"
                placeholder="아이디 입력"
                value={searchParams.lgnId}
                onChange={(event) =>
                  handleInputChange('lgnId', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="관리자명"
                inputId="manager-search-mbrNm"
                menuSize="150px"
                placeholder="관리자명 입력"
                value={searchParams.mbrNm}
                onChange={(event) =>
                  handleInputChange('mbrNm', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="권한그룹"
                inputId="manager-search-roleId"
                menuSize="100px"
                options={roleOptions}
                showAllOption={false}
                value={searchParams.roleId}
                onChange={(event) =>
                  handleInputChange('roleId', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                disabled={roleLoading}
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                inputId="manager-search-useYn"
                menuSize="100px"
                options={STATUS_OPTIONS}
                value={searchParams.useYn}
                onChange={(event) =>
                  handleInputChange('useYn', event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
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
              총 <b>{displayTotalCount}</b>건
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
                  height: 'max(420px, calc(100dvh - 400px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  data={gridManagerList}
                  columns={columns}
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
