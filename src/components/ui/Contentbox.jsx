import Button from './Button'
import Contents from './Contents'

// 관리자 - 컨텐츠 영역
export default function Contentbox({ contentType }) {
  return (
    <div className="oncontentbox-wrap">
      <div className="oncontentTab">
        <ul>
          <li className={contentType === 'type1' ? 'active' : ''}>
            <a href="#">공통코드 관리</a>
            <i className="close" />
          </li>
          <li className={contentType === 'type2' ? 'active' : ''}>
            <a href="#">권한 관리</a>
            <i className="close" />
          </li>
          <li className={contentType === 'type3' ? 'active' : ''}>
            <a href="#">관리자 메뉴관리</a>
            <i className="close" />
          </li>
          <li className={contentType === 'type4' ? 'active' : ''}>
            <a href="#">게시판 관리</a>
            <i className="close" />
          </li>
          <li className={(contentType === 'type5' || contentType === 'type6') ? 'active' : ''}>
            <a href="#">사업정보 관리</a>
            <i className="close" />
          </li>
        </ul>
        <Button btnType='closeAll' btnNames='전체닫기' />
      </div>

      <Contents contentType={contentType} />
    </div>
  )
} 