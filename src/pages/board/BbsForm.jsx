import CommonCodeRadioGroup from '@components/commoncode/CommonCodeRadioGroup.jsx';
import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function BbsForm() {
  const navigate = useNavigate();
  const { bbsNo } = useParams();
  const isEdit = !!bbsNo;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bbsNo: '',
    bbsNm: '',
    bbsExplnCn: '',
    bbsTypeCd: 'BSC',
    useYn: 'Y',
    ctgryUseYn: 'N',
    fileAtchPsbltyYn: 'N',
    edtrUseYn: 'N',
    cmntPsbltyYn: 'N',
    atchFilePsblCnt: 0,
    maxAtchFileSz: 0,
    scrnId: '',
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const visibleCategories = categories
    .map((category, index) => ({ category, index }))
    .filter(({ category }) => (category?.useYn || 'Y') !== 'N');

  const applyDetailToForm = (data) => {
    if (!data) return;

    setFormData((prev) => ({
      ...prev,
      bbsNo: data.bbsNo || prev.bbsNo,
      bbsNm: data.bbsNm || '',
      bbsExplnCn: data.bbsExplnCn || '',
      bbsTypeCd: data.bbsTypeCd || prev.bbsTypeCd,
      useYn: data.useYn || 'Y',
      ctgryUseYn: data.ctgryUseYn || 'N',
      fileAtchPsbltyYn: data.fileAtchPsbltyYn || 'N',
      edtrUseYn: data.edtrUseYn || 'N',
      cmntPsbltyYn: data.cmntPsbltyYn || 'N',
      maxAtchFileSz: data.maxAtchFileSz
        ? String(Math.floor(Number(data.maxAtchFileSz) / (1024 * 1024)))
        : 0,
      scrnId: data.scrnId || '',
    }));

    const detailCategories = Array.isArray(data.categories)
      ? data.categories
          .map((category) => ({
            ctgryNo: category?.ctgryNo,
            name: category?.ctgryNm || category?.name || '',
            useYn: category?.useYn || 'Y',
            isEditing: false,
          }))
          .filter((category) => category.name.trim() !== '')
      : [];
    setCategories(detailCategories);
  };

  useEffect(() => {
    const fetchBbs = async () => {
      setLoading(true);
      try {
        const response = await http.get(`/api/v1/board/bbs/${bbsNo}`);
        applyDetailToForm(response?.data);
      } catch (error) {
        console.error('게시판 상세 조회 실패:', error);
        alert(error?.response?.data?.message || '게시판 상세 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) fetchBbs();
  }, [bbsNo, isEdit]);

  const getCurrentMemberNo = () => {
    const candidates = [
      sessionStorage.getItem('mbrNo'),
      localStorage.getItem('mbrNo'),
      sessionStorage.getItem('memberNo'),
      localStorage.getItem('memberNo'),
    ];
    const value = candidates.find((item) => item && item.trim() !== '');
    return value || 'M000000000000001';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    const categoryName = categoryInput.trim();
    if (categoryName === '') {
      alert('카테고리 내용을 입력해 주세요.');
      return;
    }
    setCategories([...categories, { name: categoryName, useYn: 'Y', isEditing: false }]);
    setCategoryInput('');
  };

  const handleEditCategory = (index) => {
    setCategories(categories.map((cat, i) => (i === index ? { ...cat, isEditing: true } : cat)));
  };

  const handleSaveCategory = (index, newName) => {
    const categoryName = newName.trim();
    if (categoryName === '') {
      alert('카테고리 내용을 입력해 주세요.');
      return;
    }
    setCategories(
      categories.map((cat, i) =>
        i === index ? { ...cat, name: categoryName, useYn: 'Y', isEditing: false } : cat
      )
    );
  };

  const handleDeleteCategory = (index) => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    setCategories((prev) => {
      const target = prev[index];
      if (!target) return prev;

      if (target.ctgryNo) {
        return prev.map((category, i) =>
          i === index ? { ...category, useYn: 'N', isEditing: false } : category
        );
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCheckDuplicateApi = async () => {
    const trimmedScrnId = formData.scrnId.trim();
    if (trimmedScrnId === '') {
      alert('화면 ID를 입력해 주세요.');
      return;
    }

    try {
      const params = { scrnId: trimmedScrnId };
      if (isEdit && bbsNo) params.bbsNo = bbsNo;

      const response = await http.get('/api/v1/board/bbs/scrn-id/duplicate-check', { params });
      const duplicated = Boolean(response?.data?.duplicated);
      if (duplicated) {
        alert('이미 사용 중인 화면 ID 입니다.');
        return;
      }
      alert('사용 가능한 화면 ID 입니다.');
    } catch (error) {
      console.error('화면 ID 중복 체크 실패:', error);
      alert(error?.response?.data?.message || '화면 ID 중복 체크에 실패했습니다.');
    }
  };

  const handleGoToList = () => {
    if (window.confirm('작성 중인 내용은 저장되지 않습니다. 목록으로 이동하시겠습니까?')) {
      navigate(-1);
    }
  };

  const handleSave = async () => {
    if (formData.bbsNm.trim() === '') {
      alert('게시판명을 입력해 주세요.');
      return;
    }
    if (!formData.bbsTypeCd) {
      alert('게시판 유형을 선택해 주세요.');
      return;
    }

    if (formData.ctgryUseYn === 'Y') {
      const hasCategory = categories.some(
        (category) =>
          (category?.useYn || 'Y') !== 'N' && (category?.name || '').trim() !== ''
      );
      if (!hasCategory) {
        alert('카테고리를 1개 이상 등록해 주세요.');
        return;
      }
    }

    const memberNo = getCurrentMemberNo();
    const activeCategories = categories.filter(
      (category) =>
        (category?.useYn || 'Y') !== 'N' && (category?.name || '').trim() !== ''
    );
    const requestCategories =
      formData.ctgryUseYn === 'Y'
        ? activeCategories.map((category, index) => ({
            ctgryNm: (category?.name || '').trim(),
            sortSeq: index + 1,
            useYn: 'Y',
          }))
        : [];

    const requestData = {
      bbsNm: formData.bbsNm.trim(),
      bbsExplnCn: formData.bbsExplnCn.trim(),
      bbsTypeCd: formData.bbsTypeCd,
      mngMbrNo: memberNo,
      scrnId: formData.scrnId.trim(),
      fileAtchPsbltyYn: formData.fileAtchPsbltyYn,
      maxAtchFileSz: Number(formData.maxAtchFileSz || 0) * 1024 * 1024,
      atchFileExtnCn: '',
      edtrUseYn: formData.edtrUseYn,
      ctgryUseYn: formData.ctgryUseYn,
      cmntPsbltyYn: formData.cmntPsbltyYn,
      bbsRegMbrNo: memberNo,
      bbsMdfcnMbrNo: memberNo,
      useYn: formData.useYn,
      categories: requestCategories,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await http.put(`/api/v1/board/bbs/${bbsNo}`, requestData);
        alert('게시판이 수정되었습니다.');
      } else {
        await http.post('/api/v1/board/bbs', requestData);
        alert('게시판이 등록되었습니다.');
      }
      navigate(-1);
    } catch (error) {
      console.error('게시판 저장 실패:', error);
      alert(error?.response?.data?.message || '게시판 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">데이터를 불러오는 중입니다.</div>
        </div>
      </div>
    );
  }

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
                      menuSize="500px"
                      value={formData.bbsNm}
                      onChange={(e) => handleChange('bbsNm', e.target.value)}
                    />
                  </td>
                  <td>게시판 ID</td>
                  <td>{isEdit ? formData.bbsNo || bbsNo || '-' : '자동생성'}</td>
                </tr>

                <tr>
                  <td>게시판 소개</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={formData.bbsExplnCn}
                      onChange={(value) => handleChange('bbsExplnCn', value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>게시판 유형</td>
                  <td colSpan={3}>
                    <div className="onradioBox">
                      <CommonCodeRadioGroup
                        codeGroup="BBS_TYPE_CD"
                        radioGroup="bbsTypeCd"
                        selectedValue={formData.bbsTypeCd}
                        onChange={(value) => handleChange('bbsTypeCd', value)}
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
                        onChange={(value) => handleChange('useYn', value)}
                      />
                      <RadioButton
                        groupId="useYn_n"
                        radioGroup="useYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.useYn}
                        onChange={(value) => handleChange('useYn', value)}
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
                        onChange={(value) => handleChange('ctgryUseYn', value)}
                      />
                      <RadioButton
                        groupId="ctgryUseYn_n"
                        radioGroup="ctgryUseYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.ctgryUseYn}
                        onChange={(value) => handleChange('ctgryUseYn', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>첨부파일 사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="fileAtchPsbltyYn_y"
                        radioGroup="fileAtchPsbltyYn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={formData.fileAtchPsbltyYn}
                        onChange={(value) => handleChange('fileAtchPsbltyYn', value)}
                      />
                      <RadioButton
                        groupId="fileAtchPsbltyYn_n"
                        radioGroup="fileAtchPsbltyYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.fileAtchPsbltyYn}
                        onChange={(value) => handleChange('fileAtchPsbltyYn', value)}
                      />
                    </div>
                  </td>
                  <td rowSpan={5}>카테고리 관리</td>
                  <td rowSpan={5}>
                    <div className="onflexcolumn">
                      <div className="onflexrow">
                        <MenuInputBox
                          menuType="input"
                          menuSize="300px"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCategory();
                            }
                          }}
                        />
                        <Button btnType="add" btnNames="추가" onClick={handleAddCategory} />
                      </div>
                      <div className="ontableBox categoryEdit">
                        <table>
                          <colgroup>
                            <col />
                            <col style={{ width: '76px' }} />
                            <col style={{ width: '76px' }} />
                          </colgroup>
                          <tbody>
                            {visibleCategories.length === 0 ? (
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                                  등록된 카테고리가 없습니다.
                                </td>
                              </tr>
                            ) : (
                              visibleCategories.map(({ category, index }) => (
                                <tr key={`${category.ctgryNo ?? 'new'}-${index}`}>
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
                                        onKeyDown={(e) => {
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
                        groupId="edtrUseYn_y"
                        radioGroup="edtrUseYn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={formData.edtrUseYn}
                        onChange={(value) => handleChange('edtrUseYn', value)}
                      />
                      <RadioButton
                        groupId="edtrUseYn_n"
                        radioGroup="edtrUseYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.edtrUseYn}
                        onChange={(value) => handleChange('edtrUseYn', value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>답글 가능여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="cmntPsbltyYn_y"
                        radioGroup="cmntPsbltyYn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={formData.cmntPsbltyYn}
                        onChange={(value) => handleChange('cmntPsbltyYn', value)}
                      />
                      <RadioButton
                        groupId="cmntPsbltyYn_n"
                        radioGroup="cmntPsbltyYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.cmntPsbltyYn}
                        onChange={(value) => handleChange('cmntPsbltyYn', value)}
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
                        menuSize="80px"
                        value={formData.atchFilePsblCnt}
                        onChange={(e) => handleChange('atchFilePsblCnt', e.target.value)}
                      />
                      <span>개 / 파일크기제한</span>
                      <MenuInputBox
                        menuType="input"
                        menuSize="80px"
                        value={formData.maxAtchFileSz}
                        onChange={(e) => handleChange('maxAtchFileSz', e.target.value)}
                      />
                      <span>MB (0인 경우 제한 없음)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>화면 ID</td>
                  <td colSpan={3}>
                    <div className="onflexrow">
                      <MenuInputBox
                        menuType="input"
                        menuSize="150px"
                        value={formData.scrnId}
                        onChange={(e) => handleChange('scrnId', e.target.value)}
                      />
                      <Button btnType="edit" btnNames="중복체크" onClick={handleCheckDuplicateApi} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleGoToList} />
          </div>
          <Button
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
