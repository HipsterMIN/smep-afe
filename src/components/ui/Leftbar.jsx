// Leftbar.jsx
import { useUserMenu } from '@context/UserMenuContext';
import { useMenuStore } from '@store/useMenuStore'; // ✅ 추가
import { buildFullPath, extractExternalUrl } from '@utils/menuUtils'; // ✅ 추가
import { useEffect, useState } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

export default function Leftbar() {
  const location = useLocation();
  const { getSideNavigationData, getDepth1Parent, currentMenu } = useUserMenu();
  const { menuTree, flatMenuMap } = useMenuStore(); // ✅ 추가

  // 토글 상태 관리 (menuId를 key로)
  const [openMenus, setOpenMenus] = useState({});

  // ✅ 수정: depth1Parent fallback
  let depth1Parent = getDepth1Parent();
  if (!depth1Parent && menuTree?.children?.[0]) {
    depth1Parent = menuTree.children[0];
  }

  // ✅ 수정: sideMenus fallback (link 생성 포함)
  let sideMenus = getSideNavigationData();
  if ((!sideMenus || sideMenus.length === 0) && depth1Parent?.children) {
    sideMenus = depth1Parent.children.map((depth2) => ({
      ...depth2,
      link: buildFullPath(depth2, flatMenuMap),
      children: depth2.children?.map((depth3) => ({
        ...depth3,
        link: buildFullPath(depth3, flatMenuMap),
      })),
    }));
  }

  // 현재 활성 메뉴에 해당하는 depth2를 자동으로 열기
  useEffect(() => {
    if (currentMenu && currentMenu.depth >= 2) {
      // depth2 또는 depth3일 때, 해당하는 depth2 메뉴를 찾아서 열기
      let depth2MenuId = null;

      if (currentMenu.depth === 2) {
        depth2MenuId = currentMenu.menuId;
      } else if (currentMenu.depth === 3) {
        depth2MenuId = currentMenu.upMenuId;
      }

      if (depth2MenuId) {
        setOpenMenus((prev) => ({ ...prev, [depth2MenuId]: true }));
      }
    }
  }, [currentMenu]);

  // 토글 핸들러
  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const normalizePath = (path = '') => {
    if (!path) return '';
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  };

  const isPathActive = (path, end = false) => {
    const targetPath = normalizePath(path);
    const currentPath = normalizePath(location.pathname);
    if (!targetPath) return false;
    return Boolean(matchPath({ path: targetPath, end }, currentPath));
  };

  // ✅ 수정: 조건 추가
  if (!depth1Parent || !sideMenus || sideMenus.length === 0) {
    return null;
  }

  return (
    <aside className="onleftbar">
      {/* depth1 제목 */}
      <div className="onlinksystem">{depth1Parent.menuNm}</div>

      <nav>
        <ul className="onleftbar-navlink navdepth1">
          {sideMenus.map((depth2Menu) => {
            const depth2ExternalUrl = extractExternalUrl(depth2Menu.link);
            const isOpen = openMenus[depth2Menu.menuId];
            const hasChildren =
              depth2Menu.children && depth2Menu.children.length > 0;
            const hasActiveDepth3 =
              hasChildren &&
              depth2Menu.children.some((depth3Menu) =>
                !extractExternalUrl(depth3Menu.link) &&
                isPathActive(depth3Menu.link, true)
              );
            const isActiveDepth2 =
              depth2Menu.scrnTypeCd !== 'M' &&
              !depth2ExternalUrl &&
              isPathActive(depth2Menu.link, !hasChildren);
            const isOn = isOpen || hasActiveDepth3 || isActiveDepth2;

            return (
              <li
                key={depth2Menu.menuId}
                className={`navdepth1-list ${isOn ? 'on' : ''}`}
              >
                {/* depth2가 M타입(그룹)이면 button, T타입(페이지)이면 NavLink */}
                {depth2Menu.scrnTypeCd === 'M' ? (
                  <button onClick={() => toggleMenu(depth2Menu.menuId)}>
                    <span>{depth2Menu.menuNm}</span>
                  </button>
                ) : depth2ExternalUrl ? (
                  <a
                    href={depth2ExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{depth2Menu.menuNm}</span>
                  </a>
                ) : (
                  <NavLink
                    to={depth2Menu.link || '#'}
                    className={({ isActive }) => (isActive ? 'on' : '')}
                  >
                    <span>{depth2Menu.menuNm}</span>
                  </NavLink>
                )}

                {/* depth3 자식들 */}
                {hasChildren && (
                  <ul className="navdepth2">
                    {depth2Menu.children.map((depth3Menu) => {
                      const depth3ExternalUrl = extractExternalUrl(depth3Menu.link);
                      const isActiveDepth3 =
                        !depth3ExternalUrl &&
                        isPathActive(depth3Menu.link, true);
                      return (
                        <li
                          key={depth3Menu.menuId}
                          className={`navdepth2-list ${isActiveDepth3 ? 'on' : ''}`}
                        >
                          {depth3ExternalUrl ? (
                            <a
                              href={depth3ExternalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {depth3Menu.menuNm}
                            </a>
                          ) : (
                            <NavLink
                              to={depth3Menu.link || '#'}
                              className={({ isActive }) =>
                                isActive ? 'on' : ''
                              }
                            >
                              {depth3Menu.menuNm}
                            </NavLink>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
