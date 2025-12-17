import './MainLayout.css';

import React from 'react';

import SkipNav from '../components/a11y/SkipNav';

/**
 * 공공기관 표준 레이아웃
 * - SkipNav 포함
 * - Header, Main, Footer 랜드마크 구분
 */
const MainLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {/* 접근성: 본문 바로가기 (최상단 위치) */}
      <SkipNav />

      <header className="layout-header" role="banner">
        <h1>공공기관 서비스 예시</h1>
      </header>

      {/* 메인 콘텐츠 영역: SkipNav의 타겟 ID 필수 */}
      <main id="main-content" className="layout-main" role="main">
        {children}
      </main>

      <footer className="layout-footer" role="contentinfo">
        <address>
          서울특별시 예시구 예시대로 123 (우)00000 <br />
          Copyright © Public Institution. All rights reserved.
        </address>
      </footer>
    </div>
  );
};

export default MainLayout;