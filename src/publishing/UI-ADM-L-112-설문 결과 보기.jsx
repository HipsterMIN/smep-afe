import Button from '../components/ui/Button';
import FileUpload2 from '../components/ui/FileUpload2';
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  const onClickDownload = (e) => {
    e.preventDefault();
  }
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>설문 결과 보기</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">설문결과 보기</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>설문 제목</td>
                  <td colSpan={3}>제목입니다.</td>
                </tr>
                <tr>
                  <td>설문 기간</td>
                  <td>YYYY-MM-DD ~ YYYY-MM-DD</td>
                  <td>설문 응답자</td>
                  <td>123,456명</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="응답자" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="질문유형" selectOption="전체" />
              <MenuInputBox menuType="input" menuName="질문내용" menuSize="150px" />

              <div className="ondatepickerbox">
                <DatepickerBox menuName="응답일" />
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
