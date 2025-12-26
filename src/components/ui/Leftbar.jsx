import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Leftbar() {
  // 메뉴 데이터 구성
  const menuItems = [
    { name: '공통코드 관리', path: '/admin/common-code' },
    { name: '권한 관리', path: '/admin/auth-mgmt' },
    { name: '관리자 메뉴관리', path: '/admin/menu-mgmt' },
    { name: '게시판 관리', path: '/admin/board-mgmt' },
    { name: '사업정보 관리', path: '/admin/biz-info' },
    { name: '사업정보 등록/수정', path: '/admin/biz-reg' },
    { name: 'SVAR 그리드 예제', path: '/admin/grid-example' },
  ];

  return (
    <aside className="onleftbar">
      <div className="onlinksystem">시스템 관리</div>
      <nav>
        <ul className="navdepth1">
          {menuItems.map((item, index) => (
            <li key={index} className="navdepth1-list">
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'on' : '')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '60px',
                  color: '#fff',
                  paddingLeft: '7px',
                }}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
