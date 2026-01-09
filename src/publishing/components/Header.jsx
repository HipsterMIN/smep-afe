import { useState } from 'react';
import icoVatar from '../../assets/images/common/ico_avatar.svg';
import icoLogout from '../../assets/images/common/ico_logout.svg';
import icoLogo from '../../assets/images/common/logo.svg';

// 관리자 - 상단 메뉴
export default function Header({
  isOnNavToggle,
  handleOnNavToggle = () => {},
}) {
  return (
    <header className="onheader">
      <div className="onheader-lft">
        <button
          className={`onnavtoggle ${isOnNavToggle && 'on'}`}
          onClick={() => handleOnNavToggle()}
        >
          <span className="sr-only">네비게이션바 토글 버튼</span>
        </button>
        <h1 className="onlogo">
          <a href="#" herf="#">
            <img src={icoLogo} alt="중소기업통합플랫폼" />
          </a>
        </h1>
      </div>
      <div className="onheader-ctr">
        <a href="#" className="onnavlink">
          지원사업 관리
        </a>
        <a href="#" className="onnavlink">
          증명서발급 관리
        </a>
        <a href="#" className="onnavlink">
          정보제공
        </a>
        <a href="#" className="onnavlink">
          통계/분석
        </a>
        <a href="#" className="onnavlink">
          시스템 관리
        </a>
        <a href="#" className="onnavlink">
          AI서비스 관리
        </a>
        <a href="#" className="onnavlink">
          데이터레이크 관리
        </a>
      </div>
      <div className="onheader-rht">
        <div className="onavatar">
          <span className="onavatar-thumb">
            <img src={icoVatar} alt="아바타이미지" />
          </span>
          <span className="onavatar-name">홍길동</span>
        </div>
        <div className="onsessiontime-box">
          <span className="time">00:56</span>
          <button className="onbtn-blue">시간연장</button>
          <button className="onbtn-gray" />
        </div>
        <div className="onlog-box">
          <button>
            <img src={icoLogout} alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}
