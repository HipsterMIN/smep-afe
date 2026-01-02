import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import Button  from "../components/ui/Button.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  return (
     <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 양식 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li className="on">SMS 양식 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="양식ID" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="양식명" menuSize="300px" />
              <MenuInputBox menuType="input" menuName="작성자" menuSize="150px" />

              <div className="ondatepickerbox">
                <DatepickerBox menuName="작성일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ontable-legend flexEnd">
            <Button btnType="add" btnNames="양식추가" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>

    </div>
    );
}
