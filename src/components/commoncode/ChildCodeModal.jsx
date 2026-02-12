import { useEffect, useState } from 'react';

import Button from '../ui/Button';
import MenuInputBox from '../ui/MenuInputBox.jsx';
import Popup from '../ui/Popup.jsx';

export default function ChildCodeModal({
  onClose,
  onSave,
  data,
  groupCodeId,
  mode = 'create',
}) {
  const [formData, setFormData] = useState({
    comCdGroupId: '',
    code: '',
    codeName: '',
    sortOrder: '',
    useYn: 'Y',
  });

  const [errors, setErrors] = useState({});

  // 컴포넌트 마운트 시 데이터 초기화
  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        comCdGroupId: data.comCdGroupId || groupCodeId || '',
        code: data.comCd || '',
        codeName: data.comCdNm || '',
        sortOrder: data.sortSeq || '',
        useYn: data.useYn || 'Y',
      });
    } else {
      // 신규 등록 시 초기화 (그룹코드 ID는 유지)
      setFormData({
        comCdGroupId: groupCodeId || '',
        code: '',
        codeName: '',
        sortOrder: '',
        useYn: 'Y',
      });
    }
    setErrors({});
  }, [data, groupCodeId, mode]);

  // 입력값 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // 유효성 검증
  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = '코드 ID는 필수입니다.';
    }

    if (!formData.codeName.trim()) {
      newErrors.codeName = '코드명은 필수입니다.';
    }

    if (!formData.sortOrder.toString().trim()) {
      newErrors.sortOrder = '정렬순서는 필수입니다.';
    } else if (isNaN(formData.sortOrder) || Number(formData.sortOrder) < 0) {
      newErrors.sortOrder = '정렬순서는 0 이상의 숫자만 가능합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 저장 핸들러
  const handleSave = () => {
    if (validate()) {
      onSave({
        ...formData,
        sortOrder: Number(formData.sortOrder),
      });
    }
  };

  // 취소 버튼 핸들러
  const handleClose = () => {
    onClose();
  };

  return (
    <Popup
      title={mode === 'edit' ? '하위코드 수정' : '하위코드 등록'}
      isBtns={false}
      autoHeight={true}
      onClose={handleClose}
    >
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '250px' }} />
              <col style={{ width: '250px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '80px' }} />
            </colgroup>

            <tbody>
              <tr>
                <td>코드 ID</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>코드명</td>
                <td style={{ paddingLeft: '15px' }}>정렬순서</td>
                <td style={{ paddingLeft: '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="250px"
                    placeholder="ABC"
                    value={formData.code}
                    onChange={(e) =>
                      handleChange('code', e.target.value.toUpperCase())
                    }
                    disabled={mode === 'edit'}
                  />
                  {errors.code && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.code}
                    </span>
                  )}
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="250px"
                    placeholder="코드이름"
                    value={formData.codeName}
                    onChange={(e) => handleChange('codeName', e.target.value)}
                  />
                  {errors.codeName && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.codeName}
                    </span>
                  )}
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="100px"
                    placeholder="4"
                    value={formData.sortOrder}
                    onChange={(e) => handleChange('sortOrder', e.target.value)}
                    type="number"
                  />
                  {errors.sortOrder && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.sortOrder}
                    </span>
                  )}
                </td>
                <td style={{ paddingLeft: '15px' }}>
                  <MenuInputBox
                    menuType="select"
                    menuSize="80px"
                    value={formData.useYn}
                    onChange={(e) => handleChange('useYn', e.target.value)}
                    showAllOption={false}
                    options={[
                      { value: 'Y', label: 'Y' },
                      { value: 'N', label: 'N' },
                    ]}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="btns">
        <Button btnType="add" btnNames="저장" onClick={handleSave} />
        <Button btnType="del" btnNames="취소" onClick={handleClose} />
      </div>
    </Popup>
  );
}
