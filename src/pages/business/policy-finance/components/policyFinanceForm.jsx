import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/SmepEditor.jsx';
import http from '@lib/http.js';
import PolicyFinanceGuaranteeSection from '@pages/business/policy-finance/components/PolicyFinanceGuaranteeSection.jsx';
import PolicyFinanceInsuranceSection from '@pages/business/policy-finance/components/PolicyFinanceInsuranceSection.jsx';
import PolicyFinanceLoanSection from '@pages/business/policy-finance/components/PolicyFinanceLoanSection.jsx';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GDS_TYPE_LOAN = 'FT01';
const GDS_TYPE_GRNTE = 'FT02';
const GDS_TYPE_INSRNC = 'FT03';
const CREATE_PRODUCT_TYPE_CODES = new Set([
  GDS_TYPE_LOAN,
  GDS_TYPE_GRNTE,
  GDS_TYPE_INSRNC,
]);
const USE_YN_CODES = new Set(['Y', 'N']);

const COMMON_CODE_GROUPS = [
  'PLCY_FNNC_GDS_TYPE_CD',
  'PLCY_FNNC_STTS_CD',
  'PLCY_FNNC_APLY_MTH_CD',
  'PLCY_FNNC_RCPT_STTS_CD',
  'PLCY_FNNC_ENT_SCL_CD',
  'PLCY_FNNC_DTL_CND_CD',
  'PLCY_FNNC_SPRT_TRGT_FNDS_CD',
  'PLCY_FNDS_LOAN_MTH_CD',
  'FLCTN_IRT_TYPE_CD',
  'LOAN_PRD_SMRY_CD',
  'PLCY_FNNC_RPMT_MTHD_CD',
  'PLCY_FNNC_SPRT_TRGT_FNDS_USG_CD',
  'PLCY_FNNC_GDS_KND_CD',
  'PLCY_FNNC_GRNTE_RT_SMRY_CD',
  'PLCY_FNNC_CMPN_RT_SMRY_CD',
];
const EMPTY_OPTIONS = [];

const createInitialForm = () => ({
  plcyFnncGdsTypeCd: '',
  plcyFnncSttsCd: '',
  plcyFnncRcptSttsCd: '',
  plcyFnncBizFlfmtInstNm: '',
  plcyFnncGdsNm: '',
  plcyFnncGdsPrpsCn: '',
  plcyFnncSprtTrgtCn: '',
  plcyFnncSprtLimCn: '',
  plcyFnncSprtExclTrgtCn: '',
  plcyFnncAplyMthCd: [],
  cmptncRgnNm: '',
  plcyFnncInqCn: '',
  plcyFnncAplyBgngDtCn: '',
  plcyFnncAplyDdlnDtCn: '',
  plcyFnncDtlUrlAddr: '',
  plcyFnncInqplUrlAddr: '',
  hstgNmsInput: '',
  plcyFnncAtchFileUrlAddr: '',
  plcyFnncEntSclCd: [],
  plcyFnncTpbizNm: '',
  plcyFnncTpbizDtlClsfNm: '',
  plcyFnncAddDtlCndCn: [],
  plcyFnncAplyUrlAddr: '',
  plcyFnncEntSclSmryCn: '',
  plcyFnncSprtLimSmryCn: '',
  useYn: 'Y',
  slsAmtCn: '',
  tpbizHstryCn: '',
  loanPrtrtCndCn: '',
  loanSprtTrgtFndsCn: [],
  loanMthCn: [],
  crtrIrtCn: '',
  loanIrtCn: '',
  flctnIrtYnCn: [],
  loanPrdCn: '',
  dfmtPrdCn: '',
  loanRpmtMthdCd: [],
  loanRcmdtnInstNm: '',
  thmTpbizNm: '',
  loanSprtTrgtFndsSmryCn: '',
  loanPrdSmryCd: '',
  grntePrtrtCndCn: '',
  grnteRtCn: '',
  grfeCn: '',
  grnteSprtTrgtFndsUsgCn: [],
  grnteSprtTrgtFndsUsgSmryCn: '',
  grnteGdsKndCd: [],
  grnteRtSmryCn: '',
  grnteRtSmryCd: '',
  grnteRcmdtnInstNm: '',
  insrncPrtrtCndCn: '',
  insrncIspmPrtrtCndCn: '',
  insrncCmpnRtCn: '',
  insrncGiveAmtCn: '',
  ispmCn: '',
  insrncScrtVldPrdCn: '',
  insrncGiveAmtSmryCn: '',
  insrncCmpnRtSmryCn: '',
  insrncCmpnRtSmryCd: '',
  rgtrId: '',
  regDt: '',
  mdfrId: '',
  mdfcnDt: '',
});

const normalizeText = (value) => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
};

const normalizeSelectValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const parseCsvToArray = (value) => {
  if (!value) return [];
  return [...new Set(String(value).split(',').map((item) => item.trim()))]
    .filter(Boolean);
};

