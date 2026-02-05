import Button from '../../components/ui/Button';
import DatepickerBox from '../../components/ui/DatepickerBox.jsx';
import GridTable from '../../components/ui/GridTable.jsx';
import MenuInputBox from '../../components/ui/MenuInputBox.jsx';

export default function MemberList() {
  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>회원 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li className="on">회원 목록</li>
        </ul>
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>회원 목록</h4>
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="회원 구분"
                  menuSize="100px"
                />
                <MenuInputBox
                  menuType="input"
                  menuName="회원 명"
                  menuSize="150px"
                />
                <MenuInputBox
                  menuType="select"
                  menuName="상태"
                  menuSize="100px"
                />

                <div style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" />
                </div>
              </div>
              <div className="onparagraph middle">
                <div className="ondatepickerbox">
                  <DatepickerBox menuName="가입기간" />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
                <div className="ondatepickerbox">
                  <DatepickerBox menuName="등록기간" />
                  <span className="onunit">~</span>
                  <DatepickerBox />
                </div>
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>10</b>건
            </span>
            <Button btnType="add" btnNames="등록" />
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <GridTable />
          </div>
        </div>

        <div className="oncontent ontable-form">
          <h4>회원정보 상세조회(개인)</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>아이디</td>
                  <td>ABC</td>
                </tr>
                <tr>
                  <td>상태</td>
                  <td>정상</td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>031-123-4567</td>
                </tr>
                <tr>
                  <td>유선번호</td>
                  <td>010-1234-5678</td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>Placehloder</td>
                </tr>
                <tr>
                  <td>이메일 수신동의 여부</td>
                  <td>동의</td>
                </tr>
                <tr>
                  <td>SMS 수신동의 여부</td>
                  <td>미동의</td>
                </tr>
                <tr>
                  <td>최종 수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>생성일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>최종 로그인 일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>스마트 알림 사용 여부</td>
                  <td>
                    <div className="onflexrow">
                      <span>사용</span>
                      <Button btnType="search" btnNames="관심분야조회" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns">
            <div style={{ marginLeft: 'auto' }}>
              <Button btnType="edit" btnNames="수정" />
            </div>
          </div>

          <h4>활동내역</h4>
          <div className="ontableBox" style={{ marginBottom: '30px' }}>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>스크랩</td>
                  <td>
                    <div className="onflexrow">
                      <span>999 건</span>
                      <Button btnType="search" btnNames="상세보기" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>알림 수신</td>
                  <td>
                    <div className="onflexrow">
                      <span>999 건</span>
                      <Button btnType="search" btnNames="상세보기" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>회원정보 변경이력</h4>
          <div className="ongrid-tableform">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
