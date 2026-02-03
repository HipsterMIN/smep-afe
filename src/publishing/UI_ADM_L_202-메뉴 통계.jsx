import Button  from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';
import Organization from '../components/ui/Organization'; // RC-TREE 조직도

export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>메뉴 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">메뉴 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent" style={{ overflow : 'hidden' }}>
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="구분" selectOption="연/월/일" menuSize="100px" />

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>
          <div className="onstatistics">
            <div className="onflexspace">
              <div className="ontreebox">
                <Organization />
              </div>
              <div className="ongrid-tableform " style={{ width: '100px', flexGrow : '1' }}>
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
