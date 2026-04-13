import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useAuth } from '@context/AuthContext';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const NAME_MAX_LENGTH = 100;
const MOBILE_MAX_LENGTH = 11;
const MOBILE_PHONE_PATTERN = /^01[0-9]\d{7,8}$/;
const NEW_PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

const DEFAULT_FORM_DATA = {
  mbrNm: '',
  mngrMblTelno: '',
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

const DEFAULT_PROFILE = {
  mbrNo: '',
  lgnId: '',
  mbrNm: '',
  mngrMblTelno: '',
  roleId: '',
  roleNm: '',
  mngrAcntUseSttsCd: '',
  mngrAcntAprvSttsCd: '',
  mngrAcntExpryDt: null,
};

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// 휴대폰은 백엔드 DTO가 최대 11자라, 화면에서도 숫자만 남겨 저장 호환 형태로 맞춘다.
function normalizeMobileDigits(value) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, MOBILE_MAX_LENGTH);
}

function resolveDisplayName(user) {
  return normalizeText(user?.name || user?.mbrNm || '');
}

function resolveDisplayLoginId(user) {
  return normalizeText(user?.username || user?.lgnId || '');
}

function resolveDisplayRole(user) {
  return normalizeText(user?.roleNm || user?.role || user?.authGroupNm || '');
}

function resolveDisplayExpiryLabel(user) {
  const rawValue =
    user?.mngrAcntExpryDt || user?.mngrAcntExpiryDt || user?.expiryDt || user?.expiresAt;

  if (!rawValue) {
    return '-';
  }

  return `${formatDate(rawValue, 'yyyy-MM-dd')}(변경불가)`;
}

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
      return responseData.data ?? responseData;
    }

    return responseData ?? response ?? {};
  }

  return response ?? {};
}

function normalizeProfile(profile, fallbackUser) {
  const source = profile ?? {};

  return {
    mbrNo: normalizeText(source.mbrNo || fallbackUser?.mbrNo || ''),
    lgnId: resolveDisplayLoginId(source) || resolveDisplayLoginId(fallbackUser),
    mbrNm: normalizeText(source.mbrNm || resolveDisplayName(fallbackUser)),
    mngrMblTelno: normalizeMobileDigits(
      source.mngrMblTelno ||
        fallbackUser?.mngrMblTelno ||
        fallbackUser?.mblTelno ||
        fallbackUser?.mobilePhone ||
        fallbackUser?.phoneNumber ||
        ''
    ),
    roleId: normalizeText(source.roleId || fallbackUser?.roleId || ''),
    roleNm: normalizeText(source.roleNm || resolveDisplayRole(fallbackUser)),
    mngrAcntUseSttsCd: normalizeText(
      source.mngrAcntUseSttsCd || fallbackUser?.mngrAcntUseSttsCd || ''
    ),
    mngrAcntAprvSttsCd: normalizeText(
      source.mngrAcntAprvSttsCd || fallbackUser?.mngrAcntAprvSttsCd || ''
    ),
    mngrAcntExpryDt:
      source.mngrAcntExpryDt ||
      fallbackUser?.mngrAcntExpryDt ||
      fallbackUser?.mngrAcntExpiryDt ||
      fallbackUser?.expiryDt ||
      fallbackUser?.expiresAt ||
      null,
  };
}

function resolveErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  return (
    responseData?.message ||
    responseData?.data?.message ||
    error?.message ||
    fallbackMessage
  );
}

