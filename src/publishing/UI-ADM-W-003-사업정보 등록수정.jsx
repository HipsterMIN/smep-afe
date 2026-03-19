import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import Essential  from "../components/ui/Essential.jsx";
import FileUpload  from "../components/ui/FileUpload.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>사업정보 등록/수정</h2>
                <ul className="onbreadcrumb">
                  <li>지원사업 관리</li>
                  <li>사업공고 관리</li>
                  <li className="on">사업정보 관리</li>
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
                          <td>사업ID <Essential /></td>
                          <td>ABC1234</td>
                          <td>스크랩수</td>
                          <td>2</td>
                        </tr>
                        <tr>
                          <td>사업년도 <Essential /></td>
                          <td>
                            <MenuInputBox menuType="select" selectOption="2025" />
                          </td>
                          <td>공개여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="A"
                                radioName="공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="B"
                                radioName="비공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              {/* <RadioButton
                                groupId="3"
                                radioGroup="group2"
                                radioValue="disable"
                                radioName="미사용"
                                disabled={true}
                              /> */}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>등록일시</td>
                          <td>2025-03-26 14:32:35</td>
                          <td>최종수정일시</td>
                          <td>2025-03-26 14:32:35</td>
                        </tr>
                        <tr>
                          <td>사업유형(정책분류)</td>
                          <td>
                            <MenuInputBox
                              menuType="select"
                              menuSize="150px"
                              selectOption="2025"
                            />
                          </td>
                          <td>지원기관</td>
                          <td>
                            <MenuInputBox
                              menuType="select"
                              menuSize="150px"
                              selectOption="중소벤처기업부"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>기업구분</td>
                          <td colSpan={3}>
                            <MenuInputBox
                              menuType="select"
                              menuSize="150px"
                              selectOption="2025"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>순번</td>
                          <td colSpan={3}>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                              placeholder="검색어를 입력하세요."
                            />
                            <span className="onsubinfo">
                              ※ 엑셀파일의 POLICY_INDEX를 입력해 주세요.
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
    
                  <h4 className="ontableTitle">사업정보</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>사업명</td>
                          <td>oooo지원사업</td>
                        </tr>
                        <tr>
                          <td>사업개요</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">사업개요</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>지원규모</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>비지원대상</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>지원내용</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">신청 절차</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>신청접수</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>신청시기</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>제출서류</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>처리절차</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>심사평가내용</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일</td>
                          <td>
                            <Button btnType="addfile" btnNames="파일 선택"/>
                            <input type="file" />
                            <div className="onflex onflexcolumn">
                              <FileUpload mode="edit"/>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">문의처</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>문의처</td>
                          <td>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">제한조건</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>기업규모</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>업력</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>근로자 수</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>인증</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>기업소재지</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
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
                  <Button btnType="del" btnNames="삭제" />
                  <Button btnType="add" btnNames="저장" />
                </div>
              </div>
            </div>
  );
}
