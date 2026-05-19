import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import { SUPPORT_BUSINESS_RELATED_ANNOUNCEMENT_TYPES } from '@pages/public-announcement/publicAnnouncementType.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';

const LIST_PATH = '/sprtBiz/bizPbanc/bizInfo';
const CANDIDATE_PAGE_SIZE = 20;

const COMMON_CODE_GROUPS = [
  'BIZ_PBANC_CLSF_CD',
  'BIZ_PBANC_SPRT_INST_CD',
  'ENT_LFCY_SE_CD',
  'LFCY_TRGT_ENT_SE_CD',
];

const createInitialForm = () => ({
  sprtBizCrtrYr: String(new Date().getFullYear()),
  sprtBizIndxNm: null,
  sprtBizNm: null,
  sprtBizOtln: null,
  sprtSclCn: null,
  sprtTrgtCn: null,
  sprtExclTrgtCn: null,
  sprtCn: null,
  aplyMthdCn: null,
  srngEvlCn: null,
  aplyPrcsCrsCn: null,
  bizAplySbmsnDcmntCn: null,
  sprtBizInqplCn: null,
  bizPbancClsfCd: '',
  bizPbancSprtInstCd: '',
  entLfcySeCd: null,
  lfcyTrgtEntSeCd: '',
  bfrSprtBizId: null,
  rlsYn: 'Y',
  refMttr: null,
  useYn: 'Y',
});

const REQUIRED_FIELDS = [
  ['sprtBizCrtrYr', '사업연도를 입력하세요.'],
  ['sprtBizNm', '사업명을 입력하세요.'],
  ['bizPbancClsfCd', '사업유형을 선택하세요.'],
  ['bizPbancSprtInstCd', '지원기관을 선택하세요.'],
  ['lfcyTrgtEntSeCd', '기업구분을 선택하세요.'],
];

const toStringValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const toId = (bizPbancNo) => String(bizPbancNo);

