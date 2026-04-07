import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import SearchBox from '@components/ui/SearchBox.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_ROLE_KEYWORD = '';
const DEFAULT_MENU_KEYWORD = '';

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
  const sortSeq = Number(item?.sortSeq ?? Number.MAX_SAFE_INTEGER);

  return {
    id: roleId,
    roleId,
    roleNm: item?.roleNm ?? '-',
    useYn: item?.useYn ?? '',
    useYnNm: normalizeUseYnLabel(item?.useYn),
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

function matchesMenuKeyword(row, keyword) {
  if (!keyword) {
    return true;
  }

  const normalizedKeyword = keyword.toLowerCase();

  return [
    row?.menuId,
    row?.depth1MenuNm,
    row?.depth2MenuNm,
    row?.depth3MenuNm,
    row?.depth4MenuNm,
  ].some((value) => value?.toLowerCase().includes(normalizedKeyword));
}

function buildMenuRelationMaps(menuRows) {
  const parentMap = new Map();
  const childrenMap = new Map();

  menuRows.forEach((row) => {
    if (!row?.menuId) {
      return;
    }

    parentMap.set(row.menuId, row.upMenuId ?? null);

    if (!row?.upMenuId) {
      return;
    }

    const children = childrenMap.get(row.upMenuId) ?? [];
    children.push(row.menuId);
    childrenMap.set(row.upMenuId, children);
  });

  return {
    parentMap,
    childrenMap,
  };
}

function collectAncestorIds(menuId, parentMap) {
  const ancestorIds = [];
  let currentMenuId = menuId;

  while (currentMenuId) {
    ancestorIds.push(currentMenuId);
    currentMenuId = parentMap.get(currentMenuId) ?? null;
  }

  return ancestorIds;
}

function collectDescendantIds(menuId, childrenMap) {
  const descendantIds = [];
  const queue = [menuId];

  while (queue.length > 0) {
    const currentMenuId = queue.shift();

    if (!currentMenuId) {
      continue;
    }

    descendantIds.push(currentMenuId);

    const children = childrenMap.get(currentMenuId) ?? [];
    children.forEach((childMenuId) => queue.push(childMenuId));
  }

  return descendantIds;
}

function areSameMenuSelections(leftMenuIds, rightMenuIds) {
  if (leftMenuIds.length !== rightMenuIds.length) {
    return false;
  }

  const rightSet = new Set(rightMenuIds);
  return leftMenuIds.every((menuId) => rightSet.has(menuId));
}

export default function RoleMenuAssigner() {
  const navigate = useNavigate();
  const { roleNo } = useParams();
  const [roleKeyword, setRoleKeyword] = useState(DEFAULT_ROLE_KEYWORD);
  const [roleList, setRoleList] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [menuKeyword, setMenuKeyword] = useState(DEFAULT_MENU_KEYWORD);
  const [appliedMenuKeyword, setAppliedMenuKeyword] =
    useState(DEFAULT_MENU_KEYWORD);
  const [allMenuRows, setAllMenuRows] = useState([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);
  const [initialCheckedMenuIds, setInitialCheckedMenuIds] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function fetchRoleList(nextKeyword = DEFAULT_ROLE_KEYWORD) {
    setRoleLoading(true);

    try {
      const normalizedKeyword = nextKeyword.trim();
      const response = await http.get('/api/v1/roles', {
        params: {
          intgSysSeCd: 'PIIO',
          mbrTypeCd: 'MNG',
          ...(normalizedKeyword ? { roleNm: normalizedKeyword } : {}),
        },
      });
      const payload = resolvePayload(response);
      const items = Array.isArray(payload) ? payload : [];

      setRoleList(
        items
          .map((item, index) => normalizeRoleRow(item, index))
          .sort(sortRoleRows)
      );
    } catch (error) {
      console.error('[RoleMenuAssigner] 권한그룹 목록 조회 실패', error);
      setRoleList([]);
    } finally {
      setRoleLoading(false);
    }
  }

  useEffect(() => {
    void fetchRoleList(DEFAULT_ROLE_KEYWORD);
  }, []);

  useEffect(() => {
    if (!roleNo) {
      setSelectedRole(null);
      return;
    }

    const matchedRole = roleList.find((row) => row.roleId === roleNo);
    setSelectedRole(matchedRole ?? null);
  }, [roleNo, roleList]);

  async function fetchRoleMenus(roleId) {
    if (!roleId) {
      setAllMenuRows([]);
      setCheckedMenuIds([]);
      setInitialCheckedMenuIds([]);
      return;
    }

    setMenuLoading(true);

    try {
      const response = await http.get(`/api/v1/roles/${roleId}/menus`);
      const payload = resolvePayload(response);
      const items = Array.isArray(payload) ? payload : [];

      const menuRows = items.map((item, index) => ({
        id: item?.menuId ?? `menu-${index}`,
        menuId: item?.menuId ?? null,
        upMenuId: item?.upMenuId ?? null,
        depth: item?.depth ?? null,
        depth1MenuNm: item?.depth1MenuNm ?? '-',
        depth2MenuNm: item?.depth2MenuNm ?? '-',
        depth3MenuNm: item?.depth3MenuNm ?? '-',
        depth4MenuNm: item?.depth4MenuNm ?? '-',
        checked: Boolean(item?.checked),
      }));
      const initialMenuIds = menuRows
        .filter((row) => row.checked)
        .map((row) => row.menuId);

      setAllMenuRows(menuRows);
      setCheckedMenuIds(initialMenuIds);
      setInitialCheckedMenuIds(initialMenuIds);
      setMenuKeyword(DEFAULT_MENU_KEYWORD);
      setAppliedMenuKeyword(DEFAULT_MENU_KEYWORD);
    } catch (error) {
      console.error('[RoleMenuAssigner] 메뉴 권한 조회 실패', error);
      setAllMenuRows([]);
      setCheckedMenuIds([]);
      setInitialCheckedMenuIds([]);
    } finally {
      setMenuLoading(false);
    }
  }

  useEffect(() => {
    void fetchRoleMenus(selectedRole?.roleId);
  }, [selectedRole?.roleId]);

  function handleRoleSearch() {
    void fetchRoleList(roleKeyword);
  }

  function handleRoleSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleRoleSearch();
  }

  function handleRoleGridInit(api) {
    api.on('select-row', (event) => {
      const rowData = roleList.find((item) => item.id === event.id);

      if (!rowData?.roleId) {
        return;
      }

      setSelectedRole(rowData);
      setMenuKeyword(DEFAULT_MENU_KEYWORD);
      setAppliedMenuKeyword(DEFAULT_MENU_KEYWORD);
      navigate(`../${rowData.roleId}`, { relative: 'path' });
    });
  }

  function handleMenuSearch() {
    setAppliedMenuKeyword(menuKeyword.trim());
  }

  function handleMenuSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleMenuSearch();
  }

  function handleToggleMenu(menuId, checked) {
    if (!menuId) {
      return;
    }

    const { parentMap, childrenMap } = buildMenuRelationMaps(allMenuRows);

    setCheckedMenuIds((prev) => {
      const nextMenuIds = new Set(prev);

      if (checked) {
        collectAncestorIds(menuId, parentMap).forEach((targetMenuId) =>
          nextMenuIds.add(targetMenuId)
        );
      } else {
        collectDescendantIds(menuId, childrenMap).forEach((targetMenuId) =>
          nextMenuIds.delete(targetMenuId)
        );
      }

      return allMenuRows
        .map((row) => row.menuId)
        .filter((currentMenuId) => nextMenuIds.has(currentMenuId));
    });
  }

  async function handleSave() {
    if (!selectedRole?.roleId) {
      return;
    }

    setSaving(true);

    try {
      await http.put(`/api/v1/roles/${selectedRole.roleId}/menus`, {
        menuIds: checkedMenuIds,
      });

      alert('저장되었습니다.');
      await fetchRoleMenus(selectedRole.roleId);
    } catch (error) {
      console.error('[RoleMenuAssigner] 메뉴 권한 저장 실패', error);
      alert(error?.response?.data?.message || '메뉴 권한 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  const roleColumns = [
    { id: 'roleId', header: 'ID', width: 150 },
    { id: 'roleNm', header: '권한명', width: 170, dataAlign: 'left' },
    { id: 'useYnNm', header: '사용여부', width: 90 },
    {
      id: 'mdfcnDt',
      header: '최종수정일',
      width: 180,
      cell: ({ row }) => formatTimestamp(row?.mdfcnDt),
    },
  ];

  const menuColumns = [
    { id: 'depth1MenuNm', header: '1depth', width: 180, dataAlign: 'left' },
    { id: 'depth2MenuNm', header: '2depth', width: 180, dataAlign: 'left' },
    { id: 'depth3MenuNm', header: '3depth', width: 330, dataAlign: 'left' },
    { id: 'depth4MenuNm', header: '4depth', width: 180, dataAlign: 'left' },
    {
      id: 'checked',
      header: '사용여부',
      width: 90,
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
            chkId={`role-menu-${row?.menuId ?? row?.id}`}
            value={row?.menuId}
            checked={checkedMenuIds.includes(row?.menuId)}
            onChange={({ checked }) => handleToggleMenu(row?.menuId, checked)}
          />
        </div>
      ),
    },
  ];

  // 우측 메뉴는 총량이 작고 체크 상태 보존이 중요하므로, 한번 읽은 뒤 화면에서만 필터링한다.
  const filteredMenuRows = allMenuRows.filter((row) =>
    matchesMenuKeyword(row, appliedMenuKeyword)
  );
  const isDirty = !areSameMenuSelections(checkedMenuIds, initialCheckedMenuIds);

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>관리자 메뉴 권한 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>권한 관리</li>
          <li className="on">관리자 메뉴 권한 관리</li>
        </ul>
      </div>

      <div className="oncontents space" style={{ alignItems: 'flex-start' }}>
        <div
          className="oncontent"
          style={{ flex: '0 0 602px', alignSelf: 'flex-start' }}
        >
          <div className="ongrid-form">
            <h4>권한그룹</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormGroup"
                placeholder="검색어를 입력하세요."
                value={roleKeyword}
                onChange={(event) => setRoleKeyword(event.target.value)}
                onKeyDown={handleRoleSearchKeyDown}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleRoleSearch}
                disabled={roleLoading}
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

        <div
          className="oncontent"
          style={{ minWidth: 0, alignSelf: 'flex-start' }}
        >
          <div className="ongrid-form">
            <h4>메뉴 권한</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormChild"
                placeholder="검색어를 입력하세요."
                value={menuKeyword}
                onChange={(event) => setMenuKeyword(event.target.value)}
                onKeyDown={handleMenuSearchKeyDown}
                disabled={!selectedRole?.roleId}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleMenuSearch}
                disabled={!selectedRole?.roleId || menuLoading}
              />
              <Button
                btnType="add"
                btnNames="저장"
                onClick={handleSave}
                disabled={
                  !selectedRole?.roleId || menuLoading || saving || !isDirty
                }
              />
            </div>
          </div>
          <div className="ongrid-tableform" style={{ overflowX: 'auto' }}>
            <GridTable columns={menuColumns} data={filteredMenuRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
