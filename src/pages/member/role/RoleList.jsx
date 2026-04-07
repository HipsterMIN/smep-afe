import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import SearchBox from '@components/ui/SearchBox.jsx';
import http from '@lib/http.js';
import RoleForm from '@pages/member/role/components/RoleForm.jsx';
import RoleManagerSelector from '@pages/member/role/components/RoleManagerSelector.jsx';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_SEARCH_KEYWORD = '';
const DEFAULT_MEMBER_SEARCH_KEYWORD = '';
const DEFAULT_MEMBER_ORG_NAME = '-';
const DEFAULT_MEMBER_FETCH_SIZE = 100;

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
  const [selectedRole, setSelectedRole] = useState(null);
  const [memberKeyword, setMemberKeyword] = useState(
    DEFAULT_MEMBER_SEARCH_KEYWORD
  );
  const [memberList, setMemberList] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [selectedMemberNos, setSelectedMemberNos] = useState([]);
  const [isRoleManagerSelectorOpen, setIsRoleManagerSelectorOpen] =
    useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [roleFormMode, setRoleFormMode] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const roleRowsRef = useRef(roleList);

  async function fetchRoleList(nextKeyword = '') {
    setLoading(true);

    try {
      const normalizedKeyword = nextKeyword.trim();
      // 권한 관리 목록은 전체 장부를 봐야 하므로, useYn 기본값에 기대지 않고 화면이 필요한 범위만 명시해 단일 조회한다.
      const response = await http.get('/api/v1/roles', {
        params: {
          intgSysSeCd: 'PIIO',
          mbrTypeCd: 'MNG',
          ...(normalizedKeyword ? { roleNm: normalizedKeyword } : {}),
        },
      });
      const payload = resolvePayload(response);
      const items = Array.isArray(payload) ? payload : [];

      const normalizedRows = items.map((item, index) =>
        normalizeRoleRow(item, index)
      );
      const mergedRows = normalizedRows
        .sort(sortRoleRows)
        .map((row, index) => ({
          ...row,
          // 번호는 최종 정렬이 끝난 화면 순서 기준으로 다시 매긴다.
          no: index + 1,
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

  useEffect(() => {
    roleRowsRef.current = roleList;
  }, [roleList]);

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

  async function fetchAssignedMembers(
    roleId,
    nextKeyword = DEFAULT_MEMBER_SEARCH_KEYWORD
  ) {
    if (!roleId) {
      setMemberList([]);
      setSelectedMemberNos([]);
      return;
    }

    setMemberLoading(true);

    try {
      const normalizedKeyword = nextKeyword.trim();
      const response = await http.post(
        `/api/v1/roles/${roleId}/members/search`,
        {
          keyword: normalizedKeyword || null,
          size: DEFAULT_MEMBER_FETCH_SIZE,
        }
      );
      const payload = resolvePayload(response);
      const items = Array.isArray(payload) ? payload : [];

      setMemberList(
        items.map((item, index) => ({
          id: item?.mbrNo ?? `member-${index}`,
          mbrNo: item?.mbrNo ?? null,
          lgnId: item?.lgnId ?? '-',
          mbrNm: item?.mbrNm ?? '-',
          orgNm: item?.orgNm ?? DEFAULT_MEMBER_ORG_NAME,
        }))
      );
      setSelectedMemberNos([]);
    } catch (error) {
      console.error('[RoleList] 권한 소속인원 조회 실패', error);
      setMemberList([]);
      setSelectedMemberNos([]);
    } finally {
      setMemberLoading(false);
    }
  }

  function handleRoleRowClick(row) {
    if (!row?.roleId) {
      return;
    }

    setSelectedRole(row);
    setMemberKeyword(DEFAULT_MEMBER_SEARCH_KEYWORD);
    void fetchAssignedMembers(row.roleId, DEFAULT_MEMBER_SEARCH_KEYWORD);
  }

  function handleRoleGridInit(api) {
    api.on('select-row', (event) => {
      const rowData = roleRowsRef.current.find((item) => item.id === event.id);

      if (rowData) {
        handleRoleRowClick(rowData);
      }
    });
  }

  function handleMoveToMenu(event, row) {
    event.stopPropagation();

    if (!row?.roleId) {
      return;
    }

    navigate(`${row.roleId}`);
  }

  function handleOpenRoleForm(event, row) {
    event.stopPropagation();

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

  function isMemberSelected(mbrNo) {
    return selectedMemberNos.includes(mbrNo);
  }

  function handleToggleMember(mbrNo, checked) {
    if (!mbrNo) {
      return;
    }

    setSelectedMemberNos((prev) => {
      if (checked) {
        return prev.includes(mbrNo) ? prev : [...prev, mbrNo];
      }

      return prev.filter((value) => value !== mbrNo);
    });
  }

  function handleMemberSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    void handleMemberSearch();
  }

  async function handleMemberSearch() {
    if (!selectedRole?.roleId) {
      return;
    }

    await fetchAssignedMembers(selectedRole.roleId, memberKeyword);
  }

  async function handleDeleteMembers() {
    if (!selectedRole?.roleId || selectedMemberNos.length === 0) {
      return;
    }

    if (!window.confirm('선택한 소속인원을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await http.post(`/api/v1/roles/${selectedRole.roleId}/members/unassign`, {
        mbrNos: selectedMemberNos,
      });
      alert('삭제되었습니다.');
      await fetchAssignedMembers(selectedRole.roleId, memberKeyword);
    } catch (error) {
      console.error('[RoleList] 권한 소속인원 삭제 실패', error);
      alert(error?.response?.data?.message || '소속인원 삭제에 실패했습니다.');
    }
  }

  function handleOpenRoleManagerSelector() {
    if (!selectedRole?.roleId) {
      return;
    }

    setIsRoleManagerSelectorOpen(true);
  }

  function handleCloseRoleManagerSelector() {
    setIsRoleManagerSelectorOpen(false);
  }

  async function handleAddedRoleMembers() {
    if (!selectedRole?.roleId) {
      return;
    }

    await fetchAssignedMembers(selectedRole.roleId, memberKeyword);
    handleCloseRoleManagerSelector();
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
            onClick={(event) => handleMoveToMenu(event, row)}
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
          onClick={(event) => handleOpenRoleForm(event, row)}
        />
      ),
    },
  ];

  const memberColumns = [
    {
      id: 'checkbox',
      header: '선택',
      width: 60,
      cell: ({ row }) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckBox
            chkId={`role-member-${row?.mbrNo ?? row?.id}`}
            value={row?.mbrNo}
            checked={isMemberSelected(row?.mbrNo)}
            onChange={({ checked }) => handleToggleMember(row?.mbrNo, checked)}
          />
        </div>
      ),
    },
    { id: 'lgnId', header: 'ID', width: 200 },
    { id: 'mbrNm', header: '이름', width: 200 },
    {
      id: 'orgNm',
      header: '기관명',
      width: 322,
      cell: ({ row }) => row?.orgNm || DEFAULT_MEMBER_ORG_NAME,
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
        <div className="oncontent" style={{ alignSelf: 'flex-start' }}>
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
              <Button
                btnType="add"
                btnNames="추가"
                onClick={handleOpenRoleCreate}
              />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable
              columns={roleColumns}
              data={roleList}
              gridProps={{ init: handleRoleGridInit }}
            />
          </div>
        </div>

        <div className="oncontent">
          <div className="ongrid-form">
            <h4>소속인원</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormChild"
                placeholder="검색어를 입력하세요."
                value={memberKeyword}
                onChange={(event) => setMemberKeyword(event.target.value)}
                onKeyDown={handleMemberSearchKeyDown}
                disabled={!selectedRole?.roleId}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleMemberSearch}
                disabled={!selectedRole?.roleId || memberLoading}
              />
              <Button
                btnType="del"
                btnNames="삭제"
                onClick={handleDeleteMembers}
                disabled={
                  !selectedRole?.roleId ||
                  selectedMemberNos.length === 0 ||
                  memberLoading
                }
              />
              <Button
                btnType="add"
                btnNames="추가"
                onClick={handleOpenRoleManagerSelector}
                disabled={!selectedRole?.roleId}
              />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable columns={memberColumns} data={memberList} />
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

      {isRoleManagerSelectorOpen && selectedRole?.roleId && (
        <RoleManagerSelector
          roleId={selectedRole.roleId}
          onClose={handleCloseRoleManagerSelector}
          onAdded={handleAddedRoleMembers}
        />
      )}
    </div>
  );
}