export default function SupportBusinessForm() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { sprtBizId } = useParams();
  const isEdit = !!sprtBizId;
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '통합로그인 사이트 목록';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(createInitialForm);
  const [commonCodeOptions, setCommonCodeOptions] = useState({});

  const [relationLoading, setRelationLoading] = useState(false);
  const [relations, setRelations] = useState([]);
  const [originalRelationIds, setOriginalRelationIds] = useState([]);
  const [originalRelationMap, setOriginalRelationMap] = useState({});
  const [pendingAddIds, setPendingAddIds] = useState([]);
  const [pendingRemoveIds, setPendingRemoveIds] = useState([]);
  const [selectedRelationIds, setSelectedRelationIds] = useState([]);

  const [isCandidatePopupOpen, setIsCandidatePopupOpen] = useState(false);
  const [candidateKeyword, setCandidateKeyword] = useState('');
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateHasNext, setCandidateHasNext] = useState(true);
  const [candidateCursor, setCandidateCursor] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const currentRelationIds = useMemo(
    () => new Set(relations.map((item) => toId(item.bizPbancNo))),
    [relations]
  );
  const originalRelationIdSet = useMemo(
    () => new Set(originalRelationIds),
    [originalRelationIds]
  );
  const bizTypeOptions = commonCodeOptions.BIZ_PBANC_CLSF_CD || [];
  const supportInstOptions = commonCodeOptions.BIZ_PBANC_SPRT_INST_CD || [];
  const enterpriseTypeOptions = commonCodeOptions.ENT_LFCY_SE_CD || [];
  const targetEntOptions = commonCodeOptions.LFCY_TRGT_ENT_SE_CD || [];

  const mapRelationRows = (list) =>
    list.map((item, idx) => ({ ...item, _rowIndex: idx + 1 }));

  const relationColumns = [
    {
      id: 'selected',
      header: '선택',
      width: 70,
      cell: ({ row }) => {
        const relationId = toId(row?.bizPbancNo);
        return (
          <CheckBox
            chkId={`relation-check-${relationId}`}
            value={relationId}
            checked={selectedRelationIds.includes(relationId)}
            onChange={({ checked }) =>
              setSelectedRelationIds((prev) => {
                if (checked) {
                  return prev.includes(relationId)
                    ? prev
                    : [...prev, relationId];
                }
                return prev.filter((id) => id !== relationId);
              })
            }
          />
        );
      },
    },
    {
      id: 'bizPbancNo',
      header: '공고명',
      width: 1300,
      cell: ({ row }) => row?.bizPbancNm || row?.bizPbancNo || '-',
    },
    {
      id: 'ccrncVlCn',
      header: '유사율',
      width: 180,
      cell: ({ row }) => row?.ccrncVlCn || '-',
    },
  ];

  const candidateAddActionCell = createGridValueActionCell({
    getValue: () => '추가',
    fallback: '추가',
    onClick: (row) => stageAddRelation(row),
    variant: 'button',
    className: 'defaultbutton add',
  });

  const candidateColumns = [
    {
      id: 'rowNumber',
      header: '번호',
      width: 70,
      cell: ({ row }) => row?._rowIndex || '-',
    },
    { id: 'bizPbancNo', header: '공고번호', width: 120 },
    { id: 'bizPbancNm', header: '공고명', width: 360 },
    { id: 'pbancYmdNm', header: '진행상태', width: 110 },
    {
      id: 'add',
      header: '관리',
      width: 90,
      cell: candidateAddActionCell,
    },
  ];

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const focusById = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  const validate = () => {
    for (const [key, message] of REQUIRED_FIELDS) {
      const value = toStringValue(form[key]).trim();
      if (!value) {
        alert(message);
        focusById(key);
        return false;
      }
    }
    return true;
  };

  const buildPayload = () => ({
    sprtBizCrtrYr: toStringValue(form.sprtBizCrtrYr).trim(),
    sprtBizIndxNm: toStringValue(form.sprtBizIndxNm).trim(),
    sprtBizNm: toStringValue(form.sprtBizNm).trim(),
    sprtBizOtln: toStringValue(form.sprtBizOtln).trim(),
    sprtSclCn: toStringValue(form.sprtSclCn).trim(),
    sprtTrgtCn: toStringValue(form.sprtTrgtCn).trim(),
    sprtExclTrgtCn: toStringValue(form.sprtExclTrgtCn).trim(),
    sprtCn: toStringValue(form.sprtCn).trim(),
    aplyMthdCn: toStringValue(form.aplyMthdCn).trim(),
    srngEvlCn: toStringValue(form.srngEvlCn).trim(),
    aplyPrcsCrsCn: toStringValue(form.aplyPrcsCrsCn).trim(),
    bizAplySbmsnDcmntCn: toStringValue(form.bizAplySbmsnDcmntCn).trim(),
    sprtBizInqplCn: toStringValue(form.sprtBizInqplCn).trim(),
    bizPbancClsfCd: toStringValue(form.bizPbancClsfCd).trim(),
    bizPbancSprtInstCd: toStringValue(form.bizPbancSprtInstCd).trim(),
    entLfcySeCd: toStringValue(form.entLfcySeCd).trim(),
    lfcyTrgtEntSeCd: toStringValue(form.lfcyTrgtEntSeCd).trim(),
    bfrSprtBizId: toStringValue(form.bfrSprtBizId).trim(),
    rlsYn: toStringValue(form.rlsYn).trim() || 'Y',
    refMttr: toStringValue(form.refMttr).trim(),
    useYn: toStringValue(form.useYn).trim() || 'Y',
  });

  const fetchRelations = async () => {
    if (!isEdit || !sprtBizId) return;

    setRelationLoading(true);
    try {
      const res = await http.get(
        `/api/v1/support-business/${sprtBizId}/public-announcements`
      );
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      setRelations(mapRelationRows(list));
      setOriginalRelationIds(list.map((item) => toId(item.bizPbancNo)));
      setOriginalRelationMap(
        list.reduce((acc, item) => {
          acc[toId(item.bizPbancNo)] = item;
          return acc;
        }, {})
      );
      setPendingAddIds([]);
      setPendingRemoveIds([]);
    } catch (error) {
      console.error('연관 사업공고 조회 실패:', error);
      setRelations([]);
      setOriginalRelationIds([]);
      setOriginalRelationMap({});
      setPendingAddIds([]);
      setPendingRemoveIds([]);
    } finally {
      setRelationLoading(false);
    }
  };

  const fetchCandidates = async (reset = true) => {
    if (candidateLoading) return;
    if (!reset && !candidateHasNext) return;

    setCandidateLoading(true);
    try {
      const params = {
        size: CANDIDATE_PAGE_SIZE,
        bizPbancNm: candidateKeyword.trim(),
        bizPbancTypeCd: SUPPORT_BUSINESS_RELATED_ANNOUNCEMENT_TYPES,
      };
      if (!reset && candidateCursor) {
        params.cursor = candidateCursor;
      }
      const res =
        isEdit && sprtBizId
          ? await http.get(
              `/api/v1/support-business/${sprtBizId}/public-announcements/candidates`,
              {
                params,
              }
            )
          : await http.get('/api/v1/public-announcement', { params });

      const page = res?.data ?? res ?? {};
      const fromApi = Array.isArray(page?.data) ? page.data : [];

      const removedFromExisting =
        reset && isEdit
          ? pendingRemoveIds
              .map((id) => originalRelationMap[id])
              .filter(Boolean)
              .map((item) => ({
                bizPbancNo: item.bizPbancNo,
                bizPbancNm: item.bizPbancNm,
                pbancYmdNm: '',
              }))
          : [];

      const merged = [...removedFromExisting, ...fromApi];
      setCandidates((prev) => {
        const base = reset
          ? []
          : prev.map((item) => {
              const nextItem = { ...item };
              delete nextItem._rowIndex;
              return nextItem;
            });
        const next = [...base];
        const seen = new Set(base.map((item) => toId(item.bizPbancNo)));

        merged.forEach((item) => {
          const id = toId(item.bizPbancNo);
          if (!id || seen.has(id)) return;
          if (currentRelationIds.has(id)) return;
          seen.add(id);
          next.push(item);
        });

        return mapRelationRows(next);
      });

      setCandidateHasNext(Boolean(page?.hasNext));
      setCandidateCursor(page?.nextCursor ?? null);
    } catch (error) {
      console.error('연관 가능 사업공고 조회 실패:', error);
      if (reset) {
        setCandidates([]);
      }
      setCandidateHasNext(false);
      setCandidateCursor(null);
    } finally {
      setCandidateLoading(false);
    }
  };

  const handleCandidateScroll = (e) => {
    if (candidateLoading || !candidateHasNext) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 80) {
      fetchCandidates(false);
    }
  };

  const stageAddRelation = (candidate) => {
    const id = toId(candidate?.bizPbancNo);
    if (!id || currentRelationIds.has(id)) return;

    const relationRow = {
      bizPbancNo: candidate.bizPbancNo,
      bizPbancNm: candidate.bizPbancNm,
      bizAplyBgngYmd: candidate.bizAplyBgngYmd || '',
      bizAplyDdlnYmd: candidate.bizAplyDdlnYmd || '',
      bizPbancRlsSttsCd: candidate.bizPbancRlsSttsCd || '',
      ccrncVlCn: '직접선택',
    };

    setRelations((prev) => mapRelationRows([...prev, relationRow]));
    setCandidates((prev) =>
      mapRelationRows(prev.filter((item) => toId(item.bizPbancNo) !== id))
    );

    setPendingRemoveIds((prev) => prev.filter((target) => target !== id));
    if (!originalRelationIdSet.has(id)) {
      setPendingAddIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const stageRemoveRelation = (bizPbancNo) => {
    const id = toId(bizPbancNo);
    const target = relations.find((item) => toId(item.bizPbancNo) === id);
    if (!target) return;

    setRelations((prev) =>
      mapRelationRows(prev.filter((item) => toId(item.bizPbancNo) !== id))
    );

    setPendingAddIds((prev) => prev.filter((targetId) => targetId !== id));
    setSelectedRelationIds((prev) =>
      prev.filter((targetId) => targetId !== id)
    );
    if (originalRelationIdSet.has(id)) {
      setPendingRemoveIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }

    setCandidates((prev) => {
      if (prev.some((item) => toId(item.bizPbancNo) === id)) return prev;
      const next = [
        {
          bizPbancNo: target.bizPbancNo,
          bizPbancNm: target.bizPbancNm,
          pbancYmdNm: '',
        },
        ...prev,
      ];
      return mapRelationRows(next);
    });
  };

  const handleDeleteSelectedRelations = () => {
    if (selectedRelationIds.length === 0) {
      alert('삭제할 연관 사업공고를 선택하세요.');
      return;
    }

    if (!window.confirm('선택한 연관 사업공고를 삭제하시겠습니까?')) return;

    selectedRelationIds.forEach((id) => stageRemoveRelation(id));
    setSelectedRelationIds([]);
  };

  const applyRelationChanges = async (targetSprtBizId) => {
    for (const id of pendingAddIds) {
      await http.post(
        `/api/v1/support-business/${targetSprtBizId}/public-announcements`,
        {
          bizPbancNo: Number(id),
          ccrncVlCn: '직접선택',
        }
      );
    }

    for (const id of pendingRemoveIds) {
      await http.post(
        `/api/v1/support-business/delete/${targetSprtBizId}/public-announcements/${id}`
      );
    }
  };

  const handleOpenCandidatePopup = async () => {
    setIsCandidatePopupOpen(true);
    await fetchCandidates(true);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!validate()) return;
    if (!window.confirm('저장하시겠습니까?')) return;

    setSaving(true);
    try {
      const payload = buildPayload();

      if (isEdit) {
        await http.post(`/api/v1/support-business/update/${sprtBizId}`, payload);
        await applyRelationChanges(sprtBizId);
        alert('지원사업이 수정되었습니다.');
        navigate(LIST_PATH);
      } else {
        const created = await http.post('/api/v1/support-business', payload);
        const createdData = created?.data ?? created;
        const createdId = createdData?.sprtBizId;

        if (createdId) {
          await applyRelationChanges(createdId);
          alert('지원사업이 등록되었습니다.');
          navigate(LIST_PATH);
          return;
        }

        alert('지원사업이 등록되었습니다.');
        navigate(LIST_PATH);
      }
    } catch (error) {
      console.error('지원사업 저장 실패:', error);
      alert('지원사업 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const codes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUPS);
        setCommonCodeOptions(codes || {});
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
        setCommonCodeOptions({});
      }
    };

    loadCommonCodes();
  }, []);

  useEffect(() => {
    if (isEdit) return;
    setForm((prev) => ({
      ...prev,
      bizPbancClsfCd: prev.bizPbancClsfCd || bizTypeOptions[0]?.value || '',
      bizPbancSprtInstCd:
        prev.bizPbancSprtInstCd || supportInstOptions[0]?.value || '',
      entLfcySeCd: prev.entLfcySeCd || enterpriseTypeOptions[0]?.value || '',
      lfcyTrgtEntSeCd: prev.lfcyTrgtEntSeCd || targetEntOptions[0]?.value || '',
    }));
  }, [
    bizTypeOptions,
    enterpriseTypeOptions,
    isEdit,
    supportInstOptions,
    targetEntOptions,
  ]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!isEdit) return;

      setLoading(true);
      try {
        const res = await http.get(`/api/v1/support-business/${sprtBizId}`);
        const detail = res?.data ?? res;
        if (!detail) {
          alert('조회된 데이터가 없습니다.');
          navigate(LIST_PATH);
          return;
        }

        setForm({
          ...createInitialForm(),
          ...detail,
          sprtBizCrtrYr: toStringValue(detail.sprtBizCrtrYr),
        });
      } catch (error) {
        console.error('지원사업 상세 조회 실패:', error);
        alert('지원사업 상세 조회 중 오류가 발생했습니다.');
        navigate(LIST_PATH);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isEdit, navigate, sprtBizId]);

  useEffect(() => {
    if (!isEdit || !sprtBizId) return;
    fetchRelations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, sprtBizId]);

  useEffect(() => {
    const relationIdSet = new Set(
      relations.map((item) => toId(item.bizPbancNo))
    );
    setSelectedRelationIds((prev) =>
      prev.filter((selectedId) => relationIdSet.has(selectedId))
    );
  }, [relations]);

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
                  <td>사업ID</td>
                  <td>{sprtBizId || '-'}</td>
                  <td>사업연도</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      inputId="sprtBizCrtrYr"
                      menuSize="120px"
                      value={form.sprtBizCrtrYr}
                      onChange={(e) => handleInputChange('sprtBizCrtrYr', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사업유형</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      inputId="bizPbancClsfCd"
                      menuSize="180px"
                      showAllOption={false}
                      options={bizTypeOptions}
                      value={form.bizPbancClsfCd}
                      onChange={(e) => handleInputChange('bizPbancClsfCd', e)}
                    />
                  </td>
                  <td>지원기관</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      inputId="bizPbancSprtInstCd"
                      menuSize="220px"
                      showAllOption={false}
                      options={supportInstOptions}
                      value={form.bizPbancSprtInstCd}
                      onChange={(e) =>
                        handleInputChange('bizPbancSprtInstCd', e)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>기업유형</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      inputId="entLfcySeCd"
                      menuSize="180px"
                      options={enterpriseTypeOptions}
                      value={form.entLfcySeCd}
                      onChange={(e) => handleInputChange('entLfcySeCd', e)}
                    />
                  </td>
                  <td>기업구분</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      inputId="lfcyTrgtEntSeCd"
                      menuSize="180px"
                      showAllOption={false}
                      options={targetEntOptions}
                      value={form.lfcyTrgtEntSeCd}
                      onChange={(e) => handleInputChange('lfcyTrgtEntSeCd', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>공개여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="rlsYn_Y"
                        radioGroup="rlsYn"
                        radioValue="Y"
                        radioName="공개"
                        selectedValue={form.rlsYn}
                        onChange={(v) => handleInputChange('rlsYn', v)}
                      />
                      <RadioButton
                        groupId="rlsYn_N"
                        radioGroup="rlsYn"
                        radioValue="N"
                        radioName="비공개"
                        selectedValue={form.rlsYn}
                        onChange={(v) => handleInputChange('rlsYn', v)}
                      />
                    </div>
                  </td>
                  <td>사업색인명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      inputId="sprtBizIndxNm"
                      menuSize="300px"
                      value={form.sprtBizIndxNm}
                      onChange={(e) => handleInputChange('sprtBizIndxNm', e)}
                    />
                    <span className="onsubinfo">
                      ※ 엑셀파일의 POLICY_INDEX를 입력해 주세요.
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업정보</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>사업명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      inputId="sprtBizNm"
                      menuSize="100%"
                      value={form.sprtBizNm}
                      onChange={(e) => handleInputChange('sprtBizNm', e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사업개요</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtBizOtln}
                      onChange={(v) => handleInputChange('sprtBizOtln', v)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업개요</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>지원규모</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtSclCn}
                      onChange={(v) => handleInputChange('sprtSclCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtTrgtCn}
                      onChange={(v) => handleInputChange('sprtTrgtCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원제외대상</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtExclTrgtCn}
                      onChange={(v) => handleInputChange('sprtExclTrgtCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지원내용</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtCn}
                      onChange={(v) => handleInputChange('sprtCn', v)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">신청절차</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>신청방법</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.aplyMthdCn}
                      onChange={(v) => handleInputChange('aplyMthdCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>심사평가</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.srngEvlCn}
                      onChange={(v) => handleInputChange('srngEvlCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>신청처리과정</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.aplyPrcsCrsCn}
                      onChange={(v) => handleInputChange('aplyPrcsCrsCn', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>제출서류</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.bizAplySbmsnDcmntCn}
                      onChange={(v) =>
                        handleInputChange('bizAplySbmsnDcmntCn', v)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>참고사항</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.refMttr}
                      onChange={(v) => handleInputChange('refMttr', v)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">문의처</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>문의처</td>
                  <td>
                    <RichEditor
                      theme="light"
                      value={form.sprtBizInqplCn}
                      onChange={(v) => handleInputChange('sprtBizInqplCn', v)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">관련 사업공고</h4>
          <div className="ontable-legend">
            <span>
              총 <b>{relations.length}</b>건
            </span>
            <div
              className="onbtn"
              style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}
            >
              <Button
                btnType="add"
                btnNames="직접추가"
                onClick={handleOpenCandidatePopup}
              />
              <Button
                btnType="del"
                btnNames="삭제"
                onClick={handleDeleteSelectedRelations}
              />
            </div>
          </div>
          <div className="ongrid-tableform">
            <GridTable data={relations} columns={relationColumns} />
          </div>

          {(relationLoading || saving) && (
            <div className="loading" style={{ marginTop: '12px' }}>
              데이터를 처리 중입니다.
            </div>
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
          {/*{isEdit && (*/}
          {/*  <Button*/}
          {/*    btnType="del"*/}
          {/*    btnNames="삭제"*/}
          {/*    onClick={handleDelete}*/}
          {/*    disabled={saving}*/}
          {/*  />*/}
          {/*)}*/}
          <Button
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>

      {isCandidatePopupOpen && (
        <Popup
          title="연관 가능 사업공고"
          autoHeight={true}
          onClose={() => setIsCandidatePopupOpen(false)}
        >
          <div className="oncontent support-business-candidate-popup">
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              <div className="onparagraph">
                <MenuInputBox
                  menuType="input"
                  menuName="공고명"
                  menuSize="300px"
                  value={candidateKeyword}
                  onChange={(e) => setCandidateKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    fetchCandidates(true);
                  }}
                />
                <div className="onbtn" style={{ marginLeft: 'auto' }}>
                  <Button
                    btnType="menuSearch"
                    btnNames="검색"
                    onClick={() => fetchCandidates(true)}
                    disabled={candidateLoading}
                  />
                </div>
              </div>
            </div>

            <div
              className="candidate-grid-scroll"
              onScroll={handleCandidateScroll}
            >
              <div className="ongrid-tableform">
                <GridTable data={candidates} columns={candidateColumns} />
              </div>
            </div>

            {/*{candidateLoading && (*/}
            {/*  <div className="loading" style={{ marginTop: '12px' }}>*/}
            {/*    연관 가능 사업공고를 조회 중입니다.*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
          <div className="btns">
            <Button
              btnType="del"
              btnNames="닫기"
              onClick={() => setIsCandidatePopupOpen(false)}
            />
          </div>
        </Popup>
      )}
      <style>
        {`
          .support-business-candidate-popup .candidate-grid-scroll {
            max-height: 420px;
            overflow-y: auto;
            overflow-x: auto;
          }
          .support-business-candidate-popup .candidate-grid-scroll .ongrid-tableform {
            min-width: 760px;
          }
        `}
      </style>
    </div>
  );
}
