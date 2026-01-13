import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import Button  from "../components/ui/Button.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  return (
     <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>게시물 목록</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>게시물 관리</li>
          <li>게시판 선택</li>
          <li className="on">게시물 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox onbgtable">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter">게시판 ID</td>
                  <td className="br-right ontxtbold">게시판 명</td>
                  <td className="onbgtxtcenter">게시판 유형</td>
                  <td className="ontxtbold">게시판 소개 글</td>
                </tr>
                <tr>
                  <td className="ontxtcenter ontxtnormal">999</td>
                  <td className="br-right ontxtnormal">공지사항</td>
                  <td className="ontxtcenter ontxtnormal">기본</td>
                  <td className="ontxtnormal">게시판 소개의 대한 글 입니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="게시물 ID" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="제목" menuSize="150px" />
              <MenuInputBox menuType="input" menuName="내용" menuSize="300px" />
              <MenuInputBox menuType="select" menuName="카테고리" menuSize="100px" />

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

          <div className="ontable-legend">
            <span>
              총 <b>10</b>건
            </span>
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
