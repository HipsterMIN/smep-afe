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
        <h2>설문지 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>설문 관리</li>
          <li>설문 목록</li>
          <li className="on">설문지 관리</li>
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
                  <td>설문제목</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="input" menuSize="100%" placeholder="제목을 입력하세요." />
                  </td>
                </tr>
                <tr>
                  <td>설문기간</td>
                  <td colSpan={3}>
                    <div className="ondatepickerbox">
                      <DatepickerBox />
                      <span className="onunit">~</span>
                      <DatepickerBox />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td>홍길동</td>
                  <td>등록일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>홍길동</td>
                  <td>수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="onflexbtns">
            <div style={{ marginRight: 'auto' }}>
              <Button btnType="list" btnNames="목록" />
            </div>
            <Button btnType="add" btnNames="저장" />
            <Button btnType="del" btnNames="삭제" />
          </div>

          <div className="ontable-legend">
            <h2 className="onsubtitle">설문 문항 목록</h2>
            <Button btnType="add" btnNames="문항추가" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
        
      </div>
    </div>
  );
}
