import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import Button  from "../components/ui/Button.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  return (
     <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>통합로그인 사이트 목록</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>통합로그인 사이트 관리</li>
          <li className="on">통합로그인 사이트 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="사이트명" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="관리기관" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="회원구분" menuSize="100px" />
              <MenuInputBox menuType="select" menuName="노출여부" menuSize="100px" />
              <MenuInputBox menuType="select" menuName="사용여부" menuSize="100px" />

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ontable-legend flexEnd" style={{ gap : '8px' }}>
            <Button btnType="add" btnNames="순서변경" />
            <Button btnType="add" btnNames="등록" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>

    </div>
    );
}
