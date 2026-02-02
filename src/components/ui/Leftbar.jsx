import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Leftbar() {

  // TODO : 향후 동적메뉴로 변경 필요

  // 메뉴 데이터 구성
  const menuItems = [
    { name: '공통코드 관리', path: '/common-code' },
    { name: '권한 관리', path: '/auth-mgmt' },
    { name: '관리자 메뉴관리', path: '/menu-mgmt' },
    { name: '게시판 관리', path: '/bbs-list' },
    { name: '사업정보 관리', path: '/biz-info' },
    { name: '사업정보 등록/수정', path: '/biz-reg' },
    { name: 'SVAR 그리드 예제', path: '/grid-example' },
  ];

  //회원관리용 임시 메뉴데이터 향후 담당자가 동적메뉴 구현 예정
  const membersMenuItems = [
    { name: '회원 목록', path: '/member-list' },
  ];

  return (
    <aside className="onleftbar">
      <div className="onlinksystem">시스템 관리</div>
      <nav>
        <ul className="onleftbar-navlink navdepth1">
          <li className="navdepth1-list on">
            <button>
              <span>회원/권한 관리</span>
            </button>
            <ul className="navdepth2">
              {membersMenuItems.map((item, index) => (
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
