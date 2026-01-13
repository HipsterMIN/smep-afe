import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload  from "../components/ui/FileUpload.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable.jsx';
import SearchBox from '../components/ui/SearchBox.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>게시물 등록/수정</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>시스템 설정</li>
                  <li>게시물 관리</li>
                  <li>게시판 선택</li>
                  <li>게시물 목록</li>
                  <li className="on">게시물 등록/수정</li>
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
                          <td>게시물 ID</td>
                          <td>999</td>
                          <td>작성자</td>
                          <td>홍길동</td>
                        </tr>
                        <tr>
                          <td>제목</td>
                          <td colSpan={3}><MenuInputBox menuType="input" menuSize='500px' /></td>
                        </tr>
                        <tr>
                          <td>내용</td>
                          <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>출처</td>
                          <td colSpan={3}><MenuInputBox menuType="input" menuSize='300px' /></td>
                        </tr>
                        <tr>
                          <td>게시 여부</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="게시"
                                radioName="게시"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미 게시"
                                radioName="미 게시"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>공개 여부</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="공개"
                                radioName="공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="비공개"
                                radioName="비공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>카테고리</td>
                          <td>
                            <MenuInputBox menuType="select" menuSize='150px' selectOption="카테고리 선택" />
                          </td>
                          <td>게시기간</td>
                          <td>
                            <div className="ondatepickerbox">
                              <DatepickerBox />
                              <span className="onunit">~</span>
                              <DatepickerBox />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일</td>
                          <td colSpan={3}>
                            <div className="onflex onflexcolumn">
                              <Button btnType="addfile" btnNames="파일 선택"/>
                              <input type="file" />
                              <div className="onflex onflexcolumn">
                                <FileUpload mode="edit"/>
                                <FileUpload mode="edit"/>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>이미지 첨부</td>
                          <td colSpan={3}>
                            <div className="onflex onflexcolumn">
                              <Button btnType="addfile" btnNames="파일 선택"/>
                              <input type="file" />
                              <div className="onflex onflexcolumn">
                                <FileUpload mode="edit"/>
                                <FileUpload mode="edit"/>
                              </div>
                              <div className="onfileinfotxt">
                                * 이미지 사이즈는 999 X 999 , 파일사이즈는 999 KB 미만입니다.
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>썸네일 이미지</td>
                          <td colSpan={3}>
                            <div className="onflex onflexcolumn">
                              <Button btnType="addfile" btnNames="파일 선택"/>

                              <div className="onfileinfotxt">
                                * 이미지 사이즈는 999 X 999 , 파일사이즈는 999 KB 미만입니다.
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>동영상 파일</td>
                          <td colSpan={3}><MenuInputBox menuType="input" menuSize='500px' /></td>
                        </tr>
                        <tr>
                          <td>링크 URL</td>
                          <td colSpan={3}><MenuInputBox menuType="input" menuSize='500px' /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">답글 작성</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>게시 여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="게시"
                                radioName="게시"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미 게시"
                                radioName="미 게시"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>공개 여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="공개"
                                radioName="공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="비공개"
                                radioName="비공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>답글 내용</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="onflexbtns">
                  <div style={{ marginRight: 'auto' }}>
                    <Button btnType="list" btnNames="목록" />
                  </div>
                  <Button btnType="add" btnNames="저장" />
                  <Button btnType="del" btnNames="삭제" />
                </div>
              </div>
            </div>
  );
}
