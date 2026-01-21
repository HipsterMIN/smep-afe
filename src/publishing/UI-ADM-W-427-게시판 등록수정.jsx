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
  const [categoryInput, setCategoryInput] = useState(''); // 카테고리 추가 입력값
  const [categories, setCategories] = useState([]); // 카테고리 목록
  const [editingIndex, setEditingIndex] = useState(null); // 수정 중인 카테고리 인덱스

  // 카테고리 추가
  const handleAddCategory = () => {
    if (categoryInput.trim() === '') {
      alert('카테고리 내용을 입력해주세요.');
      return;
    }
    setCategories([...categories, { name: categoryInput, isEditing: false }]);
    setCategoryInput('');
  };

  // 카테고리 수정 모드 진입
  const handleEditCategory = (index) => {
    setEditingIndex(index);
    setCategories(categories.map((cat, i) =>
      i === index ? { ...cat, isEditing: true } : cat
    ));
  };

  // 카테고리 수정 저장
  const handleSaveCategory = (index, newName) => {
    if (newName.trim() === '') {
      alert('카테고리 내용을 입력해주세요.');
      return;
    }
    setCategories(categories.map((cat, i) =>
      i === index ? { ...cat, name: newName, isEditing: false } : cat
    ));
    setEditingIndex(null);
  };

  // 카테고리 삭제
  const handleDeleteCategory = (index) => {
    if (window.confirm('삭제하시겠습니까?')) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>게시판 등록/수정</h2>
                <ul className="onbreadcrumb">
                  <li>시스템 관리</li>
                  <li>시스템 설정</li>
                  <li>게시판 관리</li>
                  <li>게시판 목록</li>
                  <li className="on">게시판 등록/수정</li>
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
                          <td>게시판명</td>
                          <td><MenuInputBox menuType="input" menuSize='500px'/></td>
                          <td>게시판 ID</td>
                          <td>999</td>
                        </tr>
                        <tr>
                          <td>게시판 소개</td>
                          <td colSpan={3}>
                            <div className="oneditcontent" />
                          </td>
                        </tr>
                        <tr>
                          <td>게시판 유형</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="기본"
                                radioName="기본"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="Q&A"
                                radioName="Q&A"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="FAQ"
                                radioName="FAQ"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="이미지"
                                radioName="이미지"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="동영상"
                                radioName="동영상"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="링크"
                                radioName="링크"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="웹진"
                                radioName="웹진"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>사용 여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                          <td>카테고리 사용여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
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
                          <td rowSpan={5}>카테고리 관리</td>
                          <td rowSpan={5}>
                            <div className="onflexcolumn">
                              <div className="onflexrow">
                                <MenuInputBox
                                  menuType="input"
                                  menuSize='300px'
                                  value={categoryInput}
                                  onChange={(e) => setCategoryInput(e.target.value)}
                                />
                                <Button
                                  btnType="add"
                                  btnNames="추가"
                                  onClick={handleAddCategory}
                                />
                              </div>
                              <div className="ontableBox categoryEdit" >
                                <table>
                                  <colgroup>
                                    <col />
                                    <col style={{ width: '76px' }} />
                                    <col style={{ width: '76px' }} />
                                  </colgroup>
                                  <tbody>
                                    {categories.map((category, index) => (
                                      <tr key={index}>
                                        <td>
                                          {category.isEditing ? (
                                            <MenuInputBox
                                              menuType="input"
                                              menuSize="100%"
                                              value={category.name}
                                              onChange={(e) => {
                                                const newCategories = [...categories];
                                                newCategories[index].name = e.target.value;
                                                setCategories(newCategories);
                                              }}
                                            />
                                          ) : (
                                            <span className="statusTxt">{category.name}</span>
                                          )}
                                        </td>
                                        <td>
                                          {category.isEditing ? (
                                            <Button
                                              btnType="add"
                                              btnNames="저장"
                                              size="small"
                                              onClick={() => handleSaveCategory(index, category.name)}
                                            />
                                          ) : (
                                            <Button
                                              btnType="edit"
                                              size="small"
                                              btnNames="수정"
                                              onClick={() => handleEditCategory(index)}
                                            />
                                          )}
                                        </td>
                                        <td>
                                          <Button
                                            btnType="del"
                                            size="small"
                                            btnNames="삭제"
                                            onClick={() => handleDeleteCategory(index)}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>게시판여부 사용여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>게시기간 사용여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일 사용여부</td>
                          <td>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일 가능 개수</td>
                          <td>
                            <div className="onflexrow">
                              <MenuInputBox menuType="input" menuSize='80px' />
                              <span>※ 사이즈제한</span>
                              <MenuInputBox menuType="input" menuSize='80px' />
                              <span>MB (0일 경우 제한 없음)</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>상단 고정 사용여부</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>출처 사용 여부</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="사용"
                                radioName="사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="미사용"
                                radioName="미사용"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>화면 ID</td>
                          <td colSpan={3}>
                            <div className="onflexrow">
                              <MenuInputBox menuType="input" menuSize='150px' />
                              <Button btnType="edit" btnNames="중복체크"/>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>등록 권한</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="관리자만 가능"
                                radioName="관리자만 가능"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="전체"
                                radioName="전체"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>답글 권한</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="관리자만 가능"
                                radioName="관리자만 가능"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="전체"
                                radioName="전체"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>파일 업로드 권한</td>
                          <td colSpan={3}>
                            <div className="onradioBox">
                              <RadioButton
                                groupId="group2_1"
                                radioGroup="group2"
                                radioValue="등록자만 가능"
                                radioName="등록자만 가능"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
                              <RadioButton
                                groupId="group2_2"
                                radioGroup="group2"
                                radioValue="전체"
                                radioName="전체"
                                selectedValue={selectedValue}
                                onChange={setSelectedValue}
                              />
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
                  <Button btnType="add" btnNames="저장" />
                </div>
              </div>
            </div>
  );
}
