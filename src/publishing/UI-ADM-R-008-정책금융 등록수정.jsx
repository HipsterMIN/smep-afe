import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>정책금융 등록</h2>
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
                          <td>승인여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="승인"
                                radioName="승인"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="승인대기"
                                radioName="승인대기"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                          <td>접수상황</td>
                            <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>사업수행기관</td>
                            <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                          <td>상품명</td>
                            <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>상품목적</td>
                          <td colSpan={3}>
                            <MenuInputBox
                              menuType="input"
                              menuSize="100%"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상</td>
                          <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>우대조건</td>
                          <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                          <td>보증한도</td>
                          <td>
                             <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>보증비율</td>
                          <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                          <td>보증료율 감면</td>
                          <td>
                             <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상자금</td>
                          <td>
                            <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                          <td>신청방식</td>
                          <td>
                             <MenuInputBox
                              menuType="input"
                              menuSize="300px"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>보증제한대상</td>
                          <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>관할지역</td>
                          <td colSpan={3}>
                            <MenuInputBox
                              menuType="input"
                              menuSize="100%"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>문의</td>
                           <td colSpan={3}>
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
                  <Button btnType="del" btnNames="삭제" />
                  <Button btnType="edit" btnNames="수정" />
                  <Button btnType="add" btnNames="등록" />
                </div>
              </div>
            </div>
  );
}
