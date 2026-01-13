import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';
import Button from '../components/ui/Button';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';

export default function CommonCode() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>접속허용 IP 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">접속허용 IP 관리</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="IP" menuSize='150px' />
              <MenuInputBox menuType="input" menuName="메모" menuSize='300px' />
              <MenuInputBox menuType="select" menuName="사용여부" menuSize='100px' />

              <div style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox menuType="input" menuName="등록자" menuSize='100px' />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="등록일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <MenuInputBox menuType="input" menuName="삭제자" menuSize='100px' />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="삭제일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>10</b>건
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="추가" />
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
