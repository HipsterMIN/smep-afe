import { useMenuStore } from '@store/useMenuStore';
import { buildFullPath } from '@utils/menuUtils';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext'; // AuthContext import

import icoVatar from '../../assets/images/common/ico_avatar.svg';
import icoLogout from '../../assets/images/common/ico_logout.svg';
import icoLogo from '../../assets/images/common/logo.svg';

// BASE URL 상수
const BASE_URL = import.meta.env.VITE_BASE || '/';

// 관리자 - 상단 메뉴
export default function Header() {
  const { menuTree, flatMenuMap } = useMenuStore();
  const { remainingTime, extendSession, logout } = useAuth(); // AuthContext에서 필요한 값 가져오기

  // depth1 메뉴만 동적으로 구성
  const depth1Menus = useMemo(() => {
    if (!menuTree || !menuTree.children) return [];

    const basePath = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

    return menuTree.children
      .filter(
        (menu) =>
          menu.depth === 1 &&
          menu.useYn === 'Y' &&
          menu.upendMenuExpsrYn === 'Y'
      )
      .sort((a, b) => a.sortSeq - b.sortSeq)
      .map((menu) => ({
        menuId: menu.menuId,
        menuNm: menu.menuNm,
        fullPath: basePath + buildFullPath(menu, flatMenuMap),
      }));
  }, [menuTree, flatMenuMap]);

  // 남은 시간을 MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <header className="onheader">
      <div className="onheader-lft">
        <button className="onnavtoggle">
          <span className="sr-only">네비게이션바 토글 버튼</span>
        </button>
        <h1 className="onlogo">
          <Link to="/">
            <img src={icoLogo} alt="중소기업통합플랫폼" />
          </Link>
        </h1>
      </div>
      <div className="onheader-ctr">
        {depth1Menus.map((menu) => (
          <Link key={menu.menuId} to={menu.fullPath} className="onnavlink">
            {menu.menuNm}
          </Link>
        ))}
      </div>
      <div className="onheader-rht">
        <div className="onavatar">
          <span className="onavatar-thumb">
            <img src={icoVatar} alt="아바타이미지" />
          </span>
          <span className="onavatar-name">홍길동</span>
        </div>
        <div className="onsessiontime-box">
          {/* 남은 시간 표시 */}
          <span className="time">{formatTime(remainingTime)}</span>
          {/* 시간 연장 버튼 */}
          <button className="onbtn-blue" onClick={extendSession}>시간연장</button>
          <button className="onbtn-gray" />
        </div>
        <div className="onlog-box">
          {/* 로그아웃 버튼 */}
          <button onClick={logout}>
            <img src={icoLogout} alt="" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}
