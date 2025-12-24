
// 관리자 - 좌측 Nav 메뉴
export default function Leftbar() {
  return (
    <div className="onleftbar">
      <a href="#" className="onlinksystem">시스템 관리</a>
      <ul className='onleftbar-navlink navdepth1'>
        <li className="navdepth1-list">
          <a href="#" herf="#">회원/권한 관리</a>
        </li>
        <li className="navdepth1-list on">
          <button>
            <span>시스템 설정</span>
          </button>
          <ul className="navdepth2">
            <li className="navdepth2-list">
              <a href="#" herf="#">관리자 메뉴관리</a>
            </li>
            <li className="navdepth2-list">
              <a href="#" herf="#">사용자 메뉴관리</a>
            </li>
            <li className="navdepth2-list">
              <a href="#" herf="#">게시판 관리</a>
            </li>
            <li className="navdepth2-list">
              <a href="#" herf="#">게시물 관리</a>
            </li>
            <li className="navdepth2-list on">
              <a href="#" herf="#">공통코드 관리</a>
            </li>
            <li className="navdepth2-list">
              <a href="#" herf="#">보안설정</a>
            </li>
            <li className="navdepth2-list">
              <a href="#" herf="#">API 연계 관리</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
} 