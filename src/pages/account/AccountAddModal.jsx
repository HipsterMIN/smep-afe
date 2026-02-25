import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import { useEffect, useState } from 'react';

export default function AccountAddModal({
  onClose,
  onSave,
  data,
  mode = 'create',
}) {
  const [formData, setFormData] = useState({
    // mnrgPrmIpNo: '',
    ipAddr: '',
    memoCn: '',
    useYn: 'Y',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      ipAddr: '',
      memoCn: '',
      useYn: 'Y',
    });
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

    if (!formData.ipAddr.trim()) {
      newErrors.ipAddr = 'IP 주소는 필수입니다.';
    }

    if (formData.memoCn && formData.memoCn.length > 4000) {
      newErrors.memoCn = '메모는 4000자 이내로 입력하세요.';
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
      title={'접속허용 IP 등록'}
      isBtns={false}
      autoHeight={true}
      onClose={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '180px' }} />
              <col style={{ width: '240px' }} />
              <col style={{ width: '100px' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>IP</td>
                <td>메모</td>
                <td style={{ paddingLeft: '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="270px"
                    placeholder="XXX"
                    value={formData.ipAddr}
                    onChange={(e) => handleChange('ipAddr', e.target.value)}
                  />
                  {errors.ipAddr && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.ipAddr}
                    </span>
                  )}
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="360px"
                    placeholder="XXX"
                    value={formData.memoCn}
                    onChange={(e) => handleChange('memoCn', e.target.value)}
                  />
                  {errors.memoCn && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {errors.memoCn}
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
