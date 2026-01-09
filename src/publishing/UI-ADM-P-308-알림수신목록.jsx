import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import Button from '../components/ui/Button';
import GridTable from '../components/ui/GridTable';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import Popup from '../components/ui/Popup.jsx';

export default function CommonCode() {
  return (
    <div className="oncontentbox full">
      <Popup title="알림 수신 목록" isBtns={true}>
        <div className="oncontents">
          <div className="oncontent">
            <div className="onselect-form open" style={{minHeight: 'auto'}}>
              {/** open 클래스로 동작, 펼치기/접기 */}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  selectOption="선택"
                  menuSize='100px'
                />
                <div className="ondatepickerbox">
                  <DatepickerBox />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
                <MenuInputBox
                  menuType="input"
                  selectOption=""
                  placeholder="사업명"
                  menuSize='150px'
                />
                <div style={{marginLeft: 'auto'}}>
                  <Button btnType="menuSearch" btnNames="검색" />
                </div>
              </div>
            </div>

            <div className="ontable-legend">
              <span>
                총 <b>468</b>개
              </span>
            </div>

            <div className="ongrid-tableform mask">
              <GridTable />
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}