const parseHashtagInputToNameArray = (value) => {
  if (value === null || value === undefined) {
    return { names: [], overLengthToken: null };
  }

  const raw = String(value).trim();
  if (!raw) {
    return { names: [], overLengthToken: null };
  }

  const tokens = raw
    .split(',')
    .map((item) => item.replace(/#/g, '').trim())
    .filter(Boolean);

  const names = [];
  const seen = new Set();
  for (const token of tokens) {
    if (token.length > 100) {
      return { names: [], overLengthToken: token };
    }
    if (seen.has(token)) continue;
    seen.add(token);
    names.push(token);
  }

  return { names, overLengthToken: null };
};

const normalizeHashtagInputForCompare = (value) =>
  parseHashtagInputToNameArray(value).names.join(',');

const joinArrayToCsv = (values) => {
  const normalized = [...new Set((values || []).map((item) => String(item).trim()))]
    .filter(Boolean);
  return normalized.length > 0 ? normalized.join(',') : null;
};

const toSelectOptions = (options = []) => [{ value: '', label: '선택' }, ...options];

const optionContainsValue = (options = [], value) => {
  const normalized = normalizeSelectValue(value);
  if (!normalized) return false;
  return options.some((option) => normalizeSelectValue(option.value) === normalized);
};

const validateSingleOptionValue = (label, value, options = []) => {
  const normalized = normalizeSelectValue(value);
  if (!normalized) return true;
  if (optionContainsValue(options, normalized)) return true;
  alert(`${label} 값을 다시 선택해주세요.`);
  return false;
};

const validateMultiOptionValues = (label, values, options = []) => {
  const selectedValues = Array.isArray(values) ? values : [];
  const invalidValue = selectedValues
    .map((value) => normalizeSelectValue(value))
    .find((value) => value && !optionContainsValue(options, value));
  if (!invalidValue) return true;
  alert(`${label} 값을 다시 선택해주세요.`);
  return false;
};

const validateMaxLength = (label, value, maxLength) => {
  if (value === null || value === undefined) return true;
  if (String(value).trim().length <= maxLength) return true;
  alert(`${label}은(는) ${maxLength}자 이하로 입력해주세요.`);
  return false;
};

const validateCsvMaxLength = (label, values, maxLength) =>
  validateMaxLength(label, joinArrayToCsv(values) || '', maxLength);

const createCheckboxId = (fieldName, value) =>
  `${fieldName}_${String(value).replace(/[^A-Za-z0-9_-]/g, '_')}`;

const formatDateTime = (value) =>
  value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : '-';

const mapDetailToHashtagInput = (detail = {}) => {
  const hashtagNames = parseCsvToArray(detail.hstgNmList).join(',');
  if (hashtagNames) return hashtagNames;
  return parseCsvToArray(detail.hstgSnList).join(',');
};

const mapDetailToForm = (detail = {}) => ({
  ...createInitialForm(),
  plcyFnncGdsTypeCd: detail.plcyFnncGdsTypeCd || '',
  plcyFnncSttsCd: normalizeSelectValue(detail.plcyFnncSttsCd),
  plcyFnncRcptSttsCd: normalizeSelectValue(detail.plcyFnncRcptSttsCd),
  plcyFnncBizFlfmtInstNm: detail.plcyFnncBizFlfmtInstNm || '',
  plcyFnncGdsNm: detail.plcyFnncGdsNm || '',
  plcyFnncGdsPrpsCn: detail.plcyFnncGdsPrpsCn || '',
  plcyFnncSprtTrgtCn: detail.plcyFnncSprtTrgtCn || '',
  plcyFnncSprtLimCn: detail.plcyFnncSprtLimCn || '',
  plcyFnncSprtExclTrgtCn: detail.plcyFnncSprtExclTrgtCn || '',
  plcyFnncAplyMthCd: parseCsvToArray(detail.plcyFnncAplyMthCd),
  cmptncRgnNm: detail.cmptncRgnNm || '',
  plcyFnncInqCn: detail.plcyFnncInqCn || '',
  plcyFnncAplyBgngDtCn: detail.plcyFnncAplyBgngDtCn || '',
  plcyFnncAplyDdlnDtCn: detail.plcyFnncAplyDdlnDtCn || '',
  plcyFnncDtlUrlAddr: detail.plcyFnncDtlUrlAddr || '',
  plcyFnncInqplUrlAddr: detail.plcyFnncInqplUrlAddr || '',
  hstgNmsInput: mapDetailToHashtagInput(detail),
  plcyFnncAtchFileUrlAddr: detail.plcyFnncAtchFileUrlAddr || '',
  plcyFnncEntSclCd: parseCsvToArray(detail.plcyFnncEntSclCd),
  plcyFnncTpbizNm: detail.plcyFnncTpbizNm || '',
  plcyFnncTpbizDtlClsfNm: detail.plcyFnncTpbizDtlClsfNm || '',
  plcyFnncAddDtlCndCn: parseCsvToArray(detail.plcyFnncAddDtlCndCn),
  plcyFnncAplyUrlAddr: detail.plcyFnncAplyUrlAddr || '',
  plcyFnncEntSclSmryCn: detail.plcyFnncEntSclSmryCn || '',
  plcyFnncSprtLimSmryCn: detail.plcyFnncSprtLimSmryCn || '',
  useYn: detail.useYn || 'Y',
  slsAmtCn: detail.slsAmtCn || '',
  tpbizHstryCn: detail.tpbizHstryCn || '',
  loanPrtrtCndCn: detail.loanPrtrtCndCn || '',
  loanSprtTrgtFndsCn: parseCsvToArray(detail.loanSprtTrgtFndsCn),
  loanMthCn: parseCsvToArray(detail.loanMthCn),
  crtrIrtCn: detail.crtrIrtCn || '',
  loanIrtCn: detail.loanIrtCn || '',
  flctnIrtYnCn: parseCsvToArray(detail.flctnIrtYnCn),
  loanPrdCn: detail.loanPrdCn || '',
  dfmtPrdCn: detail.dfmtPrdCn || '',
  loanRpmtMthdCd: parseCsvToArray(detail.loanRpmtMthdCd),
  loanRcmdtnInstNm: detail.loanRcmdtnInstNm || '',
  thmTpbizNm: detail.thmTpbizNm || '',
  loanSprtTrgtFndsSmryCn: detail.loanSprtTrgtFndsSmryCn || '',
  loanPrdSmryCd: detail.loanPrdSmryCd || '',
  grntePrtrtCndCn: detail.grntePrtrtCndCn || '',
  grnteRtCn: detail.grnteRtCn || '',
  grfeCn: detail.grfeCn || '',
  grnteSprtTrgtFndsUsgCn: parseCsvToArray(detail.grnteSprtTrgtFndsUsgCn),
  grnteSprtTrgtFndsUsgSmryCn: detail.grnteSprtTrgtFndsUsgSmryCn || '',
  grnteGdsKndCd: parseCsvToArray(detail.grnteGdsKndCd),
  grnteRtSmryCn: detail.grnteRtSmryCn || '',
  grnteRtSmryCd: detail.grnteRtSmryCd || '',
  grnteRcmdtnInstNm: detail.grnteRcmdtnInstNm || '',
  insrncPrtrtCndCn: detail.insrncPrtrtCndCn || '',
  insrncIspmPrtrtCndCn: detail.insrncIspmPrtrtCndCn || '',
  insrncCmpnRtCn: detail.insrncCmpnRtCn || '',
  insrncGiveAmtCn: detail.insrncGiveAmtCn || '',
  ispmCn: detail.ispmCn || '',
  insrncScrtVldPrdCn: detail.insrncScrtVldPrdCn || '',
  insrncGiveAmtSmryCn: detail.insrncGiveAmtSmryCn || '',
  insrncCmpnRtSmryCn: detail.insrncCmpnRtSmryCn || '',
  insrncCmpnRtSmryCd: detail.insrncCmpnRtSmryCd || '',
  rgtrId: detail.rgtrId || '',
  regDt: detail.regDt || '',
  mdfrId: detail.mdfrId || '',
  mdfcnDt: detail.mdfcnDt || '',
});

export default function PolicyFinanceForm({ mode }) {
  const navigate = useNavigate();
  const { policyNo } = useParams();
  const isUpdateMode = mode === 'update';

  const [loading, setLoading] = useState(isUpdateMode);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(createInitialForm);
  const [initialHashtagInput, setInitialHashtagInput] = useState('');
  const [commonCodeOptions, setCommonCodeOptions] = useState({});
  const [institutionOptions, setInstitutionOptions] = useState([]);

  const productTypeOptions =
    commonCodeOptions.PLCY_FNNC_GDS_TYPE_CD || EMPTY_OPTIONS;
  const approvalStatusOptions =
    commonCodeOptions.PLCY_FNNC_STTS_CD || EMPTY_OPTIONS;
  const applyMethodOptions =
    commonCodeOptions.PLCY_FNNC_APLY_MTH_CD || EMPTY_OPTIONS;
  const receiptStatusOptions =
    commonCodeOptions.PLCY_FNNC_RCPT_STTS_CD || EMPTY_OPTIONS;
  const companyScaleOptions =
    commonCodeOptions.PLCY_FNNC_ENT_SCL_CD || EMPTY_OPTIONS;
  const preferredTypeOptions =
    commonCodeOptions.PLCY_FNNC_DTL_CND_CD || EMPTY_OPTIONS;
  const loanFundsOptions =
    commonCodeOptions.PLCY_FNNC_SPRT_TRGT_FNDS_CD || EMPTY_OPTIONS;
  const loanMethodOptions =
    commonCodeOptions.PLCY_FNDS_LOAN_MTH_CD || EMPTY_OPTIONS;
  const rateTypeOptions = commonCodeOptions.FLCTN_IRT_TYPE_CD || EMPTY_OPTIONS;
  const loanPeriodSummaryOptions =
    commonCodeOptions.LOAN_PRD_SMRY_CD || EMPTY_OPTIONS;
  const repaymentMethodOptions =
    commonCodeOptions.PLCY_FNNC_RPMT_MTHD_CD || EMPTY_OPTIONS;
  const grnteFundsUsageOptions =
    commonCodeOptions.PLCY_FNNC_SPRT_TRGT_FNDS_USG_CD || EMPTY_OPTIONS;
  const grnteGoodsKindOptions =
    commonCodeOptions.PLCY_FNNC_GDS_KND_CD || EMPTY_OPTIONS;
  const grnteRateSummaryCodeOptions =
    commonCodeOptions.PLCY_FNNC_GRNTE_RT_SMRY_CD || EMPTY_OPTIONS;
  const insrncCmpnSummaryCodeOptions =
    commonCodeOptions.PLCY_FNNC_CMPN_RT_SMRY_CD || EMPTY_OPTIONS;

  const pageTitle = isUpdateMode ? '정책금융 수정' : '정책금융 등록';

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiValueChange = (key) => ({ value, checked }) => {
    const normalized = String(value || '').trim();
    if (!normalized) return;
    setForm((prev) => {
      const currentValues = Array.isArray(prev[key]) ? prev[key] : [];
      if (checked) {
        if (currentValues.includes(normalized)) return prev;
        return { ...prev, [key]: [...currentValues, normalized] };
      }
      return { ...prev, [key]: currentValues.filter((item) => item !== normalized) };
    });
  };

  const buildMasterPayload = (includeTypeCode) => {
    const payload = {
      plcyFnncGdsNm: normalizeText(form.plcyFnncGdsNm),
      plcyFnncBizFlfmtInstNm: normalizeText(form.plcyFnncBizFlfmtInstNm),
      plcyFnncGdsPrpsCn: normalizeText(form.plcyFnncGdsPrpsCn),
      plcyFnncSprtTrgtCn: normalizeText(form.plcyFnncSprtTrgtCn),
      plcyFnncSprtLimCn: normalizeText(form.plcyFnncSprtLimCn),
      plcyFnncSprtLimSmryCn: normalizeText(form.plcyFnncSprtLimSmryCn),
      plcyFnncSprtExclTrgtCn: normalizeText(form.plcyFnncSprtExclTrgtCn),
      cmptncRgnNm: normalizeText(form.cmptncRgnNm),
      plcyFnncInqCn: normalizeText(form.plcyFnncInqCn),
      plcyFnncAplyBgngDtCn: normalizeText(form.plcyFnncAplyBgngDtCn),
      plcyFnncAplyDdlnDtCn: normalizeText(form.plcyFnncAplyDdlnDtCn),
      plcyFnncDtlUrlAddr: normalizeText(form.plcyFnncDtlUrlAddr),
      plcyFnncInqplUrlAddr: normalizeText(form.plcyFnncInqplUrlAddr),
      plcyFnncSttsCd: normalizeText(form.plcyFnncSttsCd),
      plcyFnncAtchFileUrlAddr: normalizeText(form.plcyFnncAtchFileUrlAddr),
      plcyFnncAplyMthCd: joinArrayToCsv(form.plcyFnncAplyMthCd),
      plcyFnncEntSclCd: joinArrayToCsv(form.plcyFnncEntSclCd),
      plcyFnncEntSclSmryCn: normalizeText(form.plcyFnncEntSclSmryCn),
      plcyFnncTpbizNm: normalizeText(form.plcyFnncTpbizNm),
      plcyFnncTpbizDtlClsfNm: normalizeText(form.plcyFnncTpbizDtlClsfNm),
      plcyFnncAddDtlCndCn: joinArrayToCsv(form.plcyFnncAddDtlCndCn),
      plcyFnncRcptSttsCd: normalizeText(form.plcyFnncRcptSttsCd),
      plcyFnncAplyUrlAddr: normalizeText(form.plcyFnncAplyUrlAddr),
      useYn: normalizeText(form.useYn) || 'Y',
    };
    if (includeTypeCode) {
      payload.plcyFnncGdsTypeCd = normalizeText(form.plcyFnncGdsTypeCd);
    }
    return payload;
  };

  const buildLoanDetailPayload = () => ({
    loanSprtTrgtFndsCn: joinArrayToCsv(form.loanSprtTrgtFndsCn),
    loanSprtTrgtFndsSmryCn: normalizeText(form.loanSprtTrgtFndsSmryCn),
    slsAmtCn: normalizeText(form.slsAmtCn),
    tpbizHstryCn: normalizeText(form.tpbizHstryCn),
    loanPrtrtCndCn: normalizeText(form.loanPrtrtCndCn),
    loanMthCn: joinArrayToCsv(form.loanMthCn),
    crtrIrtCn: normalizeText(form.crtrIrtCn),
    loanIrtCn: normalizeText(form.loanIrtCn),
    flctnIrtYnCn: joinArrayToCsv(form.flctnIrtYnCn),
    loanPrdCn: normalizeText(form.loanPrdCn),
    loanPrdSmryCd: normalizeText(form.loanPrdSmryCd),
    dfmtPrdCn: normalizeText(form.dfmtPrdCn),
    loanRcmdtnInstNm: normalizeText(form.loanRcmdtnInstNm),
    loanRpmtMthdCd: joinArrayToCsv(form.loanRpmtMthdCd),
    thmTpbizNm: normalizeText(form.thmTpbizNm),
  });

  const buildGuaranteeDetailPayload = () => ({
    grnteSprtTrgtFndsUsgCn: joinArrayToCsv(form.grnteSprtTrgtFndsUsgCn),
    grnteSprtTrgtFndsUsgSmryCn: normalizeText(form.grnteSprtTrgtFndsUsgSmryCn),
    grntePrtrtCndCn: normalizeText(form.grntePrtrtCndCn),
    grnteRtCn: normalizeText(form.grnteRtCn),
    grnteRtSmryCn: normalizeText(form.grnteRtSmryCn),
    grnteRtSmryCd: normalizeText(form.grnteRtSmryCd),
    grfeCn: normalizeText(form.grfeCn),
    grnteRcmdtnInstNm: normalizeText(form.grnteRcmdtnInstNm),
    grnteGdsKndCd: joinArrayToCsv(form.grnteGdsKndCd),
  });

  const buildInsuranceDetailPayload = () => ({
    insrncGiveAmtCn: normalizeText(form.insrncGiveAmtCn),
    insrncGiveAmtSmryCn: normalizeText(form.insrncGiveAmtSmryCn),
    ispmCn: normalizeText(form.ispmCn),
    insrncPrtrtCndCn: normalizeText(form.insrncPrtrtCndCn),
    insrncIspmPrtrtCndCn: normalizeText(form.insrncIspmPrtrtCndCn),
    insrncCmpnRtCn: normalizeText(form.insrncCmpnRtCn),
    insrncCmpnRtSmryCn: normalizeText(form.insrncCmpnRtSmryCn),
    insrncCmpnRtSmryCd: normalizeText(form.insrncCmpnRtSmryCd),
    insrncScrtVldPrdCn: normalizeText(form.insrncScrtVldPrdCn),
  });

  const buildRequestPayload = () => {
    const { names: hashtagNames } = parseHashtagInputToNameArray(form.hstgNmsInput);
    const isHashtagChanged =
      normalizeHashtagInputForCompare(form.hstgNmsInput) !==
      normalizeHashtagInputForCompare(initialHashtagInput);
    const payload = { master: buildMasterPayload(!isUpdateMode) };
    payload.additional = {
      prfrcGdsSns: null,
      hstgNms: isUpdateMode
        ? (isHashtagChanged ? hashtagNames : null)
        : hashtagNames,
    };
    if (form.plcyFnncGdsTypeCd === GDS_TYPE_LOAN) {
      payload.loanDetail = buildLoanDetailPayload();
    }
    if (form.plcyFnncGdsTypeCd === GDS_TYPE_GRNTE) {
      payload.grnteDetail = buildGuaranteeDetailPayload();
    }
    if (form.plcyFnncGdsTypeCd === GDS_TYPE_INSRNC) {
      payload.insrncDetail = buildInsuranceDetailPayload();
    }
    return payload;
  };

  const validateForm = () => {
    if (isUpdateMode && !policyNo) {
      alert('수정 대상 정책금융 번호가 없습니다.');
      return false;
    }
    if (!normalizeText(form.plcyFnncGdsTypeCd)) {
      alert('상품유형을 선택해주세요.');
      return false;
    }
    if (!normalizeText(form.plcyFnncSttsCd)) {
      alert('승인여부를 선택해주세요.');
      return false;
    }
    if (!normalizeText(form.plcyFnncBizFlfmtInstNm)) {
      alert('사업수행기관을 입력해주세요.');
      return false;
    }
    if (!normalizeText(form.plcyFnncGdsNm)) {
      alert('상품명을 입력해주세요.');
      return false;
    }
    const normalizedUseYn = normalizeSelectValue(form.useYn);
    if (!USE_YN_CODES.has(normalizedUseYn)) {
      alert('사용여부를 다시 선택해주세요.');
      return false;
    }
    if (!isUpdateMode) {
      const normalizedTypeCd = normalizeSelectValue(form.plcyFnncGdsTypeCd);
      if (
        !CREATE_PRODUCT_TYPE_CODES.has(normalizedTypeCd) ||
        !optionContainsValue(productTypeOptions, normalizedTypeCd)
      ) {
        alert('상품유형은 대출, 보증, 보증보험 중에서 선택해주세요.');
        return false;
      }
      if (!validateSingleOptionValue('승인여부', form.plcyFnncSttsCd, approvalStatusOptions)) {
        return false;
      }
      if (
        !validateSingleOptionValue(
          '접수상황',
          form.plcyFnncRcptSttsCd,
          receiptStatusOptions
        )
      ) {
        return false;
      }
      if (!validateMultiOptionValues('신청방식', form.plcyFnncAplyMthCd, applyMethodOptions)) {
        return false;
      }
      if (!validateMultiOptionValues('기업규모', form.plcyFnncEntSclCd, companyScaleOptions)) {
        return false;
      }
      if (
        !validateMultiOptionValues(
          '추가상세조건',
          form.plcyFnncAddDtlCndCn,
          preferredTypeOptions
        )
      ) {
        return false;
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_LOAN) {
        if (
          !validateMultiOptionValues('지원대상자금', form.loanSprtTrgtFndsCn, loanFundsOptions) ||
          !validateMultiOptionValues('대출방식', form.loanMthCn, loanMethodOptions) ||
          !validateMultiOptionValues('금리유형', form.flctnIrtYnCn, rateTypeOptions) ||
          !validateSingleOptionValue('대출기간요약', form.loanPrdSmryCd, loanPeriodSummaryOptions) ||
          !validateMultiOptionValues('상환방식', form.loanRpmtMthdCd, repaymentMethodOptions)
        ) {
          return false;
        }
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_GRNTE) {
        if (
          !validateMultiOptionValues(
            '보증지원대상자금용도',
            form.grnteSprtTrgtFndsUsgCn,
            grnteFundsUsageOptions
          ) ||
          !validateMultiOptionValues('보증상품종류', form.grnteGdsKndCd, grnteGoodsKindOptions) ||
          !validateSingleOptionValue('보증비율요약', form.grnteRtSmryCd, grnteRateSummaryCodeOptions)
        ) {
          return false;
        }
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_INSRNC) {
        if (
          !validateSingleOptionValue(
            '보험보상비율요약',
            form.insrncCmpnRtSmryCd,
            insrncCmpnSummaryCodeOptions
          )
        ) {
          return false;
        }
      }
      const lengthRules = [
        ['상품유형', form.plcyFnncGdsTypeCd, 20],
        ['상품명', form.plcyFnncGdsNm, 200],
        ['사업수행기관', form.plcyFnncBizFlfmtInstNm, 200],
        ['상품목적', form.plcyFnncGdsPrpsCn, 2000],
        ['지원대상', form.plcyFnncSprtTrgtCn, 2000],
        ['지원한도', form.plcyFnncSprtLimCn, 2000],
        ['지원한도요약', form.plcyFnncSprtLimSmryCn, 2000],
        ['지원제외대상', form.plcyFnncSprtExclTrgtCn, 4000],
        ['관할지역', form.cmptncRgnNm, 500],
        ['문의내용', form.plcyFnncInqCn, 500],
        ['신청시작일시', form.plcyFnncAplyBgngDtCn, 200],
        ['신청마감일시', form.plcyFnncAplyDdlnDtCn, 200],
        ['상세URL', form.plcyFnncDtlUrlAddr, 1000],
        ['문의처URL', form.plcyFnncInqplUrlAddr, 1000],
        ['승인여부', form.plcyFnncSttsCd, 10],
        ['첨부파일URL', form.plcyFnncAtchFileUrlAddr, 1000],
        ['기업규모요약', form.plcyFnncEntSclSmryCn, 200],
        ['업종명', form.plcyFnncTpbizNm, 200],
        ['업종상세분류명', form.plcyFnncTpbizDtlClsfNm, 100],
        ['접수상황', form.plcyFnncRcptSttsCd, 50],
        ['신청URL', form.plcyFnncAplyUrlAddr, 1000],
        ['사용여부', form.useYn, 1],
      ];
      if (!lengthRules.every(([label, value, maxLength]) => validateMaxLength(label, value, maxLength))) {
        return false;
      }
      if (
        !validateCsvMaxLength('신청방식', form.plcyFnncAplyMthCd, 50) ||
        !validateCsvMaxLength('기업규모', form.plcyFnncEntSclCd, 100) ||
        !validateCsvMaxLength('추가상세조건', form.plcyFnncAddDtlCndCn, 500)
      ) {
        return false;
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_LOAN) {
        const loanLengthRules = [
          ['지원대상자금요약', form.loanSprtTrgtFndsSmryCn, 200],
          ['대출신청가능여부', form.loanAplyPsbltyYnCn, 300],
          ['매출액', form.slsAmtCn, 200],
          ['업력', form.tpbizHstryCn, 200],
          ['우대조건', form.loanPrtrtCndCn, 4000],
          ['기준금리', form.crtrIrtCn, 500],
          ['대출금리', form.loanIrtCn, 2000],
          ['대출기간', form.loanPrdCn, 2000],
          ['대출기간요약', form.loanPrdSmryCd, 10],
          ['거치기간', form.dfmtPrdCn, 2000],
          ['추천기관', form.loanRcmdtnInstNm, 200],
          ['대상업종명', form.thmTpbizNm, 100],
        ];
        if (!loanLengthRules.every(([label, value, maxLength]) => validateMaxLength(label, value, maxLength))) {
          return false;
        }
        if (
          !validateCsvMaxLength('지원대상자금', form.loanSprtTrgtFndsCn, 50) ||
          !validateCsvMaxLength('대출방식', form.loanMthCn, 500) ||
          !validateCsvMaxLength('금리유형', form.flctnIrtYnCn, 20) ||
          !validateCsvMaxLength('상환방식', form.loanRpmtMthdCd, 50)
        ) {
          return false;
        }
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_GRNTE) {
        const grnteLengthRules = [
          ['보증지원대상자금용도요약', form.grnteSprtTrgtFndsUsgSmryCn, 200],
          ['우대조건', form.grntePrtrtCndCn, 4000],
          ['보증비율', form.grnteRtCn, 200],
          ['보증비율요약', form.grnteRtSmryCn, 200],
          ['보증비율요약코드', form.grnteRtSmryCd, 10],
          ['보증료', form.grfeCn, 2000],
          ['추천기관', form.grnteRcmdtnInstNm, 200],
        ];
        if (!grnteLengthRules.every(([label, value, maxLength]) => validateMaxLength(label, value, maxLength))) {
          return false;
        }
        if (
          !validateCsvMaxLength('보증지원대상자금용도', form.grnteSprtTrgtFndsUsgCn, 20) ||
          !validateCsvMaxLength('보증상품종류', form.grnteGdsKndCd, 50)
        ) {
          return false;
        }
      }
      if (form.plcyFnncGdsTypeCd === GDS_TYPE_INSRNC) {
        const insrncLengthRules = [
          ['보험지급금액', form.insrncGiveAmtCn, 2000],
          ['보험지급금액요약', form.insrncGiveAmtSmryCn, 2000],
          ['보험료', form.ispmCn, 2000],
          ['우대조건', form.insrncPrtrtCndCn, 4000],
          ['보험료우대조건', form.insrncIspmPrtrtCndCn, 500],
          ['보상비율', form.insrncCmpnRtCn, 300],
          ['보상비율요약', form.insrncCmpnRtSmryCn, 300],
          ['보상비율요약코드', form.insrncCmpnRtSmryCd, 10],
          ['보증유효기간', form.insrncScrtVldPrdCn, 200],
        ];
        if (!insrncLengthRules.every(([label, value, maxLength]) => validateMaxLength(label, value, maxLength))) {
          return false;
        }
      }
    }
    const { overLengthToken } = parseHashtagInputToNameArray(form.hstgNmsInput);
    if (overLengthToken) {
      alert(`해시태그는 항목별 100자 이하로 입력해주세요: ${overLengthToken}`);
      return false;
    }
    return true;
  };

  const loadCommonCodeOptions = async () => {
    try {
      const codes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUPS);
      setCommonCodeOptions(codes || {});
    } catch (error) {
      console.error('정책금융 공통코드 조회 실패:', error);
      setCommonCodeOptions({});
      alert('공통코드 조회에 실패했습니다.');
    }
  };

  const loadInstitutionOptions = async (suprtTy = '') => {
    try {
      const params = suprtTy ? { suprtTy } : undefined;
      const response = await http.get('/api/v1/policy-finance/institutions', {
        params,
      });
      const list = Array.isArray(response?.data) ? response.data : [];
      setInstitutionOptions(
        list.map((name) => ({
          value: name,
          label: name,
        }))
      );
    } catch (error) {
      console.error('정책금융 사업수행기관 조회 실패:', error);
      setInstitutionOptions([]);
    }
  };

  const fetchDetail = async () => {
    if (!policyNo) {
      alert('정책금융 번호가 없습니다.');
      navigate('..');
      return;
    }
    try {
      setLoading(true);
      const response = await http.get(`/api/v1/policy-finance/${policyNo}`);
      const detail = response?.data ?? response ?? null;
      if (!detail) {
        alert('조회된 정책금융 정보가 없습니다.');
        navigate('..');
        return;
      }
      const mappedForm = mapDetailToForm(detail);
      setForm(mappedForm);
      setInitialHashtagInput(mappedForm.hstgNmsInput);
    } catch (error) {
      console.error('정책금융 상세 조회 실패:', error);
      alert('정책금융 상세정보를 불러오는데 실패했습니다.');
      navigate('..');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    if (!validateForm()) return;
    const confirmed = window.confirm(
      isUpdateMode ? '수정하시겠습니까?' : '등록하시겠습니까?'
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const requestBody = buildRequestPayload();
      if (isUpdateMode) {
        await http.post(`/api/v1/policy-finance/update/${policyNo}`, requestBody);
        alert('수정되었습니다.');
      } else {
        await http.post('/api/v1/policy-finance', requestBody);
        alert('등록되었습니다.');
      }
      navigate('..');
    } catch (error) {
      console.error('정책금융 저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadCommonCodeOptions();
  }, []);

  useEffect(() => {
    if (!form.plcyFnncGdsTypeCd) {
      setInstitutionOptions([]);
      return;
    }
    loadInstitutionOptions(form.plcyFnncGdsTypeCd);
  }, [form.plcyFnncGdsTypeCd]);

  useEffect(() => {
    if (isUpdateMode) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateMode, policyNo]);

  useEffect(() => {
    if (isUpdateMode) return;
    setInitialHashtagInput('');
    setForm((prev) => ({
      ...prev,
      plcyFnncGdsTypeCd:
        prev.plcyFnncGdsTypeCd ||
        productTypeOptions.find((option) =>
          CREATE_PRODUCT_TYPE_CODES.has(normalizeSelectValue(option.value))
        )?.value ||
        '',
      plcyFnncSttsCd: prev.plcyFnncSttsCd || approvalStatusOptions[0]?.value || '',
    }));
  }, [
    isUpdateMode,
    productTypeOptions,
    approvalStatusOptions,
  ]);

  if (loading) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">데이터를 불러오는 중입니다.</div>
        </div>
      </div>
    );
  }

  const institutionSelectOptions = toSelectOptions(institutionOptions);
  const typeSelectOptions = toSelectOptions(
    isUpdateMode
      ? productTypeOptions
      : productTypeOptions.filter((option) =>
          CREATE_PRODUCT_TYPE_CODES.has(normalizeSelectValue(option.value))
        )
  );
  const receiptSelectOptions = toSelectOptions(receiptStatusOptions);
  const loanPeriodSummarySelectOptions = toSelectOptions(loanPeriodSummaryOptions);
  const grnteRateSummarySelectOptions = toSelectOptions(
    grnteRateSummaryCodeOptions
  );
  const insrncCmpnSummarySelectOptions = toSelectOptions(
    insrncCmpnSummaryCodeOptions
  );

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
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>상품유형</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      showAllOption={false}
                      options={typeSelectOptions}
                      value={form.plcyFnncGdsTypeCd}
                      onChange={(e) => handleInputChange('plcyFnncGdsTypeCd', e)}
                      disabled={isUpdateMode}
                    />
                  </td>
                  <td>사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="useYn_Y"
                        radioGroup="useYn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={form.useYn}
                        onChange={(value) => handleInputChange('useYn', value)}
                      />
                      <RadioButton
                        groupId="useYn_N"
                        radioGroup="useYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={form.useYn}
                        onChange={(value) => handleInputChange('useYn', value)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>승인여부</td>
                  <td>
                    <div className="onradioBox">
                      {approvalStatusOptions.map((option) => (
                        <RadioButton
                          key={`plcyFnncSttsCd_${option.value}`}
                          groupId={createCheckboxId(
                            'plcyFnncSttsCd',
                            option.value
                          )}
                          radioGroup="plcyFnncSttsCd"
                          radioValue={option.value}
                          radioName={option.label}
                          selectedValue={form.plcyFnncSttsCd}
                          onChange={(value) =>
                            handleInputChange('plcyFnncSttsCd', value)
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td>접수상황</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="300px"
                      showAllOption={false}
                      options={receiptSelectOptions}
                      value={form.plcyFnncRcptSttsCd}
                      onChange={(e) => handleInputChange('plcyFnncRcptSttsCd', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td>
                    {institutionOptions.length > 0 ? (
                      <MenuInputBox
                        menuType="select"
                        menuSize="300px"
                        showAllOption={false}
                        options={institutionSelectOptions}
                        value={form.plcyFnncBizFlfmtInstNm}
                        onChange={(e) =>
                          handleInputChange('plcyFnncBizFlfmtInstNm', e)
                        }
                      />
                    ) : (
                      <MenuInputBox
                        menuType="input"
                        menuSize="300px"
                        value={form.plcyFnncBizFlfmtInstNm}
                        onChange={(e) =>
                          handleInputChange('plcyFnncBizFlfmtInstNm', e)
                        }
                      />
                    )}
                  </td>
                  <td>상품명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncGdsNm}
                      onChange={(e) => handleInputChange('plcyFnncGdsNm', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.plcyFnncGdsPrpsCn}
                      onChange={(value) =>
                        handleInputChange('plcyFnncGdsPrpsCn', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.plcyFnncSprtTrgtCn}
                      onChange={(value) =>
                        handleInputChange('plcyFnncSprtTrgtCn', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원한도</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.plcyFnncSprtLimCn}
                      onChange={(value) =>
                        handleInputChange('plcyFnncSprtLimCn', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원제한대상</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.plcyFnncSprtExclTrgtCn}
                      onChange={(value) =>
                        handleInputChange('plcyFnncSprtExclTrgtCn', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청방식</td>
                  <td colSpan={3}>
                    <div className="oncheckBox">
                      {applyMethodOptions.map((option) => (
                        <CheckBox
                          key={`plcyFnncAplyMthCd_${option.value}`}
                          chkId={createCheckboxId(
                            'plcyFnncAplyMthCd',
                            option.value
                          )}
                          chkName={option.label}
                          value={option.value}
                          checked={form.plcyFnncAplyMthCd.includes(option.value)}
                          onChange={handleMultiValueChange('plcyFnncAplyMthCd')}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.cmptncRgnNm}
                      onChange={(value) => handleInputChange('cmptncRgnNm', value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      minHeight={160}
                      value={form.plcyFnncInqCn}
                      onChange={(value) => handleInputChange('plcyFnncInqCn', value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청시작일시</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncAplyBgngDtCn}
                      onChange={(e) =>
                        handleInputChange('plcyFnncAplyBgngDtCn', e)
                      }
                    />
                  </td>
                  <td>신청마감일시</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncAplyDdlnDtCn}
                      onChange={(e) =>
                        handleInputChange('plcyFnncAplyDdlnDtCn', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>상세URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.plcyFnncDtlUrlAddr}
                      onChange={(e) => handleInputChange('plcyFnncDtlUrlAddr', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>문의URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.plcyFnncInqplUrlAddr}
                      onChange={(e) =>
                        handleInputChange('plcyFnncInqplUrlAddr', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>해시태그(이름)</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="예: 정책자금, 중소기업, #창업"
                      value={form.hstgNmsInput}
                      onChange={(e) => handleInputChange('hstgNmsInput', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.plcyFnncAplyUrlAddr}
                      onChange={(e) => handleInputChange('plcyFnncAplyUrlAddr', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>첨부파일URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.plcyFnncAtchFileUrlAddr}
                      onChange={(e) =>
                        handleInputChange('plcyFnncAtchFileUrlAddr', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td colSpan={3}>
                    <div className="oncheckBox">
                      {companyScaleOptions.map((option) => (
                        <CheckBox
                          key={`plcyFnncEntSclCd_${option.value}`}
                          chkId={createCheckboxId(
                            'plcyFnncEntSclCd',
                            option.value
                          )}
                          chkName={option.label}
                          value={option.value}
                          checked={form.plcyFnncEntSclCd.includes(option.value)}
                          onChange={handleMultiValueChange('plcyFnncEntSclCd')}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>기업규모요약</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncEntSclSmryCn}
                      onChange={(e) =>
                        handleInputChange('plcyFnncEntSclSmryCn', e)
                      }
                    />
                  </td>
                  <td>지원한도요약</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncSprtLimSmryCn}
                      onChange={(e) =>
                        handleInputChange('plcyFnncSprtLimSmryCn', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>업종</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncTpbizNm}
                      onChange={(e) => handleInputChange('plcyFnncTpbizNm', e)}
                    />
                  </td>
                  <td>업종세세분류</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={form.plcyFnncTpbizDtlClsfNm}
                      onChange={(e) =>
                        handleInputChange('plcyFnncTpbizDtlClsfNm', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>우대기업유형</td>
                  <td colSpan={3}>
                    <div className="oncheckBox">
                      {preferredTypeOptions.map((option) => (
                        <CheckBox
                          key={`plcyFnncAddDtlCndCn_${option.value}`}
                          chkId={createCheckboxId(
                            'plcyFnncAddDtlCndCn',
                            option.value
                          )}
                          chkName={option.label}
                          value={option.value}
                          checked={form.plcyFnncAddDtlCndCn.includes(
                            option.value
                          )}
                          onChange={handleMultiValueChange('plcyFnncAddDtlCndCn')}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                {isUpdateMode && (
                  <>
                    <tr>
                      <td>등록자</td>
                      <td>{form.rgtrId || '-'}</td>
                      <td>등록일시</td>
                      <td>{formatDateTime(form.regDt)}</td>
                    </tr>
                    <tr>
                      <td>수정자</td>
                      <td>{form.mdfrId || '-'}</td>
                      <td>수정일시</td>
                      <td>{formatDateTime(form.mdfcnDt)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          {form.plcyFnncGdsTypeCd === GDS_TYPE_LOAN && (
            <PolicyFinanceLoanSection
              form={form}
              loanFundsOptions={loanFundsOptions}
              loanMethodOptions={loanMethodOptions}
              rateTypeOptions={rateTypeOptions}
              loanPeriodSummarySelectOptions={loanPeriodSummarySelectOptions}
              repaymentMethodOptions={repaymentMethodOptions}
              handleInputChange={handleInputChange}
              handleMultiValueChange={handleMultiValueChange}
              createCheckboxId={createCheckboxId}
            />
          )}
          {form.plcyFnncGdsTypeCd === GDS_TYPE_GRNTE && (
            <PolicyFinanceGuaranteeSection
              form={form}
              grnteFundsUsageOptions={grnteFundsUsageOptions}
              grnteGoodsKindOptions={grnteGoodsKindOptions}
              grnteRateSummarySelectOptions={grnteRateSummarySelectOptions}
              handleInputChange={handleInputChange}
              handleMultiValueChange={handleMultiValueChange}
              createCheckboxId={createCheckboxId}
            />
          )}
          {form.plcyFnncGdsTypeCd === GDS_TYPE_INSRNC && (
            <PolicyFinanceInsuranceSection
              form={form}
              insrncCmpnSummarySelectOptions={insrncCmpnSummarySelectOptions}
              handleInputChange={handleInputChange}
            />
          )}
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
              disabled={saving}
            />
          </div>
          <Button
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
}

PolicyFinanceForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};
