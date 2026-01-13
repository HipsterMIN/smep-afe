
import Button from '../components/ui/Button.jsx';
import GridTable from '../components/ui/GridTable.jsx';
import MenuInputBox from '../components/ui/MenuInputBox.jsx';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import FileUpload from '../components/ui/FileUpload.jsx';

export default function CommonCode() {
  return (
    <div className="oncontentbox">
              <div className="oncontentTitle">
                <h2>팝업 관리</h2>
                <ul className="onbreadcrumb">
                  <li>정보제공</li>
                  <li>고객지원 관리</li>
                  <li className="on">팝업 목록</li>
                </ul>
              </div>
    
              <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
                <div className="oncontent">
                  <div className="ongrid-form">
                  <h4>팝업 목록</h4>
                    <div className="onselect-form ">
                      {' '}
                      <div className="onparagraph">
                        <MenuInputBox menuType="select" menuName="팝업 종류" menuSize="100px" />
                        <MenuInputBox menuType="input" menuName="제목" menuSize="300px" />
                        <div className="ondatepickerbox">
                          <DatepickerBox menuName="게시기간" />
                          <span className="onunit">~</span>
                          <DatepickerBox />
                        </div>
                        <MenuInputBox menuType="select" menuName="사용여부" menuSize="100px" />
                        
                        <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                          <Button btnType="menuSearch" btnNames="검색" />
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
                  <h4>팝업 상세조회</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '150px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>팝업종류</td>
                          <td>레이어</td>
                        </tr>
                        <tr>
                          <td>제목</td>
                          <td>제목입니다.</td>
                        </tr>
                        <tr>
                          <td>팝업창 위치</td>
                          <td>
                            <div className="onmenuspace">
                              <dl>
                                <dt>TOP</dt>
                                <dd>300</dd>
                              </dl>
                              <dl>
                                <dt>LEFT</dt>
                                <dd>300</dd>
                              </dl>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>팝업창 사이즈</td>
                          <td>
                            <div className="onmenuspace">
                              <dl>
                                <dt>가로</dt>
                                <dd>300</dd>
                              </dl>
                              <dl>
                                <dt>세로</dt>
                                <dd>300</dd>
                              </dl>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>이미지 파일</td>
                          <td>
                            <div className="onflexcolumn">
                              <FileUpload mode="view" />
                              <dl>
                                <dt>대체 문구 : </dt>
                                <dd>대체문구입니다.</dd>
                              </dl>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>링크</td>
                          <td>
                            <a href="#">link</a>
                          </td>
                        </tr>
                        <tr>
                          <td>링크타겟</td>
                          <td>target</td>
                        </tr>
                        <tr>
                          <td>게시기간</td>
                          <td>2025-01-01 ~ 2025-12-01</td>
                        </tr>
                        <tr>
                          <td>그만보기 여부</td>
                          <td>미확인</td>
                        </tr>
                        <tr>
                          <td>사용여부</td>
                          <td>미확인</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="onflexbtns">
                    <div style={{ marginLeft: 'auto' }}>
                      <Button btnType="edit" btnNames="수정" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  );
}
