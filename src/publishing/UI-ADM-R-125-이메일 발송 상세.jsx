import Button from '../components/ui/Button';
import FileUpload2 from '../components/ui/FileUpload2';
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  const onClickDownload = (e) => {
    e.preventDefault();
  }
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 발송 상세</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li className="on">이메일 발송 상세</li>
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
                  <td>발신자</td>
                  <td>관리자</td>
                  <td>발신이메일</td>
                  <td>abc@email.com</td>
                </tr>
                <tr>
                  <td>구분</td>
                  <td>분류</td>
                  <td>제목</td>
                  <td>[통합플랫폼] 증명서 발급이 완료되었습니다.</td>
                </tr>
                <tr>
                  <td>발송유형</td>
                  <td>예약발송 (2025-08-01 17:43)</td>
                  <td>메일내용</td>
                  <td><Button btnType="edit" btnNames="내용보기" /></td>
                </tr>
                <tr>
                  <td>발송일시</td>
                  <td>2025-08-01 17:43</td>
                  <td rowSpan={3}>설명</td>
                  <td rowSpan={3}>설명입니다.</td>
                </tr>
                <tr>
                  <td>발송상태</td>
                  <td>발송완료</td>
                </tr>
                <tr>
                </tr>
                <tr>
                  <td>발송 총건수</td>
                  <td>34</td>
                  <td rowSpan={3}>첨부파일</td>
                  <td rowSpan={3}>
                    <FileUpload2 mode="view" />
                    <FileUpload2 mode="view" />
                  </td>
                </tr>
                <tr>
                  <td>실패건수</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">발송 상세 내역</h4>
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="수신자" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="수신번호" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="결과" selectOption="전체" />
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
          
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" />
          </div>
        </div>
      </div>
    </div>
  );
}
