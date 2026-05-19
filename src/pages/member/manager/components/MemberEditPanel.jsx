import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import MemberItrstFldPopup from './MemberItrstFldPopup.jsx';

const DEFAULT_FORM = {
  mbrNo: '',
  lgnId: '',
  mbrNm: '',
  mbrTypeCd: '',
  mbrSttsCd: '',
  scrtyPlcyCd: '',
  smntUseYn: 'Y',
  useYn: 'Y',
  indvMblTelno: '',
  indvGnrlTelno: '',
  indvEmlAddr: '',
  brdt: '',
  zip: '',
  mbrAddr: '',
  mbrDaddr: '',
  bzmnTypeCd: '',
  brno: '',
  crno: '',
  rprsvNm: '',
  rprsvBrdt: '',
  ksicCd: '',
  rprsTelno: '',
  rprsFxno: '',
  emlAddr: '',
  hmpgAddr: '',
  entAddr: '',
  entDaddr: '',
  entSclCd: '',
  fndnYmd: '',
  wrkrCntClsfCd: '',
  slsAmtClsfCd: '',
  mainBizFldNm: '',
  entExpln: '',
  etcExpln: '',
  itrstFldCn: '',
  regDt: null,
  mdfcnDt: null,
};

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

    return response.data ?? response;
  }

  return response ?? {};
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function toPayloadValue(value) {
  const normalized = normalizeText(value).trim();
  return normalized === '' ? null : normalized;
}

function buildInitialForm(member) {
  return {
    ...DEFAULT_FORM,
    ...Object.fromEntries(
      Object.keys(DEFAULT_FORM).map((key) => [
        key,
        normalizeText(member?.[key]),
      ])
    ),
    regDt: member?.regDt ?? null,
    mdfcnDt: member?.mdfcnDt ?? null,
    smntUseYn: member?.smntUseYn === 'N' ? 'N' : 'Y',
    useYn: member?.useYn === 'N' ? 'N' : 'Y',
  };
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';
}

