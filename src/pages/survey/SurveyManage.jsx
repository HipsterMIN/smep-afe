import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import DatepickerBox from '../../components/ui/DatepickerBox.jsx';
import GridCellActionButton from '../../components/ui/GridCellActionButton.jsx';
import GridTable from '../../components/ui/GridTable.jsx';
import MenuInputBox from '../../components/ui/MenuInputBox.jsx';
import Popup from '../../components/ui/Popup.jsx';
import http from '../../lib/http.js';

const QUESTION_TYPE_OPTIONS = [
  { label: '객관식', value: 'MLCH' },
  { label: '주관식', value: 'SBJV' },
];

const ANSWER_REQUIRED_OPTIONS = [
  { label: '필수', value: 'Y' },
  { label: '선택', value: 'N' },
];

const unwrapApiResponse = (payload) => {
  if (
    payload &&
    typeof payload === 'object' &&
    Object.prototype.hasOwnProperty.call(payload, 'success') &&
    Object.prototype.hasOwnProperty.call(payload, 'data')
  ) {
    return payload.data;
  }
  return payload;
};

const createClientId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const questionTypeLabel = (code) => {
  if (code === 'MLCH') return '객관식';
  if (code === 'SBJV') return '주관식';
  if (code === 'ASCT') return '조합(복합)형';
  return code || '-';
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
};

const resolveApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  const candidates = [
    responseData?.message,
    responseData?.error?.message,
    responseData?.data?.message,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return fallbackMessage;
};

const resequenceItems = (items = []) => {
  let seq = 1;
  return items.map((item) => {
    if (item.useYn === 'N') {
      return item;
    }
    const nextItem = { ...item, sortSeq: seq };
    seq += 1;
    return nextItem;
  });
};

const normalizeQuestionSortSeq = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const createEmptyQuestion = (sortSeq) => ({
  clientId: createClientId(),
  qstnNo: null,
  sortSeq,
  qstnAnsTypeCd: 'MLCH',
  qstnCn: '',
  ansMaxChcNocs: 1,
  ansEsntlYn: 'Y',
  scorTrgtYn: 'N',
  scorScr: 0,
  useYn: 'Y',
  items: [
    {
      clientId: createClientId(),
      qitemNo: null,
      sortSeq: 1,
      qitemNm: '',
      qitemExpln: '',
      scorScr: 0,
      nxtQstnNo: null,
      useYn: 'Y',
    },
    {
      clientId: createClientId(),
      qitemNo: null,
      sortSeq: 2,
      qitemNm: '',
      qitemExpln: '',
      scorScr: 0,
      nxtQstnNo: null,
      useYn: 'Y',
    },
  ],
});

function SurveyQuestionManageActionCell({ row, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
      <GridCellActionButton
        variant="button"
        className="defaultbutton edit"
        title="문항 수정"
        onClick={() => onEdit(row)}
      >
        수정
      </GridCellActionButton>
      <GridCellActionButton
        variant="button"
        className="defaultbutton btn small del"
        title="문항 삭제"
        onClick={() => onDelete(row)}
      >
        삭제
      </GridCellActionButton>
    </div>
  );
}

