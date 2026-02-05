// Leftbar.jsx
import { useUserMenu } from '@context/UserMenuContext';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Leftbar() {
  const location = useLocation();
  const { getSideNavigationData, getDepth1Parent, currentMenu } = useUserMenu();

  // 토글 상태 관리 (menuId를 key로)
  const [openMenus, setOpenMenus] = useState({});

  // 현재 depth1 부모 메뉴
  const depth1Parent = getDepth1Parent();

  // 현재 depth1의 모든 depth2, depth3 메뉴
  const sideMenus = getSideNavigationData();

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

  // depth1이 없으면 렌더링 안 함
  if (!depth1Parent) {
    return null;
  }

  return (
    <aside className="onleftbar">
      {/* depth1 제목 */}
      <div className="onlinksystem">{depth1Parent.menuNm}</div>

      <nav>
        <ul className="onleftbar-navlink navdepth1">
          {sideMenus.map((depth2Menu) => {
            const isOpen = openMenus[depth2Menu.menuId];
            const hasChildren =
              depth2Menu.children && depth2Menu.children.length > 0;

            return (
              <li
                key={depth2Menu.menuId}
                className={`navdepth1-list ${isOpen ? 'on' : ''}`}
              >
                {/* depth2가 M타입(그룹)이면 button, T타입(페이지)이면 NavLink */}
                {depth2Menu.scrnTypeCd === 'M' ? (
                  <button onClick={() => toggleMenu(depth2Menu.menuId)}>
                    <span>{depth2Menu.menuNm}</span>
                  </button>
                ) : (
                  <NavLink
                    to={depth2Menu.link}
                    className={({ isActive }) => (isActive ? 'on' : '')}
                  >
                    <span>{depth2Menu.menuNm}</span>
                  </NavLink>
                )}

                {/* depth3 자식들 */}
                {hasChildren && (
                  <ul className="navdepth2">
                    {depth2Menu.children.map((depth3Menu) => (
                      <li key={depth3Menu.menuId} className="navdepth2-list">
                        <NavLink
                          to={depth3Menu.link}
                          className={({ isActive }) => (isActive ? 'on' : '')}
                        >
                          {depth3Menu.menuNm}
                        </NavLink>
                      </li>
                    ))}
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
