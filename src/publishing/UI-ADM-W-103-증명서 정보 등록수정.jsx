import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import TextareaBox  from "../components/ui/TextareaBox.jsx";

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>증명서 정보 등록</h2>
                <ul className="onbreadcrumb">
                  <li>증명서 발급 관리</li>
                  <li>증명서 정보 관리</li>
                  <li>증명서 정보 목록</li>
                  <li className="on">증명서 정보 등록</li>
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
                          <td>증명서 명</td>
                          <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                            </td>
                            <td>공개여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group1_1"
                                radioGroup="group1"
                                radioValue="공개"
                                radioName="공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group1_2"
                                radioGroup="group1"
                                radioValue="비공개"
                                radioName="비공개"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>소관기관</td>
                          <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                          <td>발급기관</td>
                            <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>등록일시</td>
                          <td></td>
                            <td>최종수정일시</td>
                          <td></td>
                        </tr>
                        <tr>
                        
                        </tr>
                        
                        <tr>
                          <td>공개여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="직접발급"
                                radioName="직접발급"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="타서비스 링크"
                                radioName="타서비스 링크"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                          <td>전자증명서 대상 여부</td>
                           <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group3_1"
                                radioGroup="group3"
                                radioValue="대상"
                                radioName="대상"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group3_2"
                                radioGroup="group3"
                                radioValue="대상 아님"
                                radioName="대상 아님"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>타서비스 링크</td>
                          <td colSpan={3}>
                            <div className="onmenuspace">
                              <MenuInputBox menuType="input" menuName="서비스명" menuSize="300px" />
                              <MenuInputBox menuType="input" menuName="링크" menuSize="300px" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>내용(PC)</td>
                           <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>내용(모바일)</td>
                           <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>안내문구</td> 
                           <td colSpan={3}>
                          <TextareaBox menuSize="100%" placeholder="검색어를 입력하세요."/>
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
