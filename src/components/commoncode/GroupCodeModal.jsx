import { useEffect, useState } from 'react';

import Button from '../ui/Button';
import MenuInputBox from '../ui/MenuInputBox.jsx';
import Popup from '../ui/Popup.jsx';

export default function GroupCodeModal({
  onClose,
  onSave,
  data,
  mode = 'create',
}) {
  const [formData, setFormData] = useState({
    comCdGroupId: '',
    comCdGroupNm: '',
    comCdGroupExpln: '',
    useYn: 'Y',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        comCdGroupId: data.comCdGroupId || '',
        comCdGroupNm: data.comCdGroupNm || '',
        comCdGroupExpln: data.comCdGroupExpln || '',
        useYn: data.useYn || 'Y',
      });
    } else {
      setFormData({
        comCdGroupId: '',
        comCdGroupNm: '',
        comCdGroupExpln: '',
        useYn: 'Y',
      });
    }
    setErrors({});
  }, [data, mode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.comCdGroupId.trim()) {
      newErrors.comCdGroupId = '코드 ID는 필수입니다.';
    }

    if (!formData.comCdGroupNm.trim()) {
      newErrors.comCdGroupNm = '코드명은 필수입니다.';
    }

    if (formData.comCdGroupExpln && formData.comCdGroupExpln.length > 1000) {
      newErrors.comCdGroupExpln = '설명은 1000자 이내로 입력하세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Popup
      title={mode === 'edit' ? '그룹코드 수정' : '그룹코드 등록'}
      isBtns={false}
      autoHeight={true}
      onClose={handleClose}
    >
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '180px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '100px' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>코드 ID</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>코드명</td>
                <td style={{ paddingLeft: '15px' }}>그룹코드 설명</td>
                <td style={{ paddingLeft: '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="150px"
                    placeholder="ABC"
                    value={formData.comCdGroupId}
                    onChange={(e) =>
                      handleChange('comCdGroupId', e.target.value.toUpperCase())
                    }
                    disabled={mode === 'edit'}
                  />
                  {errors.comCdGroupId && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.comCdGroupId}
                    </span>
                  )}
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="190px"
                    placeholder="총괄 관리자"
                    value={formData.comCdGroupNm}
                    onChange={(e) =>
                      handleChange('comCdGroupNm', e.target.value)
                    }
                  />
                  {errors.comCdGroupNm && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.comCdGroupNm}
                    </span>
                  )}
                </td>
                <td
                  style={{
                    borderRight: '1px solid #E1E1E1',
                    paddingLeft: '15px',
                    paddingRight: '15px',
                  }}
                >
                  <MenuInputBox
                    menuType="input"
                    menuSize="100%"
                    placeholder="Code Info..."
                    value={formData.comCdGroupExpln}
                    onChange={(e) =>
                      handleChange('comCdGroupExpln', e.target.value)
                    }
                  />
                  {errors.comCdGroupExpln && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.comCdGroupExpln}
                    </span>
                  )}
                </td>
                <td style={{ paddingLeft: '15px' }}>
                  <MenuInputBox
                    menuType="select"
                    menuSize="70px"
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
