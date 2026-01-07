import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Leftbar() {
  // 메뉴 데이터 구성
  const menuItems = [
    { name: '공통코드 관리', path: '/common-code' },
    { name: '권한 관리', path: '/auth-mgmt' },
    { name: '관리자 메뉴관리', path: '/menu-mgmt' },
    { name: '게시판 관리', path: '/board-mgmt' },
    { name: '사업정보 관리', path: '/biz-info' },
    { name: '사업정보 등록/수정', path: '/biz-reg' },
    { name: 'SVAR 그리드 예제', path: '/grid-example' },
  ];

  return (
    <aside className="onleftbar">
      <div className="onlinksystem">시스템 관리</div>
      <nav>
        <ul className="onleftbar-navlink navdepth1">
          <li className="navdepth1-list">
            <button>
              <span>회원/권한 관리</span>
            </button>
          </li>
          <li className="navdepth1-list on">
            <button>
              <span>시스템 설정</span>
            </button>
            <ul className="navdepth2">
              {menuItems.map((item, index) => (
                  <li key={index} className="navdepth2-list">
                    <NavLink
                        to={item.path}
                        className={({isActive}) => (isActive ? 'on' : '')}
                    >
                    {item.name}
                    </NavLink>
                  </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
