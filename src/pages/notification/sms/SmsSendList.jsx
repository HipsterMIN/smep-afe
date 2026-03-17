import Button from '@/components/ui/Button.jsx';
import DatepickerBox from '@/components/ui/DatepickerBox.jsx';
import GridTable from '@/components/ui/GridTable';
import MenuInputBox from '@/components/ui/MenuInputBox.jsx';

export default function SmsSendList() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 발송 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">SMS 관리</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="메시지 구분"
                selectOption="전체"
              />
              <MenuInputBox
                menuType="select"
                menuName="발송유형"
                selectOption="전체"
              />
              <MenuInputBox
                menuType="select"
                menuName="발송상태"
                selectOption="전체"
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="발신자"
                menuSize="150px"
              />
              <MenuInputBox menuType="input" menuName="제목" menuSize="300px" />
              <div className="ondatepickerbox">
                <DatepickerBox menuName="발송일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
            </div>
          </div>

          <div className="ontable-legend flexEnd">
            <Button btnType="add" btnNames="메시지 작성" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
