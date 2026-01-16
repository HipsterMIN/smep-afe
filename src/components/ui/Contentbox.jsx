import Button from './Button';
import Contents from './Contents';

// 관리자 - 컨텐츠 영역
// eslint-disable-next-line react/prop-types
export default function Contentbox({ children }) {  // children으로 변경
  return (
      /* TODO : 탭기능 구현  */
      <div className="oncontentbox-wrap">
        <div className="oncontentTab">
          <ul>
            <li className="active">
              <a href="#">공통코드 관리</a>
              <i className="close"/>
            </li>
            <li>
              <a href="#">권한 관리</a>
              <i className="close"/>
            </li>
            <li>
              <a href="#">관리자 메뉴관리</a>
              <i className="close"/>
            </li>
            <li>
              <a href="#">게시판 관리</a>
              <i className="close"/>
            </li>
            <li>
              <a href="#">사업정보 관리</a>
              <i className="close"/>
            </li>
          </ul>
          <Button btnType="closeAll" btnNames="전체닫기"/>
        </div>


        <Contents>{children}</Contents> {/* children 전달 */}
      </div>
  );
}
