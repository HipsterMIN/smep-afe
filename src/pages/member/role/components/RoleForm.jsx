import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import http from '@lib/http.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ROLE_USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }

    return responseData ?? response ?? null;
  }

  return response ?? null;
}

export default function RoleForm({ mode, roleId, onClose, onSaved }) {
  const isCreateMode = mode === 'create';
  const [formData, setFormData] = useState({
    roleId: '',
    roleNm: '',
    useYn: 'Y',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoleDetail() {
      if (isCreateMode) {
        setFormData({
          roleId: '',
          roleNm: '',
          useYn: 'Y',
        });
        return;
      }

      if (!roleId) {
        return;
      }

      setLoading(true);

      try {
        const response = await http.get(`/api/v1/roles/${roleId}`);
        const payload = resolvePayload(response);

        if (!isMounted) {
          return;
        }

        setFormData({
          roleId: payload?.roleId ?? roleId,
          roleNm: payload?.roleNm ?? '',
          useYn: payload?.useYn ?? 'Y',
        });
      } catch (error) {
        console.error('[RoleForm] 권한그룹 상세 조회 실패', error);
        alert(
          error?.response?.data?.message ||
            '권한그룹 정보를 불러오는데 실패했습니다.'
        );

        if (isMounted) {
          onClose?.();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRoleDetail();

    return () => {
      isMounted = false;
    };
  }, [isCreateMode, roleId, onClose]);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    const normalizedRoleNm = formData.roleNm.trim();

    if (!normalizedRoleNm) {
      alert('권한명을 입력해주세요.');
      return;
    }

    if (!formData.useYn) {
      alert('사용여부를 선택해주세요.');
      return;
    }

    setSaving(true);

    try {
      if (isCreateMode) {
        await http.post('/api/v1/roles', {
          roleNm: normalizedRoleNm,
          useYn: formData.useYn,
        });
      } else {
        await http.put(`/api/v1/roles/${roleId}`, {
          roleNm: normalizedRoleNm,
          useYn: formData.useYn,
        });
      }

      alert(isCreateMode ? '등록되었습니다.' : '수정되었습니다.');
      await onSaved?.(mode);
    } catch (error) {
      console.error(
        `[RoleForm] 권한그룹 ${isCreateMode ? '등록' : '수정'} 실패`,
        error
      );
      alert(
        error?.response?.data?.message ||
          `권한그룹 ${isCreateMode ? '등록' : '수정'}에 실패했습니다.`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popup
      title="권한그룹 등록/수정"
      isBtns={true}
      autoHeight={true}
      onClose={onClose}
    >
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '160px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>ID</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>권한명</td>
                <td style={{ paddingLeft: '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td>
                  {loading
                    ? '조회중...'
                    : isCreateMode
                      ? '자동생성'
                      : formData.roleId || '-'}
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="100%"
                    placeholder="권한명을 입력하세요."
                    value={formData.roleNm}
                    onChange={(event) =>
                      handleChange('roleNm', event.target.value)
                    }
                    disabled={loading || saving}
                  />
                </td>
                <td style={{ paddingLeft: '15px' }}>
                  <MenuInputBox
                    menuType="select"
                    menuSize="100%"
                    value={formData.useYn}
                    onChange={(event) =>
                      handleChange('useYn', event.target.value)
                    }
                    disabled={loading || saving}
                    options={ROLE_USE_YN_OPTIONS}
                    showAllOption={false}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="btns">
        <Button
          btnType="add"
          btnNames="저장"
          onClick={handleSave}
          disabled={loading || saving}
        />
      </div>
    </Popup>
  );
}

RoleForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']),
  roleId: PropTypes.string,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};
