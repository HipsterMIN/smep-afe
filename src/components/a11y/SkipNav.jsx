import './SkipNav.css';

import React from 'react';

/**
 * Skip Navigation Component
 * 웹 접근성 지침 준수: 키보드 사용자가 메뉴를 건너뛰고 본문으로 바로 이동할 수 있도록 함.
 */
const SkipNav = () => {
  return (
    <div className="skip-nav">
      <a href="#main-content">본문 바로가기</a>
    </div>
  );
};

export default SkipNav;
