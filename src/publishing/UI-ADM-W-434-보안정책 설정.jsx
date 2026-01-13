import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import GridTable from '../components/ui/GridTable';

export default function CommonCode() {
  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>보안정책 설정</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>시스템 설정</li>
                  <li className="on">보안정책 설정</li>
                </ul>
              </div>
              <div className="oncontents">
                <div className="oncontent ontable-form">

                  <h4 className="ontableTitle">보안정책</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '400px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className="onbgtxtleft">인증 허용 IP 주소</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                          <td className="onbgtxtleft">로그인 최소 주기</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                        </tr>
                        <tr>
                          <td className="onbgtxtleft">이용자 보안정책 명</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                          <td className="onbgtxtleft">중복로그인 체크 주기</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                        </tr>
                        <tr>
                          <td className="onbgtxtleft">비밀번호 만료 경고 기간 (만료일로부터 몇일전) (단위:일)</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                          <td className="onbgtxtleft">비밀번호 실패 허용 개수</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                        </tr>
                        <tr>
                          <td className="onbgtxtleft">비밀번호 유효기간 (단위:일)</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                          <td className="onbgtxtleft">세션 유효시간</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                        </tr>
                        <tr>
                          <td className="onbgtxtleft">이용자 보안정책 코드</td>
                          <td><MenuInputBox menuType="input" menuSize="400px" placeholder="placeholder" /></td>
                          <td></td>
                          <td></td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </div>
    
                  <h4 className="ontableTitle">개정 이력</h4>
                  <div className="ongrid-tableform mask">
                    <GridTable />
                  </div>
                </div>
              </div>
            </div>
  );
}
