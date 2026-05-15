import './MemberItrstFldPopup.css';

import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

const COMMON_CODE_GROUPS = {
  businessType: 'BIZ_PBANC_CLSF_CD',
  supportField: 'ITRST_SPRT_FLD_CD',
  companySize: 'ENT_CLSF_CD',
  businessAge: 'CRNCL_CLSF_CD',
  employeeCount: 'WRKR_CNT_CLSF_CD',
  sales: 'SLS_AMT_CLSF_CD',
  certification: 'ENT_CERT_IDNTY_TYPE_CD',
};

const COMMON_CODE_GROUP_IDS = Object.values(COMMON_CODE_GROUPS);
const LOCATION_INTEREST_FIELD_CODES = {
  sido: '1',
  sigungu: '2',
};

const EMPTY_COMMON_CODE_OPTIONS = {
  businessType: [],
  supportField: [],
  companySize: [],
  businessAge: [],
  employeeCount: [],
  sales: [],
  certification: [],
};

const EMPTY_LOCATION_FIELDS = { sidoCd: '', sigunguCd: '' };

// 공통 응답 래퍼가 있는 API 결과에서 실제 데이터를 추출한다.
function resolveData(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }

  return response;
}

// 관심분야 조회 응답을 체크박스 선택 상태로 변환한다.
function normalizeInterestFieldSelections(interestFields) {
  if (!Array.isArray(interestFields)) {
    return {};
  }

  return interestFields.reduce((selectionMap, item) => {
    const interestFieldCode = String(item?.itrstFldCd || '').trim();
    const valueCode = String(item?.itrstFldVlCd || '').trim();

    if (!COMMON_CODE_GROUP_IDS.includes(interestFieldCode) || !valueCode) {
      return selectionMap;
    }

    return {
      ...selectionMap,
      [interestFieldCode]: [...(selectionMap[interestFieldCode] || []), valueCode],
    };
  }, {});
}

// 관심분야 조회 응답에서 소재지 선택값을 추출한다.
function normalizeLocationSelections(interestFields) {
  if (!Array.isArray(interestFields)) {
    return EMPTY_LOCATION_FIELDS;
  }

  const sidoCd = String(
    interestFields.find((item) => item?.itrstFldCd === LOCATION_INTEREST_FIELD_CODES.sido)
      ?.itrstFldVlCd || '',
  ).trim();
  const sigunguCd = String(
    interestFields.find((item) => item?.itrstFldCd === LOCATION_INTEREST_FIELD_CODES.sigungu)
      ?.itrstFldVlCd || '',
  ).trim();

  return { sidoCd, sigunguCd };
}

// 체크박스 상태 객체를 복사해 초기화/닫기 시 참조가 섞이지 않게 한다.
function cloneInterestFieldSelections(interestFields) {
  return Object.fromEntries(
    Object.entries(interestFields || {}).map(([interestFieldCode, valueCodes]) => [
      interestFieldCode,
      [...valueCodes],
    ]),
  );
}

