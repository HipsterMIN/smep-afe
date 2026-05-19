import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import SearchBox from '@components/ui/SearchBox.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_ROLE_KEYWORD = '';
const DEFAULT_MENU_KEYWORD = '';
const GRID_SCROLL_HEIGHT = '620px';
const ROLE_SELECTABLE_COLUMN_IDS = new Set([
  'roleId',
  'roleNm',
  'useYnNm',
  'mdfcnDtText',
]);

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
    mdfcnDtText: formatTimestamp(item?.mdfcnDt ?? item?.regDt ?? null),
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
  const location = useLocation();
  const initialRoleId = location.state?.initialRoleId ?? null;
  const initialRoleNm = location.state?.initialRoleNm ?? DEFAULT_ROLE_KEYWORD;
  const [roleKeyword, setRoleKeyword] = useState(initialRoleNm);
  const [roleList, setRoleList] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [pendingInitialRoleId, setPendingInitialRoleId] =
    useState(initialRoleId);
  const [menuKeyword, setMenuKeyword] = useState(DEFAULT_MENU_KEYWORD);
  const [appliedMenuKeyword, setAppliedMenuKeyword] =
    useState(DEFAULT_MENU_KEYWORD);
  const [allMenuRows, setAllMenuRows] = useState([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);
  const [initialCheckedMenuIds, setInitialCheckedMenuIds] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const roleGridWrapperRef = useRef(null);

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
    // 메뉴 버튼에서 넘어온 초기 권한명은 검색어에도 그대로 반영해, 화면 진입 맥락을 사용자가 바로 확인할 수 있게 한다.
    setRoleKeyword(initialRoleNm);
    void fetchRoleList(initialRoleNm);
  }, [initialRoleNm]);

  useEffect(() => {
    if (!pendingInitialRoleId) {
      return;
    }

    const matchedRole = roleList.find(
      (row) => row.roleId === pendingInitialRoleId
    );

    if (!matchedRole) {
      if (!roleLoading) {
        setPendingInitialRoleId(null);
      }
      return;
    }

    setSelectedRole(matchedRole);
    setPendingInitialRoleId(null);
  }, [pendingInitialRoleId, roleList, roleLoading]);

  const fetchRoleMenus = useCallback(async (roleId) => {
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
  }, []);

  useEffect(() => {
    void fetchRoleMenus(selectedRole?.roleId);
  }, [fetchRoleMenus, selectedRole?.roleId]);

  const handleSelectRole = useCallback(
    (rowData) => {
      if (!rowData?.roleId) {
        return;
      }

      const isSameRole = selectedRole?.roleId === rowData.roleId;

      setMenuKeyword(DEFAULT_MENU_KEYWORD);
      setAppliedMenuKeyword(DEFAULT_MENU_KEYWORD);

      // Grid selection 이벤트가 화면별로 일관되지 않아, 같은 권한을 다시 눌렀을 때도 메뉴 권한을 즉시 다시 읽는다.
      if (isSameRole) {
        setSelectedRole(rowData);
        void fetchRoleMenus(rowData.roleId);
        return;
      }

      setSelectedRole(rowData);
    },
    [fetchRoleMenus, selectedRole?.roleId]
  );

  const handleRoleGridClick = useCallback(
    (event) => {
      const gridCell = event.target.closest('div[data-row-id][data-col-id]');

      if (!gridCell) {
        return;
      }

      const columnId = gridCell.getAttribute('data-col-id');

      if (!ROLE_SELECTABLE_COLUMN_IDS.has(columnId)) {
        return;
      }

      const roleId = gridCell.getAttribute('data-row-id');
      const rowData = roleList.find((row) => row.roleId === roleId);

      if (!rowData) {
        return;
      }

      handleSelectRole(rowData);
    },
    [handleSelectRole, roleList]
  );

  useEffect(() => {
    const wrapper = roleGridWrapperRef.current;

    if (!wrapper) {
      return undefined;
    }

    // 권한그룹은 셀 내용뿐 아니라 gridcell padding을 눌러도 반응해야 하므로, wrapper에서 실제 clicked cell을 해석한다.
    function handleWrapperClick(event) {
      handleRoleGridClick(event);
    }

    wrapper.addEventListener('click', handleWrapperClick);

    return () => {
      wrapper.removeEventListener('click', handleWrapperClick);
    };
  }, [handleRoleGridClick]);

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

  function buildRoleDisplayCell(renderValue, textAlign = 'center') {
    function RoleDisplayCell({ row }) {
      const justifyContent =
        textAlign === 'left' ? 'flex-start' : 'center';

      return (
        <div
          role="button"
          tabIndex={0}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent,
            textAlign,
            cursor: 'pointer',
            color: 'inherit',
            background: 'transparent',
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }

            event.preventDefault();
            handleSelectRole(row);
          }}
        >
          {renderValue(row)}
        </div>
      );
    }

    RoleDisplayCell.propTypes = {
      row: PropTypes.object,
    };

    return RoleDisplayCell;
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
      await http.post(`/api/v1/roles/update/${selectedRole.roleId}/menus`, {
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
    {
      id: 'roleId',
      header: 'ID',
      width: 150,
      cell: buildRoleDisplayCell((row) => row?.roleId ?? '-'),
    },
    {
      id: 'roleNm',
      header: '권한명',
      width: 170,
      dataAlign: 'left',
      cell: buildRoleDisplayCell((row) => row?.roleNm ?? '-', 'left'),
    },
    {
      id: 'useYnNm',
      header: '사용여부',
      width: 90,
      cell: buildRoleDisplayCell((row) => row?.useYnNm ?? '-'),
    },
    {
      id: 'mdfcnDtText',
      header: '최종수정일',
      width: 180,
      cell: buildRoleDisplayCell((row) => row?.mdfcnDtText ?? '-'),
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
          <div
            ref={roleGridWrapperRef}
            className="ongrid-tableform onSCrollBox"
            // 이 화면은 페이지 전체보다 각 grid wrapper가 스크롤을 가져가는 쪽이 기존 화면 컨벤션과 더 잘 맞는다.
            style={{ height: GRID_SCROLL_HEIGHT }}
          >
            <GridTable columns={roleColumns} data={roleList} />
          </div>
        </div>

        <div
          className="oncontent"
          style={{ minWidth: 0, alignSelf: 'flex-start' }}
        >
          <div className="ongrid-form">
            <h4>
              메뉴 권한
              {selectedRole?.roleNm ? ` (${selectedRole.roleNm})` : ''}
            </h4>
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
                disabled={!selectedRole?.roleId}
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
          <div
            className="ongrid-tableform onSCrollBox"
            style={{ height: GRID_SCROLL_HEIGHT, overflowX: 'auto' }}
          >
            <GridTable columns={menuColumns} data={filteredMenuRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