export default function SurveyManage() {
  const navigate = useNavigate();
  const { surveyNo } = useParams();

  const isCreateMode = !surveyNo;

  const [srvyTtl, setSrvyTtl] = useState('');
  const [srvyBgngYmd, setSrvyBgngYmd] = useState('');
  const [srvyEndYmd, setSrvyEndYmd] = useState('');

  const [rgtrId, setRgtrId] = useState('');
  const [regDt, setRegDt] = useState('');
  const [mdfrId, setMdfrId] = useState('');
  const [mdfcnDt, setMdfcnDt] = useState('');

  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const visibleQuestions = useMemo(
    () =>
      questions
        .filter((question) => question.useYn !== 'N')
        .map((question, index) => ({ question, index }))
        .sort((left, right) => {
          const leftSeq = normalizeQuestionSortSeq(
            left.question.sortSeq,
            left.index + 1
          );
          const rightSeq = normalizeQuestionSortSeq(
            right.question.sortSeq,
            right.index + 1
          );

          if (leftSeq === rightSeq) {
            return left.index - right.index;
          }
          return leftSeq - rightSeq;
        })
        .map(({ question }) => question),
    [questions]
  );

  const loadDetail = useCallback(async () => {
    if (isCreateMode) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await http.get(`/api/v1/admin/surveys/${surveyNo}`);
      const detail = unwrapApiResponse(response);

      setSrvyTtl(detail?.srvyTtl || '');
      setSrvyBgngYmd(detail?.srvyBgngYmd || '');
      setSrvyEndYmd(detail?.srvyEndYmd || '');
      setRgtrId(detail?.rgtrId || '');
      setRegDt(detail?.regDt || '');
      setMdfrId(detail?.mdfrId || '');
      setMdfcnDt(detail?.mdfcnDt || '');

      const loadedQuestions = Array.isArray(detail?.questions)
        ? detail.questions.map((question) => ({
            clientId: createClientId(),
            qstnNo: question.qstnNo ?? null,
            sortSeq: question.sortSeq ?? 1,
            qstnAnsTypeCd: question.qstnAnsTypeCd || 'MLCH',
            qstnCn: question.qstnCn || '',
            ansMaxChcNocs: question.ansMaxChcNocs ?? 1,
            ansEsntlYn: question.ansEsntlYn || 'Y',
            scorTrgtYn: question.scorTrgtYn || 'N',
            scorScr: question.scorScr ?? 0,
            useYn: question.useYn || 'Y',
            rgtrId: question.rgtrId || '',
            regDt: question.regDt || '',
            mdfrId: question.mdfrId || '',
            mdfcnDt: question.mdfcnDt || '',
            items: Array.isArray(question.items)
              ? question.items.map((item) => ({
                  clientId: createClientId(),
                  qitemNo: item.qitemNo ?? null,
                  sortSeq: item.sortSeq ?? 1,
                  qitemNm: item.qitemNm || '',
                  qitemExpln: item.qitemExpln || '',
                  scorScr: item.scorScr ?? 0,
                  nxtQstnNo: item.nxtQstnNo ?? null,
                  useYn: item.useYn || 'Y',
                }))
              : [],
          }))
        : [];

      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('설문 상세 조회 실패', error);
      alert('설문 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isCreateMode, surveyNo]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const openQuestionCreatePopup = () => {
    setEditingQuestion(createEmptyQuestion(visibleQuestions.length + 1));
    setIsPopupOpen(true);
  };

  const openQuestionEditPopup = (question) => {
    const clonedQuestion = {
      ...question,
      items: (question.items || []).map((item) => ({ ...item })),
    };
    setEditingQuestion(clonedQuestion);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingQuestion(null);
  };

  const handleQuestionDelete = (question) => {
    if (!window.confirm('해당 문항을 삭제하시겠습니까?')) {
      return;
    }

    setQuestions((prev) => {
      if (!question.qstnNo) {
        return prev.filter((item) => item.clientId !== question.clientId);
      }

      return prev.map((item) =>
        item.clientId === question.clientId ? { ...item, useYn: 'N' } : item
      );
    });
  };

  const handlePopupQuestionChange = (field, value) => {
    setEditingQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handlePopupItemChange = (clientId, field, value) => {
    setEditingQuestion((prev) => ({
      ...prev,
      items: (prev.items || []).map((item) =>
        item.clientId === clientId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handlePopupItemAdd = () => {
    setEditingQuestion((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          clientId: createClientId(),
          qitemNo: null,
          sortSeq:
            (prev.items || []).filter((item) => item.useYn !== 'N').length + 1,
          qitemNm: '',
          qitemExpln: '',
          scorScr: 0,
          nxtQstnNo: null,
          useYn: 'Y',
        },
      ],
    }));
  };

  const handlePopupItemDelete = (item) => {
    setEditingQuestion((prev) => {
      const items = prev.items || [];

      if (!item.qitemNo) {
        return {
          ...prev,
          items: resequenceItems(
            items.filter((target) => target.clientId !== item.clientId)
          ),
        };
      }

      return {
        ...prev,
        items: resequenceItems(
          items.map((target) =>
            target.clientId === item.clientId
              ? { ...target, useYn: 'N' }
              : target
          )
        ),
      };
    });
  };

  const savePopupQuestion = () => {
    if (!editingQuestion) {
      return;
    }

    const requestedSortSeq = Number.parseInt(editingQuestion.sortSeq, 10);
    if (!Number.isInteger(requestedSortSeq) || requestedSortSeq < 1) {
      alert('순번은 1 이상의 숫자로 입력해주세요.');
      return;
    }

    const qstnCn = (editingQuestion.qstnCn || '').trim();
    if (!qstnCn) {
      alert('질문 내용을 입력해주세요.');
      return;
    }

    const isObjective = editingQuestion.qstnAnsTypeCd === 'MLCH';
    const activeItems = (editingQuestion.items || []).filter(
      (item) => item.useYn !== 'N'
    );

    if (isObjective) {
      if (activeItems.length < 2) {
        alert('객관식 문항은 최소 2개 이상의 선택항목이 필요합니다.');
        return;
      }

      for (const item of activeItems) {
        if (!(item.qitemNm || '').trim()) {
          alert('선택항목 내용을 입력해주세요.');
          return;
        }
      }

      const maxChoice = Number(editingQuestion.ansMaxChcNocs || 1);
      if (maxChoice < 1 || maxChoice > activeItems.length) {
        alert('최대선택건수를 확인해주세요.');
        return;
      }
    }

    const nextQuestion = {
      ...editingQuestion,
      sortSeq: requestedSortSeq,
      qstnCn,
      ansMaxChcNocs: isObjective
        ? Number(editingQuestion.ansMaxChcNocs || 1)
        : null,
      items: resequenceItems(editingQuestion.items || []),
      useYn: editingQuestion.useYn || 'Y',
    };

    setQuestions((prev) => {
      const index = prev.findIndex(
        (question) => question.clientId === nextQuestion.clientId
      );
      const nextQuestions = [...prev];

      if (index >= 0) {
        nextQuestions[index] = nextQuestion;
      } else {
        nextQuestions.push(nextQuestion);
      }
      return nextQuestions;
    });

    closePopup();
  };

  const buildQuestionPayload = () => {
    const activeQuestions = questions.filter((question) => question.useYn !== 'N');

    const activePayload = activeQuestions.map((question) => {
      const isObjective = question.qstnAnsTypeCd === 'MLCH';
      const activeItems = resequenceItems(
        (question.items || []).filter((item) => item.useYn !== 'N')
      );
      const deletedSavedItems = (question.items || []).filter(
        (item) => item.useYn === 'N' && item.qitemNo
      );

      const items = isObjective
        ? [
            ...activeItems.map((item, itemIndex) => ({
              qitemNo: item.qitemNo,
              sortSeq: itemIndex + 1,
              qitemNm: (item.qitemNm || '').trim(),
              qitemExpln: item.qitemExpln || null,
              scorScr: Number(item.scorScr || 0),
              nxtQstnNo: item.nxtQstnNo || null,
              useYn: 'Y',
            })),
            ...deletedSavedItems.map((item) => ({
              qitemNo: item.qitemNo,
              useYn: 'N',
            })),
          ]
        : [];

      return {
        qstnNo: question.qstnNo,
        sortSeq: normalizeQuestionSortSeq(question.sortSeq, 1),
        qstnAnsTypeCd: question.qstnAnsTypeCd,
        qstnCn: (question.qstnCn || '').trim(),
        ansEsntlYn: question.ansEsntlYn || 'Y',
        ansMaxChcNocs: isObjective ? Number(question.ansMaxChcNocs || 1) : null,
        scorTrgtYn: question.scorTrgtYn || 'N',
        scorScr: Number(question.scorScr || 0),
        useYn: 'Y',
        items,
      };
    });

    const deletedQuestionPayload = questions
      .filter((question) => question.useYn === 'N' && question.qstnNo)
      .map((question) => ({
        qstnNo: question.qstnNo,
        useYn: 'N',
      }));

    return [...activePayload, ...deletedQuestionPayload];
  };

  const handleSave = async () => {
    if (!srvyTtl.trim()) {
      alert('설문제목을 입력해주세요.');
      return;
    }

    if (!srvyBgngYmd || !srvyEndYmd) {
      alert('설문기간을 입력해주세요.');
      return;
    }

    if (srvyBgngYmd > srvyEndYmd) {
      alert('설문기간을 확인해주세요.');
      return;
    }

    const payload = {
      srvyTtl: srvyTtl.trim(),
      srvyBgngYmd,
      srvyEndYmd,
      useYn: 'Y',
      questions: buildQuestionPayload(),
    };

    setIsSaving(true);
    try {
      if (isCreateMode) {
        await http.post('/api/v1/admin/surveys', payload);
      } else {
        await http.put(`/api/v1/admin/surveys/${surveyNo}`, payload);
      }

      alert('저장되었습니다.');
      navigate('..');
    } catch (error) {
      console.error('설문 저장 실패', error);
      alert(resolveApiErrorMessage(error, '설문 저장 중 오류가 발생했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSurvey = async () => {
    if (isCreateMode) {
      return;
    }

    if (!window.confirm('설문지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await http.delete(`/api/v1/admin/surveys/${surveyNo}`);
      alert('삭제되었습니다.');
      navigate('..');
    } catch (error) {
      console.error('설문 삭제 실패', error);
      alert('설문 삭제 중 오류가 발생했습니다.');
    }
  };

  const questionColumns = [
    { id: 'sortSeq', header: '순번', width: 70, dataAlign: 'height-center' },
    { id: 'qstnNo', header: '문항 ID', width: 90, dataAlign: 'height-center' },
    {
      id: 'qstnAnsTypeCd',
      header: '질문유형',
      width: 100,
      cell: ({ row }) => questionTypeLabel(row.qstnAnsTypeCd),
      dataAlign: 'height-center',
    },
    {
      id: 'qstnCn',
      header: '질문내용',
      flexgrow: 1,
      dataAlign: 'height-center',
    },
    {
      id: 'qitemNm',
      header: '선택항목',
      width: 220,
      cell: ({ row }) => {
        const items = (row.items || []).filter((item) => item.useYn !== 'N');
        if (items.length === 0) return '-';

        return (
          <div
            style={{
              whiteSpace: 'pre-line',
              textAlign: 'left',
              lineHeight: '1.4',
            }}
          >
            {items.map((item) => item.qitemNm).join('\n')}
          </div>
        );
      },
    },
    { id: 'mdfrId', header: '수정자', width: 100, dataAlign: 'height-center' },
    {
      id: 'mdfcnDt',
      header: '수정일시',
      width: 150,
      cell: ({ row }) => formatDateTime(row.mdfcnDt),
      dataAlign: 'height-center',
    },
    {
      id: 'management',
      header: '관리',
      width: 140,
      cell: ({ row }) => (
        <SurveyQuestionManageActionCell
          row={row}
          onEdit={openQuestionEditPopup}
          onDelete={handleQuestionDelete}
        />
      ),
    },
  ];

  const popupActiveItems = (editingQuestion?.items || []).filter(
    (item) => item.useYn !== 'N'
  );
  const popupMaxChoiceOptions = popupActiveItems.map((_, index) => ({
    label: String(index + 1),
    value: String(index + 1),
  }));

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>설문지 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>설문관리</li>
          <li>설문 목록</li>
          <li className="on">설문지 관리</li>
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
                  <td>설문제목</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={srvyTtl}
                      onChange={(event) => setSrvyTtl(event.target.value)}
                      placeholder="제목을 입력하세요"
                    />
                  </td>
                </tr>
                <tr>
                  <td>설문기간</td>
                  <td colSpan={3}>
                    <div className="ondatepickerbox">
                      <DatepickerBox
                        outputFormat="dash"
                        value={srvyBgngYmd}
                        onChange={setSrvyBgngYmd}
                      />
                      <span className="onunit">~</span>
                      <DatepickerBox
                        outputFormat="dash"
                        value={srvyEndYmd}
                        onChange={setSrvyEndYmd}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td>{rgtrId || '-'}</td>
                  <td>등록일시</td>
                  <td>{formatDateTime(regDt)}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>{mdfrId || '-'}</td>
                  <td>수정일시</td>
                  <td>{formatDateTime(mdfcnDt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns">
            <div style={{ marginRight: 'auto' }}>
              <Button
                btnType="list"
                btnNames="목록"
                onClick={() => navigate('..')}
              />
            </div>
            <Button
              btnType="add"
              btnNames="저장"
              onClick={handleSave}
              disabled={isSaving}
            />
            {!isCreateMode && (
              <Button
                btnType="del"
                btnNames="삭제"
                onClick={handleDeleteSurvey}
              />
            )}
          </div>

          <div className="ontable-legend">
            <h2 className="onsubtitle">설문 문항 목록</h2>
            <Button
              btnType="add"
              btnNames="문항추가"
              onClick={openQuestionCreatePopup}
            />
          </div>

          <div className="ongrid-tableform">
            <GridTable
              data={visibleQuestions}
              columns={questionColumns}
              gridProps={{ autoRowHeight: true }}
            />
          </div>

          {isLoading && (
            <div style={{ marginTop: '12px' }}>조회 중입니다...</div>
          )}
        </div>
      </div>

      {isPopupOpen && editingQuestion && (
        <Popup title="설문 문항 등록/수정" onClose={closePopup}>
          <div className="oncontent ontable-form">
            <div className="ontableBox">
              <table>
                <colgroup>
                  <col style={{ width: '180px' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>순번</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={editingQuestion.sortSeq ?? ''}
                        onChange={(event) =>
                          handlePopupQuestionChange('sortSeq', event.target.value)
                        }
                        style={{
                          width: '120px',
                          border: '1px solid #ddd',
                          padding: '6px',
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>문항 ID</td>
                    <td>{editingQuestion.qstnNo || '-'}</td>
                  </tr>
                  <tr>
                    <td>답변필수여부</td>
                    <td>
                      <MenuInputBox
                        menuType="select"
                        menuSize="180px"
                        showAllOption={false}
                        value={editingQuestion.ansEsntlYn || 'Y'}
                        options={ANSWER_REQUIRED_OPTIONS}
                        onChange={(event) =>
                          handlePopupQuestionChange(
                            'ansEsntlYn',
                            event.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>질문유형</td>
                    <td>
                      <MenuInputBox
                        menuType="select"
                        menuSize="180px"
                        showAllOption={false}
                        value={editingQuestion.qstnAnsTypeCd}
                        options={QUESTION_TYPE_OPTIONS}
                        onChange={(event) =>
                          handlePopupQuestionChange(
                            'qstnAnsTypeCd',
                            event.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>질문내용</td>
                    <td>
                      <textarea
                        value={editingQuestion.qstnCn}
                        onChange={(event) =>
                          handlePopupQuestionChange(
                            'qstnCn',
                            event.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          minHeight: '72px',
                          border: '1px solid #d9d9d9',
                          padding: '8px',
                        }}
                        placeholder="질문 내용을 입력하세요"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>최대선택건수</td>
                    <td>
                      <MenuInputBox
                        menuType="select"
                        menuSize="120px"
                        showAllOption={false}
                        value={String(editingQuestion.ansMaxChcNocs || 1)}
                        options={
                          popupMaxChoiceOptions.length > 0
                            ? popupMaxChoiceOptions
                            : [{ label: '1', value: '1' }]
                        }
                        onChange={(event) =>
                          handlePopupQuestionChange(
                            'ansMaxChcNocs',
                            Number(event.target.value || 1)
                          )
                        }
                        disabled={editingQuestion.qstnAnsTypeCd !== 'MLCH'}
                      />
                    </td>
                  </tr>
                  {editingQuestion.qstnAnsTypeCd === 'MLCH' && (
                    <tr>
                      <td>
                        <div className="flexColumn centerGap">
                          선택항목
                          <Button
                            btnType="add"
                            btnNames="항목추가"
                            onClick={handlePopupItemAdd}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="ontableBox">
                          <table style={{ border: '1px solid #eee' }}>
                            <thead>
                              <tr>
                                <th style={{ width: '70px' }}>순서</th>
                                <th>선택항목</th>
                                <th style={{ width: '90px' }}>관리</th>
                              </tr>
                            </thead>
                            <tbody>
                              {popupActiveItems.map((item, index) => (
                                <tr key={item.clientId}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <input
                                      type="text"
                                      value={item.qitemNm}
                                      onChange={(event) =>
                                        handlePopupItemChange(
                                          item.clientId,
                                          'qitemNm',
                                          event.target.value
                                        )
                                      }
                                      style={{
                                        width: '100%',
                                        border: '1px solid #ddd',
                                        padding: '6px',
                                      }}
                                    />
                                  </td>
                                  <td className="btnsform">
                                    <Button
                                      btnType="del"
                                      btnNames="삭제"
                                      onClick={() =>
                                        handlePopupItemDelete(item)
                                      }
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className="btns"
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Button btnType="list" btnNames="닫기" onClick={closePopup} />
            <Button btnType="add" btnNames="저장" onClick={savePopupQuestion} />
          </div>
        </Popup>
      )}
    </div>
  );
}
