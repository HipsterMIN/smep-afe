import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_ROLE_OPTIONS = [{ value: '', label: '선택' }];

const USE_YN_OPTIONS = [
  { value: 'Y', label: '유효' },
  { value: 'N', label: '폐기' },
  { value: 'S', label: '정지', disabled: true },
];

const APPROVAL_OPTIONS = [
  { value: 'approved', label: '승인', disabled: true },
  { value: 'rejected', label: '미승인', disabled: true },
  { value: 'pending', label: '승인대기', disabled: true },
];

const EXPIRE_OPTIONS = [
  { value: '6m', label: '6개월(2026-06-10)', disabled: true },
  { value: '1y', label: '1년(2026-12-10)', disabled: true },
  { value: '2y', label: '2년(2027-12-10)', disabled: true },
];

const DEFAULT_INTG_SYS_SE_CD = 'PIIO';

const DEFAULT_FORM_DATA = {
  mbrNo: '',
  lgnId: '',
  lgnPswd: '',
  lgnPswdConfirm: '',
  mbrNm: '',
  roleId: '',
  intgSysSeCd: DEFAULT_INTG_SYS_SE_CD,
  useYn: 'Y',
  pswdErrNmtm: 0,
  mdfcnDt: null,
  mdfrId: '',
};

const DEFAULT_LGN_ID_VALIDATION = {
  checkedLgnId: '',
  available: null,
  loading: false,
};

// 관리자 상세/권한 API는 화면 작업 시점마다 래퍼 형태가 조금씩 달랐다.
// 폼 로직은 응답 껍데기보다 실제 필드 값에 집중할 수 있게 공통 평탄화 함수를 둔다.
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

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

function normalizeUseYn(value) {
  return value === 'N' ? 'N' : 'Y';
}

