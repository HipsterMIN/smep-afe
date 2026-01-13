import { useState } from 'react';

import Button from '../components/ui/Button.jsx';
import RadioButton from '../components/ui/RadioButton';
import GridTable from '../components/ui/GridTable.jsx';
import MenuInputBox from '../components/ui/MenuInputBox.jsx';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import FileUpload from '../components/ui/FileUpload.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수
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
                  <h4>팝업 등록수정</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '150px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>팝업종류</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="A"
                                radioName="새창"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="B"
                                radioName="레이어"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="3"
                                radioGroup="group2"
                                radioValue="disable"
                                radioName="띠배너"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>제목</td>
                          <td><MenuInputBox menuType="input" menuName="제목" menuSize="300px" /></td>
                        </tr>
                        <tr>
                          <td>팝업창 위치</td>
                          <td>
                            <div className="onflexrow">
                              <MenuInputBox
                                menuType="input"
                                menuName="TOP"
                                menuSize="150px"
                              />
                              <MenuInputBox
                                menuType="input"
                                menuName="LEFT"
                                menuSize="150px"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>팝업창 사이즈</td>
                          <td>
                            <div className="onflexrow">
                              <MenuInputBox
                                menuType="input"
                                menuName="가로"
                                menuSize="150px"
                              />
                              <MenuInputBox
                                menuType="input"
                                menuName="세로"
                                menuSize="150px"
                              />
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="정사각형"
                                radioName="정사각형"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="직사각형"
                                radioName="직사각형"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>이미지 파일</td>
                          <td>
                            <div className="onflexcolumn">
                              <FileUpload mode="view" />
                              <MenuInputBox
                                menuType="input"
                                menuName="대체문구"
                                menuSize="300px"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>링크</td>
                          <td><MenuInputBox menuType="input" menuSize="300px" /></td>
                        </tr>
                        <tr>
                          <td>링크타겟</td>
                          <td>
                            <div className="onflexrow">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="현재창"
                                radioName="현재창"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="새창"
                                radioName="새창"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>게시기간</td>
                          <td>
                            <div className="onparagraph">
                              <div className="ondatepickerbox">
                                <DatepickerBox />
                                <span className="onunit">~</span>
                                <DatepickerBox />
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>그만보기 여부</td>
                          <td>
                            <div className="onflexrow">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="사용안함"
                                radioName="사용안함"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>사용여부</td>
                          <td>
                            <div className="onflexrow">
                              <RadioButton
                                groupId="1"
                                radioGroup="group1"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="2"
                                radioGroup="group1"
                                radioValue="사용안함"
                                radioName="사용안함"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="onflexbtns" style={{ justifyContent : 'flex-end' }}>
                    <Button btnType="add" btnNames="저장" />
                    <Button btnType="del" btnNames="삭제" />
                  </div>
                </div>
              </div>
            </div>
  );
}