export default function LoginInfoForm({ onClose, isPopup }) {
  const { user, syncUserProfile } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [profile, setProfile] = useState(() => normalizeProfile(DEFAULT_PROFILE, user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const initialUserRef = useRef(user);

  const displayRole = profile.roleNm || '-';
  const displayLoginId = profile.lgnId || '-';
  const expiryLabel = resolveDisplayExpiryLabel(profile);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await http.get('/api/v1/account/profile');
        const normalizedProfile = normalizeProfile(
          resolvePayload(response),
          initialUserRef.current
        );

        if (!isMounted) {
          return;
        }

        setProfile(normalizedProfile);
        setFormData((prev) => ({
          ...prev,
          mbrNm: normalizedProfile.mbrNm,
          mngrMblTelno: normalizedProfile.mngrMblTelno,
        }));
        syncUserProfile({
          mbrNo: normalizedProfile.mbrNo,
          lgnId: normalizedProfile.lgnId,
          username: normalizedProfile.lgnId,
          mbrNm: normalizedProfile.mbrNm,
          name: normalizedProfile.mbrNm,
          mngrMblTelno: normalizedProfile.mngrMblTelno,
          roleId: normalizedProfile.roleId,
          roleNm: normalizedProfile.roleNm,
          mngrAcntExpryDt: normalizedProfile.mngrAcntExpryDt,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const fallbackProfile = normalizeProfile(DEFAULT_PROFILE, initialUserRef.current);
        setProfile(fallbackProfile);
        setFormData((prev) => ({
          ...prev,
          mbrNm: fallbackProfile.mbrNm,
          mngrMblTelno: fallbackProfile.mngrMblTelno,
        }));
        alert(
          resolveErrorMessage(
            error,
            '로그인 정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
          )
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [syncUserProfile]);

  const handleTextChange = (field) => (event) => {
    const nextValue = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'mngrMblTelno'
          ? normalizeMobileDigits(nextValue)
          : nextValue,
    }));
  };

  const validateForm = () => {
    const trimmedName = normalizeText(formData.mbrNm);
    const normalizedMobile = normalizeMobileDigits(formData.mngrMblTelno);
    const trimmedCurrentPassword = normalizeText(formData.currentPassword);
    const trimmedNewPassword = normalizeText(formData.newPassword);
    const trimmedNewPasswordConfirm = normalizeText(
      formData.newPasswordConfirm
    );
    const hasPasswordChangeInput =
      trimmedCurrentPassword ||
      trimmedNewPassword ||
      trimmedNewPasswordConfirm;

    if (!profile.lgnId) {
      return '로그인 사용자 정보를 확인할 수 없습니다.';
    }

    if (!trimmedName) {
      return '이름을 입력해주세요.';
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      return '이름은 100자 이하로 입력해주세요.';
    }

    if (!normalizedMobile) {
      return '휴대폰번호를 입력해주세요.';
    }

    if (!MOBILE_PHONE_PATTERN.test(normalizedMobile)) {
      return '휴대폰번호 형식이 올바르지 않습니다. 숫자만 01012345678 형식으로 입력해주세요.';
    }

    if (!hasPasswordChangeInput) {
      return null;
    }

    if (!trimmedCurrentPassword) {
      return '현재 비밀번호를 입력해주세요.';
    }

    if (!trimmedNewPassword) {
      return '새 비밀번호를 입력해주세요.';
    }

    if (!trimmedNewPasswordConfirm) {
      return '새 비밀번호 확인을 입력해주세요.';
    }

    if (trimmedCurrentPassword === trimmedNewPassword) {
      return '새 비밀번호는 현재 비밀번호와 달라야 합니다.';
    }

    if (!NEW_PASSWORD_PATTERN.test(trimmedNewPassword)) {
      return '새 비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~20자여야 합니다.';
    }

    if (trimmedNewPassword !== trimmedNewPasswordConfirm) {
      return '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.';
    }

    return null;
  };

  const handleSave = async () => {
    const validationMessage = validateForm();
    const trimmedName = normalizeText(formData.mbrNm);
    const normalizedMobile = normalizeMobileDigits(formData.mngrMblTelno);
    const trimmedCurrentPassword = normalizeText(formData.currentPassword);
    const trimmedNewPassword = normalizeText(formData.newPassword);
    const trimmedNewPasswordConfirm = normalizeText(formData.newPasswordConfirm);
    const hasPasswordChangeInput =
      trimmedCurrentPassword || trimmedNewPassword || trimmedNewPasswordConfirm;
    const hasProfileChanges =
      trimmedName !== profile.mbrNm || normalizedMobile !== profile.mngrMblTelno;

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    if (!hasProfileChanges && !hasPasswordChangeInput) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    let passwordChanged = false;
    let profileChanged = false;

    try {
      setSaving(true);

      if (hasPasswordChangeInput) {
        await http.put('/api/v1/account/password', {
          currentPassword: trimmedCurrentPassword,
          newPassword: trimmedNewPassword,
          newPasswordConfirm: trimmedNewPasswordConfirm,
        });
        passwordChanged = true;
      }

      if (hasProfileChanges) {
        const response = await http.put('/api/v1/account/profile', {
          mbrNm: trimmedName,
          mngrMblTelno: normalizedMobile,
        });
        const updatedProfile = normalizeProfile(resolvePayload(response), user);

        setProfile(updatedProfile);
        setFormData((prev) => ({
          ...prev,
          mbrNm: updatedProfile.mbrNm,
          mngrMblTelno: updatedProfile.mngrMblTelno,
        }));
        syncUserProfile({
          mbrNo: updatedProfile.mbrNo,
          lgnId: updatedProfile.lgnId,
          username: updatedProfile.lgnId,
          mbrNm: updatedProfile.mbrNm,
          name: updatedProfile.mbrNm,
          mngrMblTelno: updatedProfile.mngrMblTelno,
          roleId: updatedProfile.roleId,
          roleNm: updatedProfile.roleNm,
          mngrAcntExpryDt: updatedProfile.mngrAcntExpryDt,
        });
        profileChanged = true;
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      }));

      if (profileChanged && passwordChanged) {
        alert('로그인 정보와 비밀번호가 저장되었습니다.');
      } else if (profileChanged) {
        alert('로그인 정보가 저장되었습니다.');
      } else {
        alert('비밀번호가 변경되었습니다.');
      }
    } catch (error) {
      if (passwordChanged) {
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        }));
      }

      if (passwordChanged && !profileChanged) {
        alert(
          resolveErrorMessage(
            error,
            '비밀번호는 변경되었지만 로그인 정보 저장에 실패했습니다.'
          )
        );
      } else {
        alert(
          resolveErrorMessage(
            error,
            '로그인 정보 저장에 실패했습니다. 다시 시도해주세요.'
          )
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="oncontent ontable-form">
        <div className="ontableBox">
          <table>
            <colgroup>
              <col style={{ width: '180px' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>권한그룹</td>
                <td>{displayRole}</td>
              </tr>
              <tr>
                <td>아이디</td>
                <td>{displayLoginId}</td>
              </tr>
              <tr>
                <td>이름</td>
                <td>
                  <MenuInputBox
                    menuType="input"
                    menuSize="100%"
                    value={formData.mbrNm}
                    onChange={handleTextChange('mbrNm')}
                    placeholder="이름을 입력해주세요."
                  />
                </td>
              </tr>
              <tr>
                <td>휴대폰번호</td>
                <td>
                  <MenuInputBox
                    menuType="input"
                    menuSize="100%"
                    value={formData.mngrMblTelno}
                    onChange={handleTextChange('mngrMblTelno')}
                    placeholder="휴대폰번호를 입력해주세요. (숫자만)"
                  />
                </td>
              </tr>
              <tr>
                <td>현재 비밀번호</td>
                <td>
                  <div className="onmenubox fullSize">
                    <input
                      type="password"
                      style={{ width: '100%' }}
                      value={formData.currentPassword}
                      onChange={handleTextChange('currentPassword')}
                      placeholder="현재 비밀번호를 입력해주세요."
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>새 비밀번호</td>
                <td>
                  <div className="onmenubox fullSize">
                    <input
                      type="password"
                      style={{ width: '100%' }}
                      value={formData.newPassword}
                      onChange={handleTextChange('newPassword')}
                      placeholder="새 비밀번호를 입력해주세요."
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>새 비밀번호 확인</td>
                <td>
                  <div className="onmenubox fullSize">
                    <input
                      type="password"
                      style={{ width: '100%' }}
                      value={formData.newPasswordConfirm}
                      onChange={handleTextChange('newPasswordConfirm')}
                      placeholder="새 비밀번호를 다시 입력해주세요."
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>만료일</td>
                <td>{expiryLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="onflexbtns"
        style={{ justifyContent: 'flex-end', marginBottom: isPopup ? 0 : undefined }}
      >
        {onClose && (
          <Button
            btnType="list"
            btnNames="닫기"
            onClick={onClose}
            disabled={saving}
          />
        )}
        <Button
          btnType="add"
          btnNames={saving ? '저장 중...' : loading ? '불러오는 중...' : '저장'}
          onClick={handleSave}
          disabled={loading || saving}
        />
      </div>
    </>
  );
}

LoginInfoForm.propTypes = {
  onClose: PropTypes.func,
  isPopup: PropTypes.bool,
};

LoginInfoForm.defaultProps = {
  onClose: null,
  isPopup: false,
};
