import Button from '../components/ui/Button';
import GridTable from '../components/ui/GridTable';
import MenuInputBox from '../components/ui/MenuInputBox';

export default function BoardMgmt() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>게시판 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">게시판 관리</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form">
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="게시판 ID"
                placeholder="ID 입력"
              />
              <MenuInputBox
                menuType="input"
                menuSize="200px"
                menuName="게시판 명"
                placeholder="게시판 명을 입력하세요."
              />
              <MenuInputBox
                menuType="select"
                menuSize="80px"
                menuName="유형"
                selectOption="Y"
              />
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                menuName="소개글"
                placeholder="소개글을 입력하세요."
              />
              <MenuInputBox
                menuType="select"
                menuName="공개여부"
                selectOption="Y"
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                selectOption="Y"
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>468</b>개
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
