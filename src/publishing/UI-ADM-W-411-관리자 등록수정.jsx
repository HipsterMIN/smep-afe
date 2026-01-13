import { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload  from "../components/ui/FileUpload.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>관리자 등록/수정</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>회원/권한 관리</li>
                  <li>관리자 관리</li>
                  <li>관리자 계정 관리</li>
                  <li>관리자 목록</li>
                  <li className="on">관리자 등록/수정</li>
                </ul>
              </div>
              <div className="oncontents">
                <div className="oncontent ontable-form">
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>권한그룹</td>
                          <td><MenuInputBox menuType="select" selectOption="" menuSize='150px'/></td>
                        </tr>
                        <tr>
                          <td>아이디</td>
                          <td>
                            <div className="onflexrow">
                              <MenuInputBox menuType="input" menuSize="100%" />
                              <Button btnType="edit" btnNames="중복확인"/>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>이름</td>
                          <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                        </tr>
                        <tr>
                          <td>비밀번호</td>
                          <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                        </tr>
                        <tr>
                          <td>비밀번호 확인</td>
                          <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                        </tr>
                        <tr>
                          <td>비밀번호 틀린 횟수</td>
                          <td>
                            <div className="onflexrow">
                              <span>1회</span>
                              <Button btnType="reset" btnNames="초기화"/>
                              <p>※ 초기화 버튼 클릭 또는 비밀번호 변경 시 비밀번호 틀린횟수가 초기화됩니다.</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>전화번호</td>
                          <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                        </tr>
                        <tr>
                          <td>휴대폰번호</td>
                          <td><MenuInputBox menuType="input" menuSize="100%" /></td>
                        </tr>
                        <tr>
                          <td>승인여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group1_1"
                                radioGroup="group1"
                                radioValue="group1_1"
                                radioName="승인"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_2"
                                radioGroup="group1"
                                radioValue="group1_2"
                                radioName="미승인"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_3"
                                radioGroup="group1"
                                radioValue="group1_3"
                                radioName="승인대기"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>사용여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group1_1"
                                radioGroup="group1"
                                radioValue="group1_1"
                                radioName="유효"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_2"
                                radioGroup="group1"
                                radioValue="group1_2"
                                radioName="폐기"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_3"
                                radioGroup="group1"
                                radioValue="group1_3"
                                radioName="정지"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>만료일</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group1_1"
                                radioGroup="group1"
                                radioValue="group1_1"
                                radioName="6개월(2026-06-10)"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_2"
                                radioGroup="group1"
                                radioValue="group1_2"
                                radioName="1년(2026-12-10)"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_3"
                                radioGroup="group1"
                                radioValue="group1_3"
                                radioName="2년(2027-12-10)"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>특이사항</td>
                          <td><MenuInputBox menuType="input" menuSize="500px" /></td>
                        </tr>
                        <tr>
                          <td>처리사유</td>
                          <td><MenuInputBox menuType="input" menuSize="500px" /></td>
                        </tr>
                        <tr>
                          <td>최종수정일</td>
                          <td>2025-12-10</td>
                        </tr>
                        <tr>
                          <td>수정자</td>
                          <td>홍길동</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="onflexbtns">
                  <div style={{ marginRight: 'auto' }}>
                    <Button btnType="list" btnNames="목록" />
                  </div>
                  <Button btnType="del" btnNames="삭제" />
                  <Button btnType="add" btnNames="저장" />
                </div>
              </div>
            </div>
  );
}