export default function MemberEditPanel({
  member,
  statusOptions = [],
  panelStyle,
  saving,
  onCancel,
  onSaved,
  onSavingChange,
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [interestPopupOpen, setInterestPopupOpen] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm(member));
    setInterestPopupOpen(false);
  }, [member]);

  if (!member) {
    return (
      <div className="oncontent ontable-form" style={panelStyle}>
        <h4>회원정보 등록/수정</h4>
        <p>수정할 회원을 먼저 선택해주세요.</p>
      </div>
    );
  }

  const isEnterprise = formData.mbrTypeCd === 'ENT';
  const isPersonal = formData.mbrTypeCd === 'IND';
  const title = isEnterprise
    ? '회원정보 등록/수정(기업)'
    : '회원정보 등록/수정(개인)';

  function handleTextChange(field) {
    return (event) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };
  }

  function handleRadioChange(field) {
    return (value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  function buildCommonPayload() {
    return {
      mbrNo: formData.mbrNo,
      mbrNm: toPayloadValue(formData.mbrNm),
      mbrTypeCd: formData.mbrTypeCd,
      mbrSttsCd: toPayloadValue(formData.mbrSttsCd),
      scrtyPlcyCd: toPayloadValue(formData.scrtyPlcyCd),
      smntUseYn: formData.smntUseYn === 'N' ? 'N' : 'Y',
      useYn: formData.useYn === 'N' ? 'N' : 'Y',
    };
  }

  function buildPersonalPayload() {
    return {
      ...buildCommonPayload(),
      indvMblTelno: toPayloadValue(formData.indvMblTelno),
      indvGnrlTelno: toPayloadValue(formData.indvGnrlTelno),
      indvEmlAddr: toPayloadValue(formData.indvEmlAddr),
      brdt: toPayloadValue(formData.brdt),
      zip: toPayloadValue(formData.zip),
      mbrAddr: toPayloadValue(formData.mbrAddr),
      mbrDaddr: toPayloadValue(formData.mbrDaddr),
    };
  }

  function buildEnterprisePayload() {
    // 수정 폼에 노출하지 않는 기업 필드도 기존 상세값을 함께 보내야 부분 저장 중 값 손실을 피할 수 있다.
    return {
      ...buildCommonPayload(),
      bzmnTypeCd: toPayloadValue(formData.bzmnTypeCd),
      brno: toPayloadValue(formData.brno),
      crno: toPayloadValue(formData.crno),
      rprsvNm: toPayloadValue(formData.rprsvNm),
      rprsvBrdt: toPayloadValue(formData.rprsvBrdt),
      ksicCd: toPayloadValue(formData.ksicCd),
      zip: toPayloadValue(formData.zip),
      rprsTelno: toPayloadValue(formData.rprsTelno),
      rprsFxno: toPayloadValue(formData.rprsFxno),
      emlAddr: toPayloadValue(formData.emlAddr),
      hmpgAddr: toPayloadValue(formData.hmpgAddr),
      entAddr: toPayloadValue(formData.entAddr),
      entDaddr: toPayloadValue(formData.entDaddr),
      entSclCd: toPayloadValue(formData.entSclCd),
      fndnYmd: toPayloadValue(formData.fndnYmd),
      wrkrCntClsfCd: toPayloadValue(formData.wrkrCntClsfCd),
      slsAmtClsfCd: toPayloadValue(formData.slsAmtClsfCd),
      mainBizFldNm: toPayloadValue(formData.mainBizFldNm),
      entExpln: toPayloadValue(formData.entExpln),
      etcExpln: toPayloadValue(formData.etcExpln),
      itrstFldCn: toPayloadValue(formData.itrstFldCn),
    };
  }

  async function handleSave() {
    if (!isPersonal && !isEnterprise) {
      alert('개인/기업 회원만 수정할 수 있습니다.');
      return;
    }

    if (!toPayloadValue(formData.mbrNm)) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (isPersonal && !toPayloadValue(formData.indvEmlAddr)) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (isEnterprise && !toPayloadValue(formData.bzmnTypeCd)) {
      alert('사업자유형코드가 없어 저장할 수 없습니다.');
      return;
    }

    const endpointType = isEnterprise ? 'ent' : 'ind';
    const payload = isEnterprise
      ? buildEnterprisePayload()
      : buildPersonalPayload();

    try {
      onSavingChange(true);
      const response = await http.post(
        `/api/v1/member/update/${encodeURIComponent(formData.mbrNo)}/${endpointType}`,
        payload
      );
      const updatedMember = resolvePayload(response);
      alert('회원 정보가 수정되었습니다.');
      onSaved(updatedMember);
    } catch (error) {
      console.error('[MemberEditPanel] 회원 수정 실패', error);
      alert('회원 정보 수정에 실패했습니다.');
    } finally {
      onSavingChange(false);
    }
  }

  const statusSelectOptions = statusOptions.length > 0 ? statusOptions : [];

  return (
    <>
      <div className="oncontent ontable-form" style={panelStyle}>
      <h4>{title}</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>아이디</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={formData.lgnId}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>상태</td>
              <td>
                <MenuInputBox
                  menuType="select"
                  menuSize="100px"
                  options={statusSelectOptions}
                  showAllOption={false}
                  value={formData.mbrSttsCd}
                  onChange={handleTextChange('mbrSttsCd')}
                />
              </td>
            </tr>
            <tr>
              <td>이름</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={formData.mbrNm}
                  onChange={handleTextChange('mbrNm')}
                />
              </td>
            </tr>

            {isPersonal ? (
              <>
                <tr>
                  <td>전화번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.indvMblTelno}
                      onChange={handleTextChange('indvMblTelno')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>유선번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.indvGnrlTelno}
                      onChange={handleTextChange('indvGnrlTelno')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.indvEmlAddr}
                      onChange={handleTextChange('indvEmlAddr')}
                    />
                  </td>
                </tr>
              </>
            ) : null}

            {isEnterprise ? (
              <>
                <tr>
                  <td>법인 등록번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.crno}
                      onChange={handleTextChange('crno')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>대표 전화번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.rprsTelno}
                      onChange={handleTextChange('rprsTelno')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>대표 팩스번호</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.rprsFxno}
                      onChange={handleTextChange('rprsFxno')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>대표 이메일 주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.emlAddr}
                      onChange={handleTextChange('emlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>홈페이지 주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.hmpgAddr}
                      onChange={handleTextChange('hmpgAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업 기본주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.entAddr}
                      onChange={handleTextChange('entAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업 상세주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.entDaddr}
                      onChange={handleTextChange('entDaddr')}
                    />
                  </td>
                </tr>
              </>
            ) : null}

            <tr>
              <td>최종 수정일시</td>
              <td>{formatTimestamp(formData.mdfcnDt)}</td>
            </tr>
            <tr>
              <td>생성일시</td>
              <td>{formatTimestamp(formData.regDt)}</td>
            </tr>
            <tr>
              <td>최종 로그인 일시</td>
              <td>-</td>
            </tr>
            <tr>
              <td>스마트 알림 사용 여부</td>
              <td>
                <div className="onflexrow">
                  <div className="onradioBox">
                    <RadioButton
                      groupId="member-smart-alert-use"
                      radioGroup="memberSmartAlert"
                      radioValue="Y"
                      radioName="사용"
                      selectedValue={formData.smntUseYn}
                      onChange={handleRadioChange('smntUseYn')}
                    />
                    <RadioButton
                      groupId="member-smart-alert-not-use"
                      radioGroup="memberSmartAlert"
                      radioValue="N"
                      radioName="사용안함"
                      selectedValue={formData.smntUseYn}
                      onChange={handleRadioChange('smntUseYn')}
                    />
                  </div>
                  <Button
                    btnType="search"
                    btnNames="관심분야설정"
                    onClick={() => setInterestPopupOpen(true)}
                    disabled={saving || !formData.lgnId}
                  />
                </div>
              </td>
            </tr>
            {isEnterprise ? (
              <tr>
                <td>증명(확인서) 신청 권한</td>
                <td>-</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

        <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
          <Button
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
            disabled={saving}
          />
          <Button
            btnType="del"
            btnNames="취소"
            onClick={onCancel}
            disabled={saving}
          />
        </div>
      </div>
      {interestPopupOpen ? (
        <MemberItrstFldPopup
          member={formData}
          onClose={() => setInterestPopupOpen(false)}
        />
      ) : null}
    </>
  );
}

MemberEditPanel.propTypes = {
  member: PropTypes.object,
  statusOptions: PropTypes.array,
  panelStyle: PropTypes.object,
  saving: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  onSavingChange: PropTypes.func.isRequired,
};
