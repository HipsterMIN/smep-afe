import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BIZ_FLFMT_INST_OPTIONS = [
  { value: 'B554009', label: '중소벤처기업진흥공단' },
  { value: 'B553694', label: '기술보증기금' },
  { value: 'B190030', label: '한국산업은행' },
  { value: 'B190021', label: '중소기업은행' },
  { value: 'B190031', label: '한국수출입은행' },
  { value: 'B190016', label: '신용보증기금' },
  { value: 'B553077', label: '소상공인시장진흥공단' },
  { value: 'B552696', label: '한국무역보험공사' },
];

const POLICY_FINANCE_CODE_GROUPS = [
  'PLCY_FNNC_GDS_STTS_CD',
  'PLCY_FNNC_RCPT_STTS_CD',
  'PLCY_FNNC_APLY_MTH_CD',
  'PLCY_FNNC_ENT_SCL_CD',
  'PLCY_FNNC_DTL_CND_CD',
  'PLCY_FNNC_GDS_KND_CD',
  'PLCY_FNNC_USE_USG_SE_CD',
];

const DEFAULT_FORM_DATA = {
  plcyFnncGdsSttsCd: '',
  plcyFnncRcptSttsCd: '',
  bizFlfmtInstCd: '',
  plcyFnncNm: '',
  plcyFnncGdsPrps: '',
  plcyFnncSprtTrgtCn: '',
  grntePlcyFnncPrtrtCndCn: '',
  plcyFnncSprtLimCn: '',
  plcyFnncGrnteRtCn: '',
  plcyFnncGrfeCn: '',
  loanPlcyFnncUseUsgCn: '',
  plcyFnncSprtExclTrgtCn: '',
  cmptncRgnNm: '',
  inqplCn: '',
  aplyBgngYmd: '',
  aplyDdlnYmd: '',
  plcyFnncDtlUrlAddr: '',
  plcyFnncInqplUrlAddr: '',
  plcyFnncAplyUrlAddr: '',
  plcyFnncAtchFileUrlAddr: '',
  plcyFnncEntSclCd: '',
  tpbizLclsfCd: '',
  ksicCd: '',
  plcyFnncDtlCndCd: '',
  plcyFnncGdsKndCd: '',
  plcyFnncEntSclSmryCn: '',
  plcyFnncCmpnRtCn: '',
  plcyFnncCmpnRtSmryCn: '',
  plcyFnncHstgCn: '',
  useYn: 'Y',
  rgtrId: '',
  regDt: null,
  mdfrId: '',
  mdfcnDt: null,
};

const toMenuOptions = (codeList = []) =>
  codeList.map((item) => ({
    value: item.comCd,
    label: item.comCdNm,
  }));

const splitCommaCodes = (raw) =>
  raw
    ? String(raw)
        .split(',')
        .map((code) => code.trim())
        .filter(Boolean)
    : [];