export default function MemberItrstFldPopup({ member, readOnly = false, onClose }) {
  const [commonCodeOptions, setCommonCodeOptions] = useState(EMPTY_COMMON_CODE_OPTIONS);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [selectedSidoCd, setSelectedSidoCd] = useState('');
  const [selectedSigunguCd, setSelectedSigunguCd] = useState('');
  const [sigunguLoading, setSigunguLoading] = useState(false);
  const [selectedInterestFields, setSelectedInterestFields] = useState({});
  const [saving, setSaving] = useState(false);

  const memberNo = member?.mbrNo;
  const memberLoginId = member?.lgnId;

  useEffect(() => {
    let ignore = false;

    // 관심분야 체크박스에 사용할 공통코드 목록을 조회한다.
    async function loadCommonCodes() {
      try {
        const commonCodes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUP_IDS);
        if (ignore) return;

        setCommonCodeOptions({
          businessType: commonCodes[COMMON_CODE_GROUPS.businessType] || [],
          supportField: commonCodes[COMMON_CODE_GROUPS.supportField] || [],
          companySize: commonCodes[COMMON_CODE_GROUPS.companySize] || [],
          businessAge: commonCodes[COMMON_CODE_GROUPS.businessAge] || [],
          employeeCount: commonCodes[COMMON_CODE_GROUPS.employeeCount] || [],
          sales: commonCodes[COMMON_CODE_GROUPS.sales] || [],
          certification: commonCodes[COMMON_CODE_GROUPS.certification] || [],
        });
      } catch (fetchError) {
        if (ignore) return;

        console.error('[MemberItrstFldPopup] 관심분야 공통코드 조회 실패', fetchError);
        setCommonCodeOptions(EMPTY_COMMON_CODE_OPTIONS);
      }
    }

    void loadCommonCodes();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!memberNo) {
      return undefined;
    }

    let ignore = false;

    // 선택 회원의 저장된 관심분야를 조회해 팝업 선택 상태에 반영한다.
    async function loadSavedInterestFields() {
      try {
        const response = await http.get(
          `/api/v1/member/${encodeURIComponent(memberNo)}/activity/interest-fields`,
        );
        const responseData = resolveData(response);
        const nextInterestFields = normalizeInterestFieldSelections(responseData);
        const nextLocationFields = normalizeLocationSelections(responseData);

        if (ignore) return;
        setSelectedInterestFields(cloneInterestFieldSelections(nextInterestFields));
        setSelectedSidoCd(nextLocationFields.sidoCd);
        setSelectedSigunguCd(nextLocationFields.sigunguCd);
      } catch (fetchError) {
        if (ignore) return;

        console.error('[MemberItrstFldPopup] 저장된 관심분야 조회 실패', fetchError);
        setSelectedInterestFields({});
        setSelectedSidoCd('');
        setSelectedSigunguCd('');
      }
    }

    void loadSavedInterestFields();

    return () => {
      ignore = true;
    };
  }, [memberNo]);

  useEffect(() => {
    if (!memberNo) {
      return undefined;
    }

    let ignore = false;

    // 관심분야 소재지 시도 목록을 조회한다.
    async function fetchSidoList() {
      try {
        const response = await http.get(
          `/api/v1/member/${encodeURIComponent(memberNo)}/activity/interest-fields/stdg/sido`,
        );
        const responseData = resolveData(response);

        if (ignore) return;
        setSidoList(Array.isArray(responseData) ? responseData : []);
      } catch (fetchError) {
        if (ignore) return;

        console.error('[MemberItrstFldPopup] 시도 목록 조회 실패', fetchError);
        setSidoList([]);
      }
    }

    void fetchSidoList();

    return () => {
      ignore = true;
    };
  }, [memberNo]);

  useEffect(() => {
    if (!memberNo || !selectedSidoCd) {
      setSigunguList([]);
      setSigunguLoading(false);
      return undefined;
    }

    let ignore = false;

    // 선택된 시도에 해당하는 시군구 목록을 조회한다.
    async function fetchSigunguList() {
      try {
        setSigunguLoading(true);
        const response = await http.get(
          `/api/v1/member/${encodeURIComponent(memberNo)}/activity/interest-fields/stdg/sigungu`,
          { params: { sidoCd: selectedSidoCd } },
        );
        const responseData = resolveData(response);

        if (ignore) return;
        setSigunguList(Array.isArray(responseData) ? responseData : []);
      } catch (fetchError) {
        if (ignore) return;

        console.error('[MemberItrstFldPopup] 시군구 목록 조회 실패', fetchError);
        setSigunguList([]);
      } finally {
        if (!ignore) {
          setSigunguLoading(false);
        }
      }
    }

    void fetchSigunguList();

    return () => {
      ignore = true;
    };
  }, [memberNo, selectedSidoCd]);

  // 팝업 종료 시 현재 선택값을 비우고 부모 패널에 닫힘을 알린다.
  const handleClose = useCallback(() => {
    setSelectedInterestFields({});
    setSelectedSidoCd('');
    setSelectedSigunguCd('');
    onClose?.();
  }, [onClose]);

  // 시도 변경 시 기존 시군구 선택을 비우고 하위 목록을 다시 조회하게 한다.
  const handleSidoChange = (event) => {
    if (readOnly || saving) {
      return;
    }

    setSelectedSidoCd(event.target.value);
    setSelectedSigunguCd('');
  };

  // 시군구 변경 시 선택된 소재지 하위 코드를 갱신한다.
  const handleSigunguChange = (event) => {
    if (readOnly || saving) {
      return;
    }

    setSelectedSigunguCd(event.target.value);
  };

  // 체크박스 선택 상태를 관심분야 구분 코드별로 갱신한다.
  const handleInterestFieldChange = (interestFieldCode, valueCode, checked) => {
    if (readOnly || saving) {
      return;
    }

    setSelectedInterestFields((currentFields) => {
      const currentValues = new Set(currentFields[interestFieldCode] || []);

      if (checked) {
        currentValues.add(valueCode);
      } else {
        currentValues.delete(valueCode);
      }

      return {
        ...currentFields,
        [interestFieldCode]: Array.from(currentValues),
      };
    });
  };

  // 선택된 체크박스와 소재지 값을 관심분야 저장 API 요청 형식으로 변환한다.
  const buildInterestFieldPayload = () => ({
    interestFields: [
      ...COMMON_CODE_GROUP_IDS.flatMap((interestFieldCode) =>
        (selectedInterestFields[interestFieldCode] || []).map((valueCode) => ({
          itrstFldCd: interestFieldCode,
          itrstFldVlCd: valueCode,
        })),
      ),
      ...(selectedSidoCd
        ? [{ itrstFldCd: LOCATION_INTEREST_FIELD_CODES.sido, itrstFldVlCd: selectedSidoCd }]
        : []),
      ...(selectedSigunguCd
        ? [{ itrstFldCd: LOCATION_INTEREST_FIELD_CODES.sigungu, itrstFldVlCd: selectedSigunguCd }]
        : []),
    ],
  });

  // 선택된 관심분야를 대상 회원 로그인 아이디 기준으로 저장한다.
  const handleSave = async () => {
    if (readOnly) {
      return;
    }

    if (!memberNo || !memberLoginId) {
      window.alert('회원 로그인 아이디가 없어 관심분야를 저장할 수 없습니다.');
      return;
    }

    setSaving(true);
    try {
      await http.post(
        `/api/v1/member/${encodeURIComponent(memberNo)}/activity/interest-fields`,
        buildInterestFieldPayload(),
      );
      window.alert('저장되었습니다.');
      handleClose();
    } catch (saveError) {
      console.error('[MemberItrstFldPopup] 관심분야 저장 실패', saveError);
      window.alert(saveError?.message || '관심분야 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 관심분야 항목을 관리자 체크박스 컴포넌트 목록으로 렌더링한다.
  const renderCheckOptions = (idPrefix, options, interestFieldCode) => (
    <div className="oncheckBox">
      {options.map((option) => (
        <CheckBox
          key={`${idPrefix}_${option.value}`}
          chkId={`${idPrefix}_${option.value}`}
          chkName={option.label}
          value={option.value}
          checked={(selectedInterestFields[interestFieldCode] || []).includes(option.value)}
          disabled={readOnly || saving}
          onChange={({ value, checked }) =>
            handleInterestFieldChange(interestFieldCode, value, checked)
          }
        />
      ))}
    </div>
  );

  const popupTitle = readOnly ? '관심분야 조회' : '관심분야 설정';
  const sidoOptions = sidoList.map((item) => ({
    value: item.code,
    label: item.name,
  }));
  const sigunguOptions = sigunguLoading
    ? [{ value: '', label: '조회 중' }]
    : sigunguList.map((item) => ({
        value: item.code,
        label: item.name,
      }));

  return (
    <div className="oncontentbox full">
      <Popup title={popupTitle} onClose={handleClose}>
        <div className="oncontent ontable-form member-interest-popup">
          <div className="ontableBox">
            <h4>관심정보</h4>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>관심분야</td>
                  <td>
                    {renderCheckOptions(
                      '1',
                      commonCodeOptions.supportField,
                      COMMON_CODE_GROUPS.supportField,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>지원유형</td>
                  <td>
                    {renderCheckOptions(
                      '2',
                      commonCodeOptions.businessType,
                      COMMON_CODE_GROUPS.businessType,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontableBox">
            <h4>기업정보</h4>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>기업규모</td>
                  <td>
                    {renderCheckOptions(
                      '3',
                      commonCodeOptions.companySize,
                      COMMON_CODE_GROUPS.companySize,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>업종</td>
                  <td>
                    <div className="oncheckBox" />
                  </td>
                </tr>
                <tr>
                  <td>업력</td>
                  <td>
                    {renderCheckOptions(
                      '5',
                      commonCodeOptions.businessAge,
                      COMMON_CODE_GROUPS.businessAge,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>근로자수</td>
                  <td>
                    {renderCheckOptions(
                      '6',
                      commonCodeOptions.employeeCount,
                      COMMON_CODE_GROUPS.employeeCount,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>매출액</td>
                  <td>
                    {renderCheckOptions(
                      '7',
                      commonCodeOptions.sales,
                      COMMON_CODE_GROUPS.sales,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>소재지</td>
                  <td>
                    <div className="oncheckBox">
                      <MenuInputBox
                        menuType="select"
                        inputId="interest-sido"
                        menuSize="150px"
                        options={sidoOptions}
                        showAllOption
                        value={selectedSidoCd}
                        onChange={handleSidoChange}
                        disabled={readOnly || saving}
                      />
                      <MenuInputBox
                        menuType="select"
                        inputId="interest-sigungu"
                        menuSize="150px"
                        options={sigunguOptions}
                        showAllOption={!sigunguLoading}
                        value={selectedSigunguCd}
                        onChange={handleSigunguChange}
                        disabled={readOnly || saving || !selectedSidoCd || sigunguLoading}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>인증</td>
                  <td>
                    {renderCheckOptions(
                      '9',
                      commonCodeOptions.certification,
                      COMMON_CODE_GROUPS.certification,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="btns">
          <Button btnType="list" btnNames="닫기" onClick={handleClose} disabled={saving} />
          {!readOnly ? (
            <Button btnType="add" btnNames="저장" onClick={handleSave} disabled={saving} />
          ) : null}
        </div>
      </Popup>
    </div>
  );
}

MemberItrstFldPopup.propTypes = {
  member: PropTypes.shape({
    mbrNo: PropTypes.string,
    lgnId: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
