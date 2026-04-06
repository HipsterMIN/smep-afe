import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import Button  from "../components/ui/Button.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  return (
     <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>관리자 권한 변경 이력</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>관리자 관리</li>
          <li>관리자 계정 관리</li>
          <li className="on">관리자 권한 변경 이력</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="관리자명" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="처리상태" selectOption="유효" menuSize="100px" />
              <MenuInputBox menuType="input" menuName="처리사유" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="특이사항" menuSize="150px" />

              <div className="ondatepickerbox">
                <DatepickerBox menuName="수정일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>

    </div>
    );
}