const parseHashtagTags = (raw) => {
  if (raw === null || raw === undefined) return [];
  const normalized = String(raw).trim();
  if (!normalized) return [];

  try {
    const parsed = typeof raw === 'string' ? JSON.parse(normalized) : raw;
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => String(tag).trim()).filter(Boolean);
    }
    if (Array.isArray(parsed?.hstgnm)) {
      return parsed.hstgnm.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch {
    // keep csv fallback
  }

  return normalized
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const toHashtagInputValue = (raw) => parseHashtagTags(raw).join(',');

const toHashtagPayloadValue = (raw) => parseHashtagTags(raw).join(',');

const toNullableValue = (raw) => {
  const normalized = String(raw ?? '').trim();
  return normalized === '' ? null : normalized;
};

const withSelectPlaceholder = (options) => [
  { value: '', label: '선택' },
  ...(options || []),
];

const hasAnyValue = (...values) =>
  values.some((value) => String(value || '').trim() !== '');

const EDITABLE_PAYLOAD_KEYS = new Set([
  'plcyFnncGdsSttsCd',
  'plcyFnncRcptSttsCd',
  'bizFlfmtInstCd',
  'plcyFnncNm',
  'plcyFnncGdsPrps',
  'plcyFnncSprtTrgtCn',
  'grntePlcyFnncPrtrtCndCn',
  'plcyFnncSprtLimCn',
  'plcyFnncGrnteRtCn',
  'plcyFnncGrfeCn',
  'loanPlcyFnncUseUsgCn',
  'plcyFnncSprtExclTrgtCn',
  'cmptncRgnNm',
  'inqplCn',
  'aplyBgngYmd',
  'aplyDdlnYmd',
  'plcyFnncDtlUrlAddr',
  'plcyFnncInqplUrlAddr',
  'plcyFnncAplyUrlAddr',
  'plcyFnncAtchFileUrlAddr',
  'plcyFnncHstgCn',
  'plcyFnncEntSclCd',
  'tpbizLclsfCd',
  'ksicCd',
  'plcyFnncDtlCndCd',
  'plcyFnncGdsKndCd',
  'plcyFnncEntSclSmryCn',
  'plcyFnncCmpnRtCn',
  'plcyFnncCmpnRtSmryCn',
  'plcyFnncAplyMthCd',
  'loanPlcyFnncUseUsgSeCd',
]);

export default function PolicyFinanceForm({ mode }) {
  const navigate = useNavigate();
  const { policyNo } = useParams();
  const isUpdateMode = mode === 'update';

  const [loading, setLoading] = useState(isUpdateMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [originalDetail, setOriginalDetail] = useState(null);
  const [selectedAplyMthCodes, setSelectedAplyMthCodes] = useState([]);
  const [selectedLoanUseUsgCodes, setSelectedLoanUseUsgCodes] = useState([]);

  const [plcyFnncGdsSttsOptions, setPlcyFnncGdsSttsOptions] = useState([]);
  const [plcyFnncRcptSttsOptions, setPlcyFnncRcptSttsOptions] = useState([]);
  const [plcyFnncAplyMthOptions, setPlcyFnncAplyMthOptions] = useState([]);
  const [plcyFnncEntSclOptions, setPlcyFnncEntSclOptions] = useState([]);
  const [plcyFnncDtlCndOptions, setPlcyFnncDtlCndOptions] = useState([]);
  const [plcyFnncGdsKndOptions, setPlcyFnncGdsKndOptions] = useState([]);
  const [plcyFnncUseUsgSeOptions, setPlcyFnncUseUsgSeOptions] = useState([]);

  const gdsSttsRadioOptions = useMemo(
    () =>
      (plcyFnncGdsSttsOptions || []).filter(
        (option) => !String(option.label || '').includes('마감')
      ),
    [plcyFnncGdsSttsOptions]
  );
  const rcptSttsSelectOptions = useMemo(
    () => withSelectPlaceholder(plcyFnncRcptSttsOptions),
    [plcyFnncRcptSttsOptions]
  );
  const entSclSelectOptions = useMemo(
    () => withSelectPlaceholder(plcyFnncEntSclOptions),
    [plcyFnncEntSclOptions]
  );
  const dtlCndSelectOptions = useMemo(
    () => withSelectPlaceholder(plcyFnncDtlCndOptions),
    [plcyFnncDtlCndOptions]
  );
  const gdsKndSelectOptions = useMemo(
    () => withSelectPlaceholder(plcyFnncGdsKndOptions),
    [plcyFnncGdsKndOptions]
  );

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleValueChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || '',
    }));
  };

  const handleToggleMultiCode =
    (setter) =>
    ({ value, checked }) => {
      setter((prev) => {
        if (checked) return Array.from(new Set([...prev, value]));
        return prev.filter((code) => code !== value);
      });
    };

  const validateForm = () => {
    if (isUpdateMode && !policyNo) {
      alert('수정 대상 정책금융번호가 없습니다.');
      return false;
    }
    if (!formData.plcyFnncGdsSttsCd) {
      alert('승인여부를 선택해주세요.');
      return false;
    }
    if (!formData.plcyFnncNm.trim()) {
      alert('상품명을 입력해주세요.');
      return false;
    }
    if (
      formData.aplyBgngYmd &&
      formData.aplyDdlnYmd &&
      formData.aplyBgngYmd > formData.aplyDdlnYmd
    ) {
      alert('신청 시작일은 신청 마감일보다 늦을 수 없습니다.');
      return false;
    }

    const hasGuaranteeDetail = hasAnyValue(
      formData.grntePlcyFnncPrtrtCndCn,
      formData.plcyFnncGrnteRtCn,
      formData.plcyFnncGrfeCn
    );
    if (hasGuaranteeDetail && !formData.plcyFnncGdsKndCd) {
      alert('보증 관련 정보를 입력한 경우 상품종류를 선택해주세요.');
      return false;
    }
    return true;
  };

  const buildRequestPayload = () => {
    const nullableJoin = (codes) => toNullableValue((codes || []).join(','));

    // 기존 전체 컬럼 payload를 유지한다. (create 시 기본값 세팅 용도)
    const payload = {
      plcyFnncNo: isUpdateMode ? Number(policyNo) : null,
      plcyFnncNm: formData.plcyFnncNm.trim(),
      plcyFnncGdsCd: null,
      plcyFnncGdsTypeCd: null,
      plcyFnncGdsSttsCd: formData.plcyFnncGdsSttsCd,
      plcyFnncNtslSttsCd: null,
      plcyFnncDtlCndCd: toNullableValue(formData.plcyFnncDtlCndCd),
      plcyFnncEntSclCd: toNullableValue(formData.plcyFnncEntSclCd),
      plcyFnncRcptSttsCd: toNullableValue(formData.plcyFnncRcptSttsCd),
      bizFlfmtInstCd: toNullableValue(formData.bizFlfmtInstCd),
      bizFlfmtInstAbbrNm: null,
      plcyFnncGdsPrps: toNullableValue(formData.plcyFnncGdsPrps),
      plcyFnncSprtTrgtCn: toNullableValue(formData.plcyFnncSprtTrgtCn),
      plcyFnncSprtLimCn: toNullableValue(formData.plcyFnncSprtLimCn),
      plcyFnncSprtExclTrgtCn: toNullableValue(formData.plcyFnncSprtExclTrgtCn),
      cmptncRgnNm: toNullableValue(formData.cmptncRgnNm),
      inqplCn: toNullableValue(formData.inqplCn),
      aplyBgngYmd: toNullableValue(formData.aplyBgngYmd),
      aplyDdlnYmd: toNullableValue(formData.aplyDdlnYmd),
      aplyPrdCn: '',
      inqCnt: null,
      plcyFnncEntSclSmryCn: toNullableValue(formData.plcyFnncEntSclSmryCn),
      tpbizLclsfCd: toNullableValue(formData.tpbizLclsfCd),
      ksicCd: toNullableValue(formData.ksicCd),
      plcyFnncDtlUrlAddr: toNullableValue(formData.plcyFnncDtlUrlAddr),
      plcyFnncInqplUrlAddr: toNullableValue(formData.plcyFnncInqplUrlAddr),
      plcyFnncAplyUrlAddr: toNullableValue(formData.plcyFnncAplyUrlAddr),
      plcyFnncAtchFileUrlAddr: toNullableValue(formData.plcyFnncAtchFileUrlAddr),
      plcyFnncFrstRegDt: null,
      useYn: formData.useYn || 'Y',
      loanAplySttsCn: null,
      loanPlcyFnncUseUsgCn: toNullableValue(formData.loanPlcyFnncUseUsgCn),
      loanCrtrSlsCn: null,
      loanCrtrCrnclCn: null,
      loanMthdCn: null,
      crtrIrtCn: null,
      loanIrtCn: null,
      loanPrdCn: null,
      rcmdtnInstCd: null,
      grntePlcyFnncPrtrtCndCn: toNullableValue(formData.grntePlcyFnncPrtrtCndCn),
      plcyFnncGrnteRtCn: toNullableValue(formData.plcyFnncGrnteRtCn),
      plcyFnncGrfeCn: toNullableValue(formData.plcyFnncGrfeCn),
      plcyFnncGdsKndCd: toNullableValue(formData.plcyFnncGdsKndCd),
      grntePlcyFnncUseUsgCn: null,
      giveIspmCn: null,
      ispmCn: null,
      thmTpbizNm: null,
      insrncPlcyFnncPrtrtCndCn: null,
      giveIspmSmryCn: null,
      plcyFnncIspmPrtrtCndCn: null,
      plcyFnncCmpnRtCn: toNullableValue(formData.plcyFnncCmpnRtCn),
      plcyFnncCmpnRtSmryCn: toNullableValue(formData.plcyFnncCmpnRtSmryCn),
      plcyFnncHstgCn: toNullableValue(toHashtagPayloadValue(formData.plcyFnncHstgCn)),
      insrncScrtVldPrdCn: null,
      plcyFnncAplyMthCd: nullableJoin(selectedAplyMthCodes),
      loanPlcyFnncUseUsgSeCd: nullableJoin(selectedLoanUseUsgCodes),
      plcyFnncRpmtMthdCd: null,
      grntePlcyFnncUseUsgSeCd: null,
    };

    if (!isUpdateMode || !originalDetail) {
      return payload;
    }

    // 수정 시 화면에서 수정하지 않는 컬럼은 상세 원본값 유지
    const mergedPayload = { ...payload };
    Object.keys(mergedPayload).forEach((key) => {
      if (EDITABLE_PAYLOAD_KEYS.has(key)) return;
      if (Object.prototype.hasOwnProperty.call(originalDetail, key)) {
        mergedPayload[key] = originalDetail[key];
      }
    });

    return mergedPayload;
  };

  const fetchPolicyFinanceCodes = async () => {
    try {
      const response = await fetchCommonCodes(POLICY_FINANCE_CODE_GROUPS);
      const findCodeList = (groupId) =>
        response?.[groupId] ||
        response?.[groupId.toUpperCase()] ||
        response?.[groupId.toLowerCase()] ||
        [];

      setPlcyFnncGdsSttsOptions(
        toMenuOptions(findCodeList('plcy_fnnc_gds_stts_cd'))
      );
      setPlcyFnncRcptSttsOptions(
        toMenuOptions(findCodeList('plcy_fnnc_rcpt_stts_cd'))
      );
      setPlcyFnncAplyMthOptions(
        toMenuOptions(findCodeList('plcy_fnnc_aply_mth_cd'))
      );
      setPlcyFnncEntSclOptions(
        toMenuOptions(findCodeList('plcy_fnnc_ent_scl_cd'))
      );
      setPlcyFnncDtlCndOptions(
        toMenuOptions(findCodeList('plcy_fnnc_dtl_cnd_cd'))
      );
      setPlcyFnncGdsKndOptions(
        toMenuOptions(findCodeList('plcy_fnnc_gds_knd_cd'))
      );
      setPlcyFnncUseUsgSeOptions(
        toMenuOptions(findCodeList('plcy_fnnc_use_usg_se_cd'))
      );
    } catch (error) {
      console.error('정책금융 공통코드 조회 실패:', error);
    }
  };

  const fetchPolicyFinanceDetail = async () => {
    if (!isUpdateMode || !policyNo) return;

    setLoading(true);
    try {
      const response = await http.get(`/api/v1/policy-finance/${policyNo}`);
      const data = response?.data ?? response ?? null;
      if (!data) {
        alert('조회된 정책금융이 없습니다.');
        navigate('../..');
        return;
      }
      setOriginalDetail(data);

      setFormData((prev) => ({
        ...prev,
        plcyFnncGdsSttsCd: data.plcyFnncGdsSttsCd || '',
        plcyFnncRcptSttsCd: data.plcyFnncRcptSttsCd || '',
        bizFlfmtInstCd: data.bizFlfmtInstCd || '',
        plcyFnncNm: data.plcyFnncNm || '',
        plcyFnncGdsPrps: data.plcyFnncGdsPrps || '',
        plcyFnncSprtTrgtCn: data.plcyFnncSprtTrgtCn || '',
        grntePlcyFnncPrtrtCndCn: data.grntePlcyFnncPrtrtCndCn || '',
        plcyFnncSprtLimCn: data.plcyFnncSprtLimCn || '',
        plcyFnncGrnteRtCn: data.plcyFnncGrnteRtCn || '',
        plcyFnncGrfeCn: data.plcyFnncGrfeCn || '',
        loanPlcyFnncUseUsgCn: data.loanPlcyFnncUseUsgCn || '',
        plcyFnncSprtExclTrgtCn: data.plcyFnncSprtExclTrgtCn || '',
        cmptncRgnNm: data.cmptncRgnNm || '',
        inqplCn: data.inqplCn || '',
        aplyBgngYmd: data.aplyBgngYmd || '',
        aplyDdlnYmd: data.aplyDdlnYmd || '',
        plcyFnncDtlUrlAddr: data.plcyFnncDtlUrlAddr || '',
        plcyFnncInqplUrlAddr: data.plcyFnncInqplUrlAddr || '',
        plcyFnncAplyUrlAddr: data.plcyFnncAplyUrlAddr || '',
        plcyFnncAtchFileUrlAddr: data.plcyFnncAtchFileUrlAddr || '',
        plcyFnncEntSclCd: data.plcyFnncEntSclCd || '',
        tpbizLclsfCd: data.tpbizLclsfCd || '',
        ksicCd: data.ksicCd || '',
        plcyFnncDtlCndCd: data.plcyFnncDtlCndCd || '',
        plcyFnncGdsKndCd: data.plcyFnncGdsKndCd || '',
        plcyFnncEntSclSmryCn: data.plcyFnncEntSclSmryCn || '',
        plcyFnncCmpnRtCn: data.plcyFnncCmpnRtCn || '',
        plcyFnncCmpnRtSmryCn: data.plcyFnncCmpnRtSmryCn || '',
        plcyFnncHstgCn: toHashtagInputValue(data.plcyFnncHstgCn),
        useYn: data.useYn || 'Y',
        rgtrId: data.rgtrId || '',
        regDt: data.regDt || null,
        mdfrId: data.mdfrId || '',
        mdfcnDt: data.mdfcnDt || null,
      }));

      setSelectedAplyMthCodes(splitCommaCodes(data.plcyFnncAplyMthCd));
      setSelectedLoanUseUsgCodes(splitCommaCodes(data.loanPlcyFnncUseUsgSeCd));
    } catch (error) {
      console.error('정책금융 상세 조회 실패:', error);
      alert('정책금융 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = buildRequestPayload();
      if (isUpdateMode) {
        await http.put(`/api/v1/policy-finance/${policyNo}`, payload);
        alert('수정되었습니다.');
      } else {
        await http.post('/api/v1/policy-finance', payload);
        alert('등록되었습니다.');
      }
      navigate('..');
    } catch (error) {
      console.error('정책금융 저장 실패:', error);
      alert('정책금융 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoList = () => {
    navigate('..');
  };

  useEffect(() => {
    fetchPolicyFinanceCodes();
  }, []);

  useEffect(() => {
    fetchPolicyFinanceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyNo, isUpdateMode]);

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
        <h2>{isUpdateMode ? '정책금융 수정' : '정책금융 등록'}</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>정책금융 관리</li>
          <li>정책금융 목록</li>
          <li className="on">
            {isUpdateMode ? '정책금융 수정' : '정책금융 등록'}
          </li>
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
                  <td>승인여부</td>
                  <td>
                    <div className="onradioBox">
                      {gdsSttsRadioOptions.map((option, index) => (
                        <RadioButton
                          key={`gds-stts-${option.value}`}
                          groupId={`gds-stts-${index}`}
                          radioGroup="plcyFnncGdsSttsCd"
                          radioValue={option.value}
                          radioName={option.label}
                          selectedValue={formData.plcyFnncGdsSttsCd}
                          onChange={handleValueChange('plcyFnncGdsSttsCd')}
                        />
                      ))}
                    </div>
                  </td>
                  <td>접수상황</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      options={rcptSttsSelectOptions}
                      showAllOption={false}
                      value={formData.plcyFnncRcptSttsCd}
                      onChange={handleInputChange('plcyFnncRcptSttsCd')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      options={withSelectPlaceholder(BIZ_FLFMT_INST_OPTIONS)}
                      showAllOption={false}
                      value={formData.bizFlfmtInstCd}
                      onChange={handleInputChange('bizFlfmtInstCd')}
                    />
                  </td>
                  <td>상품명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.plcyFnncNm}
                      onChange={handleInputChange('plcyFnncNm')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncGdsPrps}
                      onChange={handleInputChange('plcyFnncGdsPrps')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={formData.plcyFnncSprtTrgtCn}
                      onChange={handleValueChange('plcyFnncSprtTrgtCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.grntePlcyFnncPrtrtCndCn}
                      onChange={handleInputChange('grntePlcyFnncPrtrtCndCn')}
                    />
                  </td>
                  <td>보증한도</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.plcyFnncSprtLimCn}
                      onChange={handleInputChange('plcyFnncSprtLimCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>보증비율</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.plcyFnncGrnteRtCn}
                      onChange={handleInputChange('plcyFnncGrnteRtCn')}
                    />
                  </td>
                  <td>보증료율 감면</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.plcyFnncGrfeCn}
                      onChange={handleInputChange('plcyFnncGrfeCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원대상자금</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.loanPlcyFnncUseUsgCn}
                      onChange={handleInputChange('loanPlcyFnncUseUsgCn')}
                    />
                  </td>
                  <td>신청방식</td>
                  <td>
                    <div className="oncheckBox">
                      {plcyFnncAplyMthOptions.map((option, index) => (
                        <CheckBox
                          key={`aply-mth-${option.value}`}
                          chkId={`aply-mth-${index}`}
                          chkName={option.label}
                          value={option.value}
                          checked={selectedAplyMthCodes.includes(option.value)}
                          onChange={handleToggleMultiCode(
                            setSelectedAplyMthCodes
                          )}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>보증제한대상</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={formData.plcyFnncSprtExclTrgtCn}
                      onChange={handleValueChange('plcyFnncSprtExclTrgtCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.cmptncRgnNm}
                      onChange={handleInputChange('cmptncRgnNm')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={formData.inqplCn}
                      onChange={handleValueChange('inqplCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청기간(일시)</td>
                  <td colSpan={3}>
                    <div className="ondatepickerbox">
                      <DatepickerBox
                        value={formData.aplyBgngYmd}
                        onChange={handleValueChange('aplyBgngYmd')}
                        outputFormat="ymd"
                      />
                      <span className="onunit">~</span>
                      <DatepickerBox
                        value={formData.aplyDdlnYmd}
                        onChange={handleValueChange('aplyDdlnYmd')}
                        outputFormat="ymd"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>상세 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncDtlUrlAddr}
                      onChange={handleInputChange('plcyFnncDtlUrlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>문의 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncInqplUrlAddr}
                      onChange={handleInputChange('plcyFnncInqplUrlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncAplyUrlAddr}
                      onChange={handleInputChange('plcyFnncAplyUrlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>첨부파일 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncAtchFileUrlAddr}
                      onChange={handleInputChange('plcyFnncAtchFileUrlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    해시태그
                    <br />
                  </td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="예: 태그1,태그2,태그3"
                      value={formData.plcyFnncHstgCn}
                      onChange={handleInputChange('plcyFnncHstgCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      options={entSclSelectOptions}
                      showAllOption={false}
                      value={formData.plcyFnncEntSclCd}
                      onChange={handleInputChange('plcyFnncEntSclCd')}
                    />
                  </td>
                  <td>업종</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <MenuInputBox
                        menuType="input"
                        menuSize="145px"
                        placeholder="대분류 코드"
                        value={formData.tpbizLclsfCd}
                        onChange={handleInputChange('tpbizLclsfCd')}
                      />
                      <MenuInputBox
                        menuType="input"
                        menuSize="145px"
                        placeholder="KSIC 코드"
                        value={formData.ksicCd}
                        onChange={handleInputChange('ksicCd')}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>우대기업 유형</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      options={dtlCndSelectOptions}
                      showAllOption={false}
                      value={formData.plcyFnncDtlCndCd}
                      onChange={handleInputChange('plcyFnncDtlCndCd')}
                    />
                  </td>
                  <td>상품종류</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      options={gdsKndSelectOptions}
                      showAllOption={false}
                      value={formData.plcyFnncGdsKndCd}
                      onChange={handleInputChange('plcyFnncGdsKndCd')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업규모 요약</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncEntSclSmryCn}
                      onChange={handleInputChange('plcyFnncEntSclSmryCn')}
                    />
                  </td>
                  <td>지원대상자금(용도) 요약</td>
                  <td>
                    <div className="oncheckBox">
                      {plcyFnncUseUsgSeOptions.map((option, index) => (
                        <CheckBox
                          key={`loan-use-usg-${option.value}`}
                          chkId={`loan-use-usg-${index}`}
                          chkName={option.label}
                          value={option.value}
                          checked={selectedLoanUseUsgCodes.includes(
                            option.value
                          )}
                          onChange={handleToggleMultiCode(
                            setSelectedLoanUseUsgCodes
                          )}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>보증비율 요약코드</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncCmpnRtCn}
                      onChange={handleInputChange('plcyFnncCmpnRtCn')}
                    />
                  </td>
                  <td>보증비율 요약</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={formData.plcyFnncCmpnRtSmryCn}
                      onChange={handleInputChange('plcyFnncCmpnRtSmryCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td>{formData.rgtrId || '-'}</td>
                  <td>등록일시</td>
                  <td>{formatDate(formData.regDt, 'yyyy-MM-dd HH:mm:ss')}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>{formData.mdfrId || '-'}</td>
                  <td>최종 수정일시</td>
                  <td>{formatDate(formData.mdfcnDt, 'yyyy-MM-dd HH:mm:ss')}</td>
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
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

PolicyFinanceForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};