function ManagerForm({ mode }) {
  const { mbrNo } = useParams();
  const navigate = useNavigate();
  const isCreateMode = mode === 'create';
  const isUpdateMode = mode === 'update';

  const [loading, setLoading] = useState(isUpdateMode);
  const [saving, setSaving] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleOptions, setRoleOptions] = useState(DEFAULT_ROLE_OPTIONS);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [lgnIdValidation, setLgnIdValidation] = useState(
    DEFAULT_LGN_ID_VALIDATION
  );

  const pageTitle = '관리자 등록/수정';

  const resetLgnIdValidation = () => {
    if (!isCreateMode) {
      return;
    }

    setLgnIdValidation(DEFAULT_LGN_ID_VALIDATION);
  };

  const applyDetailToForm = (data) => {
    // 수정 화면은 비밀번호를 절대 재노출하지 않고, 상세 응답에서 내려오는 현재 상태 값만 복원한다.
    setFormData({
      mbrNo: data?.mbrNo ?? mbrNo ?? '',
      lgnId: data?.lgnId ?? '',
      lgnPswd: '',
      lgnPswdConfirm: '',
      mbrNm: data?.mbrNm ?? data?.mngMbrNm ?? data?.managerName ?? '',
      roleId: data?.roleId ?? '',
      intgSysSeCd: data?.intgSysSeCd ?? DEFAULT_INTG_SYS_SE_CD,
      useYn: normalizeUseYn(data?.useYn),
      pswdErrNmtm: data?.pswdErrNmtm ?? 0,
      mdfcnDt: data?.mdfcnDt ?? data?.mdfcnDtm ?? data?.modifyDt ?? null,
      mdfrId: data?.mdfrId ?? data?.mdfrNm ?? data?.modifierName ?? '',
    });
  };

  const fetchRoleOptions = async () => {
    try {
      setRoleLoading(true);
      // 관리자 폼의 권한 선택은 "현재 사용 가능한 PIIO/MNG 권한"만 보여야 하므로 조회 범위를 명시적으로 고정한다.
      const response = await http.get('/api/v1/roles', {
        params: {
          intgSysSeCd: DEFAULT_INTG_SYS_SE_CD,
          mbrTypeCd: 'MNG',
          useYn: 'Y',
        },
      });
      const data = resolvePayload(response);
      const sourceList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      const normalizedOptions = sourceList
        .map((item) => ({
          value: item?.roleId ?? '',
          label: item?.roleNm ?? '',
        }))
        .filter((item) => item.value && item.label);

      setRoleOptions([...DEFAULT_ROLE_OPTIONS, ...normalizedOptions]);
    } catch (error) {
      console.error('[ManagerForm] 권한그룹 목록 조회 실패', error);
      setRoleOptions(DEFAULT_ROLE_OPTIONS);
    } finally {
      setRoleLoading(false);
    }
  };

  const fetchManagerDetail = async () => {
    if (!mbrNo) {
      alert('수정 대상 관리자 번호가 없습니다.');
      navigate('..');
      return;
    }

    try {
      setLoading(true);
      const response = await http.get(`/api/v1/managers/${mbrNo}`);
      const data = resolvePayload(response);
      applyDetailToForm(data);
    } catch (error) {
      console.error('[ManagerForm] 관리자 상세 조회 실패', error);
      alert('관리자 정보를 불러오는데 실패했습니다.');
      navigate('..');
    } finally {
      setLoading(false);
    }
  };

  const validateLgnIdAvailability = async (lgnId, { silent = false } = {}) => {
    const trimmedLgnId = lgnId.trim();

    if (!trimmedLgnId) {
      if (!silent) {
        alert('아이디를 입력해주세요.');
      }
      return null;
    }

    setLgnIdValidation((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const response = await http.get(
        `/api/v1/managers/validate/${encodeURIComponent(trimmedLgnId)}`
      );
      const data = resolvePayload(response);
      const available =
        typeof data?.available === 'boolean'
          ? data.available
          : typeof data?.duplicated === 'boolean'
            ? !data.duplicated
            : null;

      if (available === null) {
        throw new Error('아이디 중복 확인 응답 형식이 올바르지 않습니다.');
      }

      // create 화면은 "마지막으로 확인한 아이디"와 입력값이 같을 때만 중복확인 결과를 신뢰한다.
      setLgnIdValidation({
        checkedLgnId: trimmedLgnId,
        available,
        loading: false,
      });

      if (!silent) {
        alert(
          available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'
        );
      }

      return available;
    } catch (error) {
      console.error('[ManagerForm] 아이디 중복 확인 실패', error);
      setLgnIdValidation((prev) => ({
        ...prev,
        loading: false,
      }));

      if (!silent) {
        alert('아이디 중복 확인에 실패했습니다.');
      }

      return null;
    }
  };

  useEffect(() => {
    fetchRoleOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isUpdateMode) {
      setLoading(false);
      return;
    }

    // update 모드는 route param이 바뀔 수 있으므로 mbrNo 기준으로 상세를 다시 읽는다.
    fetchManagerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateMode, mbrNo]);

  const handleTextChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'lgnId') {
      resetLgnIdValidation();
    }
  };

  const handleUseYnChange = (value) => {
    if (value === 'S') {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      useYn: value,
    }));
  };

  const handleGoList = () => {
    navigate('..');
  };

  const ensureCreateLgnIdAvailability = async () => {
    const trimmedLgnId = formData.lgnId.trim();

    if (lgnIdValidation.checkedLgnId !== trimmedLgnId) {
      return validateLgnIdAvailability(trimmedLgnId, { silent: true });
    }

    if (lgnIdValidation.available === null) {
      return validateLgnIdAvailability(trimmedLgnId, { silent: true });
    }

    return lgnIdValidation.available;
  };

  const handleSave = async () => {
    const trimmedLgnId = formData.lgnId.trim();
    const trimmedLgnPswd = formData.lgnPswd.trim();
    const trimmedLgnPswdConfirm = formData.lgnPswdConfirm.trim();
    const trimmedMbrNm = formData.mbrNm.trim();
    const trimmedRoleId = formData.roleId.trim();

    if (isCreateMode && !trimmedLgnId) {
      alert('아이디를 입력해주세요.');
      return;
    }

    if (!trimmedMbrNm) {
      alert('관리자명을 입력해주세요.');
      return;
    }

    if (isCreateMode && !trimmedLgnPswd) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (trimmedLgnPswd || trimmedLgnPswdConfirm) {
      if (!trimmedLgnPswd) {
        alert('비밀번호를 입력해주세요.');
        return;
      }

      if (!trimmedLgnPswdConfirm) {
        alert('비밀번호 확인을 입력해주세요.');
        return;
      }

      if (trimmedLgnPswd !== trimmedLgnPswdConfirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
    }

    if (isCreateMode) {
      const available = await ensureCreateLgnIdAvailability();
      if (available === null) {
        return;
      }

      if (!available) {
        alert('이미 사용 중인 아이디입니다.');
        return;
      }
    }

    const requestData = {
      mbrNm: trimmedMbrNm,
      roleId: trimmedRoleId || null,
      intgSysSeCd: formData.intgSysSeCd || DEFAULT_INTG_SYS_SE_CD,
      useYn: formData.useYn,
    };

    if (isCreateMode) {
      requestData.lgnId = trimmedLgnId;
      requestData.lgnPswd = trimmedLgnPswd;
    } else {
      requestData.mbrNo = formData.mbrNo || mbrNo || '';

      if (trimmedLgnPswd) {
        requestData.lgnPswd = trimmedLgnPswd;
      }
    }

    try {
      setSaving(true);

      if (isCreateMode) {
        await http.post('/api/v1/managers', requestData);
        alert('관리자가 등록되었습니다.');
      } else {
        await http.put(`/api/v1/managers/${encodeURIComponent(mbrNo)}`, requestData);
        alert('관리자가 수정되었습니다.');
      }

      navigate('..');
    } catch (error) {
      console.error('[ManagerForm] 관리자 저장 실패', error);
      alert('관리자 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const passwordErrorCountLabel = `${formData.pswdErrNmtm ?? 0}회`;

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>

      <div className="oncontents">
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
                  <td>
                    <MenuInputBox
                      menuType="select"
                      inputId="manager-role-id"
                      menuSize="150px"
                      options={roleOptions}
                      showAllOption={false}
                      value={formData.roleId}
                      onChange={handleTextChange('roleId')}
                      disabled={roleLoading}
                    />
                  </td>
                </tr>
                <tr>
                  <td>아이디</td>
                  <td>
                    <div className="onflexrow">
                      <MenuInputBox
                        menuType="input"
                        menuSize="100%"
                        value={formData.lgnId}
                        onChange={handleTextChange('lgnId')}
                        disabled={isUpdateMode}
                        placeholder={
                          isCreateMode
                            ? '아이디를 입력해주세요.'
                            : '아이디는 수정할 수 없습니다.'
                        }
                      />
                      <Button
                        btnType="edit"
                        btnNames={
                          lgnIdValidation.loading ? '확인 중...' : '중복확인'
                        }
                        onClick={() =>
                          validateLgnIdAvailability(formData.lgnId)
                        }
                        disabled={
                          isUpdateMode ||
                          lgnIdValidation.loading ||
                          !formData.lgnId.trim()
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.mbrNm}
                      onChange={handleTextChange('mbrNm')}
                      placeholder="관리자명을 입력해주세요."
                    />
                  </td>
                </tr>
                <tr>
                  <td>비밀번호</td>
                  <td>
                    <div className="onmenubox fullSize">
                      <input
                        type="password"
                        style={{ width: '100%' }}
                        value={formData.lgnPswd}
                        onChange={handleTextChange('lgnPswd')}
                        placeholder={
                          isCreateMode
                            ? '초기 비밀번호를 입력해주세요.'
                            : '변경 시에만 입력해주세요.'
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>비밀번호 확인</td>
                  <td>
                    <div className="onmenubox fullSize">
                      <input
                        type="password"
                        style={{ width: '100%' }}
                        value={formData.lgnPswdConfirm}
                        onChange={handleTextChange('lgnPswdConfirm')}
                        placeholder={
                          isCreateMode
                            ? '비밀번호를 다시 입력해주세요.'
                            : '변경 시에만 다시 입력해주세요.'
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>비밀번호 틀린 횟수</td>
                  <td>
                    <div className="onflexrow">
                      <span>{passwordErrorCountLabel}</span>
                      <Button btnType="reset" btnNames="초기화" disabled />
                      <p>
                        ※ 초기화 버튼 클릭 또는 비밀번호 변경 시 비밀번호
                        틀린횟수가 초기화됩니다.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value="-"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>휴대폰번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value="-"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>승인여부</td>
                  <td>
                    <div className="onradioBox">
                      {APPROVAL_OPTIONS.map((option) => (
                        <RadioButton
                          key={option.value}
                          groupId={`manager-approval-${option.value}`}
                          radioGroup="managerApproval"
                          radioValue={option.value}
                          radioName={option.label}
                          selectedValue=""
                          onChange={() => {}}
                          disabled={option.disabled}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>사용여부</td>
                  <td>
                    <div className="onradioBox">
                      {USE_YN_OPTIONS.map((option) => (
                        <RadioButton
                          key={option.value}
                          groupId={`manager-use-yn-${option.value.toLowerCase()}`}
                          radioGroup="managerUseYn"
                          radioValue={option.value}
                          radioName={option.label}
                          selectedValue={formData.useYn}
                          onChange={handleUseYnChange}
                          disabled={option.disabled}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>만료일</td>
                  <td>
                    <div className="onradioBox">
                      {EXPIRE_OPTIONS.map((option) => (
                        <RadioButton
                          key={option.value}
                          groupId={`manager-expire-${option.value}`}
                          radioGroup="managerExpire"
                          radioValue={option.value}
                          radioName={option.label}
                          selectedValue=""
                          onChange={() => {}}
                          disabled={option.disabled}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>특이사항</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value="-"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>처리사유</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value="-"
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>최종수정일</td>
                  <td>{formatTimestamp(formData.mdfcnDt)}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>{formData.mdfrId || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleGoList} />
          </div>
          <Button
            btnType="del"
            btnNames="삭제"
            disabled
          />
          <Button
            btnType="add"
            btnNames="저장"
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
}

ManagerForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default ManagerForm;
