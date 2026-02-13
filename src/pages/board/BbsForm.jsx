import CommonCodeRadioGroup from "@components/commoncode/CommonCodeRadioGroup.jsx";
import Button from "@components/ui/Button.jsx";
import MenuInputBox from "@components/ui/MenuInputBox.jsx";
import RadioButton from "@components/ui/RadioButton.jsx";
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function BbsForm() {
  const navigate = useNavigate();

  // 폼 데이터 state
  const [formData, setFormData] = useState({
    bbsNm: '',
    bbsExplnCn: '',
    bbsTypeCd: 'BSC', //초기값 설정
    useYn: 'Y',
    ctgryUseYn: 'N',
    atchFileUseYn: 'N',
    regPsbltyYn: 'N',
    answerPsbltyYn: 'N',
    atchFilePsblCnt: 0,
    atchFileSizeLimit: 0,
    scrnId: '',
  });

  // 카테고리 관련 state
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [setEditingIndex] = useState(null);

  // 공통코드 조회
  useEffect(() => {
  }, []);

  // 폼 입력 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  // 화면 ID 중복 체크
  const handleCheckDuplicate = () => {
    if (formData.scrnId.trim() === '') {
      alert('화면 ID를 입력해주세요.');
      return;
    }
    alert('중복 체크 기능은 API 연동이 필요합니다.');
  };

  // 목록으로 이동
  const handleGoToList = () => {
    if (window.confirm('작성 중인 내용이 저장되지 않습니다. 목록으로 이동하시겠습니까?')) {
      navigate(-1);
    }
  };

  // 저장
  const handleSave = () => {
    if (formData.bbsNm.trim() === '') {
      alert('게시판명을 입력해주세요.');
      return;
    }
    if (!formData.bbsTypeCd) {
      alert('게시판 유형을 선택해주세요.');
      return;
    }

    const saveData = {
      ...formData,
      categories: categories.map(cat => cat.name),
    };

    console.log('저장할 데이터:', saveData);
    alert('저장 기능은 API 연동이 필요합니다.');
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
                  <td>
                    <MenuInputBox
                        menuType="input"
                        menuSize='500px'
                        value={formData.bbsNm}
                        onChange={(e) => handleInputChange('bbsNm', e.target.value)}
                    />
                  </td>
                  <td>게시판 ID</td>
                  <td>자동생성</td>
                </tr>

                <tr>
                  <td>게시판 소개</td>
                  <td colSpan={3}>
                    <MenuInputBox
                        menuType="input"
                        menuSize='100%'
                        value={formData.bbsExplnCn}
                        onChange={(e) => handleInputChange('bbsExplnCn', e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>게시판 유형</td>
                  <td colSpan={3}>
                    <div className="onradioBox">
                      {/* 공통코드 RadioGroup 컴포넌트 사용 */}
                      <CommonCodeRadioGroup
                          codeGroup="BBS_TYPE_CD"
                          radioGroup="bbsTypeCd"
                          selectedValue={formData.bbsTypeCd}
                          onChange={(value) => handleRadioChange('bbsTypeCd', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>사용 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                          groupId="useYn_y"
                          radioGroup="useYn"
                          radioValue="Y"
                          radioName="사용"
                          selectedValue={formData.useYn}
                          onChange={(value) => handleRadioChange('useYn', value)}
                      />
                      <RadioButton
                          groupId="useYn_n"
                          radioGroup="useYn"
                          radioValue="N"
                          radioName="미사용"
                          selectedValue={formData.useYn}
                          onChange={(value) => handleRadioChange('useYn', value)}
                      />
                    </div>
                  </td>
                  <td>카테고리 사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                          groupId="ctgryUseYn_y"
                          radioGroup="ctgryUseYn"
                          radioValue="Y"
                          radioName="사용"
                          selectedValue={formData.ctgryUseYn}
                          onChange={(value) => handleRadioChange('ctgryUseYn', value)}
                      />
                      <RadioButton
                          groupId="ctgryUseYn_n"
                          radioGroup="ctgryUseYn"
                          radioValue="N"
                          radioName="미사용"
                          selectedValue={formData.ctgryUseYn}
                          onChange={(value) => handleRadioChange('ctgryUseYn', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>첨부파일 사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                          groupId="atchFileUseYn_y"
                          radioGroup="atchFileUseYn"
                          radioValue="Y"
                          radioName="사용"
                          selectedValue={formData.atchFileUseYn}
                          onChange={(value) => handleRadioChange('atchFileUseYn', value)}
                      />
                      <RadioButton
                          groupId="atchFileUseYn_n"
                          radioGroup="atchFileUseYn"
                          radioValue="N"
                          radioName="미사용"
                          selectedValue={formData.atchFileUseYn}
                          onChange={(value) => handleRadioChange('atchFileUseYn', value)}
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
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCategory();
                              }
                            }}
                        />
                        <Button
                            btnType="add"
                            btnNames="추가"
                            onClick={handleAddCategory}
                        />
                      </div>
                      <div className="ontableBox categoryEdit">
                        <table>
                          <colgroup>
                            <col/>
                            <col style={{width: '76px'}}/>
                            <col style={{width: '76px'}}/>
                          </colgroup>
                          <tbody>
                          {categories.length === 0 ? (
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                                  등록된 카테고리가 없습니다.
                                </td>
                              </tr>
                          ) : (
                              categories.map((category, index) => (
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
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  handleSaveCategory(index, category.name);
                                                }
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
                              ))
                          )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>등록 가능여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                          groupId="regPsbltyYn_y"
                          radioGroup="regPsbltyYn"
                          radioValue="Y"
                          radioName="사용"
                          selectedValue={formData.regPsbltyYn}
                          onChange={(value) => handleRadioChange('regPsbltyYn', value)}
                      />
                      <RadioButton
                          groupId="regPsbltyYn_n"
                          radioGroup="regPsbltyYn"
                          radioValue="N"
                          radioName="미사용"
                          selectedValue={formData.regPsbltyYn}
                          onChange={(value) => handleRadioChange('regPsbltyYn', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>답글 가능여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                          groupId="answerPsbltyYn_y"
                          radioGroup="answerPsbltyYn"
                          radioValue="Y"
                          radioName="사용"
                          selectedValue={formData.answerPsbltyYn}
                          onChange={(value) => handleRadioChange('answerPsbltyYn', value)}
                      />
                      <RadioButton
                          groupId="answerPsbltyYn_n"
                          radioGroup="answerPsbltyYn"
                          radioValue="N"
                          radioName="미사용"
                          selectedValue={formData.answerPsbltyYn}
                          onChange={(value) => handleRadioChange('answerPsbltyYn', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>첨부파일 가능 개수</td>
                  <td>
                    <div className="onflexrow">
                      <MenuInputBox
                          menuType="input"
                          menuSize='80px'
                          value={formData.atchFilePsblCnt}
                          onChange={(e) => handleInputChange('atchFilePsblCnt', e.target.value)}
                      />
                      <span>개 ※ 사이즈제한</span>
                      <MenuInputBox
                          menuType="input"
                          menuSize='80px'
                          value={formData.atchFileSizeLimit}
                          onChange={(e) => handleInputChange('atchFileSizeLimit', e.target.value)}
                      />
                      <span>MB (0일 경우 제한 없음)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>화면 ID</td>
                  <td colSpan={3}>
                    <div className="onflexrow">
                      <MenuInputBox
                          menuType="input"
                          menuSize='150px'
                          value={formData.scrnId}
                          onChange={(e) => handleInputChange('scrnId', e.target.value)}
                      />
                      <Button
                          btnType="edit"
                          btnNames="중복체크"
                          onClick={handleCheckDuplicate}
                      />
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="onflexbtns">
            <div style={{marginRight: 'auto'}}>
              <Button
                  btnType="list"
                  btnNames="목록"
                  onClick={handleGoToList}
              />
            </div>
            <Button
                btnType="add"
                btnNames="저장"
                onClick={handleSave}
            />
          </div>
        </div>
      </div>
  );
}
