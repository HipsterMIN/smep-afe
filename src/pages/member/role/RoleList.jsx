import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import SearchBox from '@components/ui/SearchBox.jsx';

export default function RoleList() {
  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>관리자 권한그룹 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>권한 관리</li>
          <li className="on">관리자 권한그룹 관리</li>
        </ul>
      </div>

      <div className="oncontents space">
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>권한그룹</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormGroup"
                placeholder="검색어를 입력하세요."
              />
              <Button btnType="search" btnNames="검색" />
              <Button btnType="add" btnNames="추가" />
            </div>
          </div>
          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>

        <div className="oncontent">
          <div className="ongrid-form">
            <h4>소속인원</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormChild"
                placeholder="검색어를 입력하세요."
              />
              <Button btnType="search" btnNames="검색" />
              <Button btnType="del" btnNames="삭제" />
              <Button btnType="add" btnNames="추가" />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
