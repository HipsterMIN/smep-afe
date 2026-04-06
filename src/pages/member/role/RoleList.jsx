import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import SearchBox from '@components/ui/SearchBox.jsx';
import http from '@lib/http.js';
import RoleForm from '@pages/member/role/components/RoleForm.jsx';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_SEARCH_KEYWORD = '';
const ROLE_USE_YN_REQUESTS = ['Y', 'N'];
const EMPTY_MEMBER_COLUMNS = [];

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }

    return responseData ?? response ?? [];
  }

  return response ?? [];
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

function normalizeUseYnLabel(value) {
  if (value === 'Y') {
    return '사용';
  }

  if (value === 'N') {
    return '미사용';
  }

  return '-';
}

function normalizeRoleRow(item, index) {
  const roleId = item?.roleId ?? item?.id ?? `role-${index}`;
  const roleNm = item?.roleNm ?? item?.name ?? '-';
  const useYn = item?.useYn ?? '';
  const sortSeq = Number(item?.sortSeq ?? Number.MAX_SAFE_INTEGER);

  return {
    id: roleId,
    no: index + 1,
    roleId,
    roleNm,
    useYn,
    useYnNm: normalizeUseYnLabel(useYn),
    sortSeq: Number.isFinite(sortSeq) ? sortSeq : Number.MAX_SAFE_INTEGER,
    mdfcnDt: item?.mdfcnDt ?? item?.regDt ?? null,
  };
}

function sortRoleRows(a, b) {
  if (a.sortSeq !== b.sortSeq) {
    return a.sortSeq - b.sortSeq;
  }

  return String(a.roleId).localeCompare(String(b.roleId));
}

export default function RoleList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(DEFAULT_SEARCH_KEYWORD);
  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [roleFormMode, setRoleFormMode] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  async function fetchRoleList(nextKeyword = '') {
    setLoading(true);

    try {
      const normalizedKeyword = nextKeyword.trim();

      // 현재 roles API는 useYn을 한 번에 하나만 받으므로,
      // 관리 화면에서는 Y/N를 각각 조회한 뒤 합쳐 전체 권한 목록처럼 사용한다.
      const responses = await Promise.all(
        ROLE_USE_YN_REQUESTS.map((useYn) =>
          http.get('/api/v1/roles', {
            params: {
              intgSysSeCd: 'PIIO',
              mbrTypeCd: 'MNG',
              useYn,
              ...(normalizedKeyword ? { roleNm: normalizedKeyword } : {}),
            },
          })
        )
      );

      const mergedMap = new Map();

      responses.forEach((response) => {
        const payload = resolvePayload(response);
        const items = Array.isArray(payload) ? payload : [];

        items.forEach((item, index) => {
          const row = normalizeRoleRow(item, index);
          mergedMap.set(row.roleId, row);
        });
      });

      const mergedRows = [...mergedMap.values()]
        .sort(sortRoleRows)
        .map((row) => ({
          ...row,
        }));

      setRoleList(mergedRows);
    } catch (error) {
      console.error('[RoleList] 권한 목록 조회 실패', error);
      setRoleList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoleList(DEFAULT_SEARCH_KEYWORD);
  }, []);

  function handleSearch() {
    fetchRoleList(keyword);
  }

  function handleSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleSearch();
  }

  function handleMoveToMenu(row) {
    if (!row?.roleId) {
      return;
    }

    navigate(`${row.roleId}`);
  }

  function handleOpenRoleForm(row) {
    if (!row?.roleId) {
      return;
    }

    setRoleFormMode('update');
    setSelectedRoleId(row.roleId);
    setIsRoleFormOpen(true);
  }

  function handleOpenRoleCreate() {
    setRoleFormMode('create');
    setSelectedRoleId(null);
    setIsRoleFormOpen(true);
  }

  function handleCloseRoleForm() {
    setIsRoleFormOpen(false);
    setRoleFormMode(null);
    setSelectedRoleId(null);
  }

  async function handleSavedRole(mode) {
    if (mode === 'create') {
      setKeyword(DEFAULT_SEARCH_KEYWORD);
      await fetchRoleList(DEFAULT_SEARCH_KEYWORD);
    } else {
      await fetchRoleList(keyword);
    }

    handleCloseRoleForm();
  }

  const roleColumns = [
    { id: 'no', header: '번호', width: 50 },
    { id: 'roleId', header: '권한ID', width: 120 },
    { id: 'roleNm', header: '권한명', width: 170, dataAlign: 'left' },
    { id: 'useYnNm', header: '사용여부', width: 80 },
    {
      id: 'mdfcnDt',
      header: '최종수정일',
      width: 180,
      cell: ({ row }) => formatTimestamp(row?.mdfcnDt),
    },
    {
      id: 'menu',
      header: '메뉴',
      width: 90,
      dataAlign: 'center',
      cell: ({ row }) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            btnType="edit small"
            btnNames="메뉴"
            onClick={() => handleMoveToMenu(row)}
          />
        </div>
      ),
    },
    {
      id: 'management',
      header: '관리',
      width: 90,
      cell: ({ row }) => (
        <Button
          btnType="edit small"
          btnNames="수정"
          onClick={() => handleOpenRoleForm(row)}
        />
      ),
    },
  ];

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>관리자 권한그룹 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>권한 관리</li>
          <li className="on">관리자 권한그룹 관리</li>
        </ul>
      </div>

      <div className="oncontents space" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>권한그룹</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormGroup"
                placeholder="검색어를 입력하세요."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleSearch}
                disabled={loading}
              />
              <Button btnType="add" btnNames="추가" onClick={handleOpenRoleCreate} />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable columns={roleColumns} data={roleList} />
          </div>
        </div>

        <div className="oncontent">
          <div className="ongrid-form">
            <h4>소속인원</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormChild"
                placeholder="검색어를 입력하세요."
              />
              <Button btnType="search" btnNames="검색" />
              <Button btnType="del" btnNames="삭제" />
              <Button btnType="add" btnNames="추가" />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable columns={EMPTY_MEMBER_COLUMNS} data={[]} />
          </div>
        </div>
      </div>

      {isRoleFormOpen && roleFormMode && (
        <RoleForm
          mode={roleFormMode}
          roleId={selectedRoleId}
          onClose={handleCloseRoleForm}
          onSaved={handleSavedRole}
        />
      )}
    </div>
  );
}
