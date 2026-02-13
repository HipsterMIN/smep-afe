import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '../../components/ui/Button';
import MenuInputBox from "../../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../../components/ui/DatepickerBox.jsx";
import GridTable from '../../components/ui/GridTable';
import Popup from '../../components/ui/Popup.jsx';
import RadioButton from '../../components/ui/RadioButton.jsx';
import http from '../../lib/http.js';

export default function SurveyManage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const srvyNo = queryParams.get('srvyNo');
  
  // 설문 마스터 상태
  const [srvyTtl, setSrvyTtl] = useState('');
  const [srvyExpln, setSrvyExpln] = useState('');
  const [bgngYmd, setBgngYmd] = useState(null);
  const [endYmd, setEndYmd] = useState(null);
  const [sttusCd, setSttusCd] = useState('DRAFT');
  const [useYn, setUseYn] = useState('N');
  
  // 문항 목록 상태
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  
  // 팝업 관련 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    qstnCn: '',
    qstnAnsTypeCd: 'SING',
    sortSeq: 1,
    ansEsntlYn: 'Y',
    ansMaxChcNocs: 1,
    scorTrgtYn: 'Y',
    scorScr: 0,
    items: []
  });

  useEffect(() => {
    if (srvyNo) {
      fetchSurveyDetail();
    }
  }, [srvyNo]);

  const fetchSurveyDetail = async () => {
    try {
      const res = await http.get(`/api/v1/surveys/${srvyNo}`, {
        headers: {
          'X-Member-No': '10001'
        }
      });
      const data = res.data?.data;
      if (data) {
        setSrvyTtl(data.srvyTtl || data.srvyNm || data.srvy_ttl || '');
        setSrvyExpln(data.srvyExpln || data.srvy_expln || '');
        
        const rawBgng = data.bgngYmd || data.bgngDt || data.srvy_bgng_ymd;
        const rawEnd = data.endYmd || data.endDt || data.srvy_end_ymd;
        
        setBgngYmd(rawBgng ? new Date(rawBgng) : null);
        setEndYmd(rawEnd ? new Date(rawEnd) : null);
        
        setSttusCd(data.sttusCd || data.sttus_cd || 'DRAFT');
        setUseYn(data.useYn || data.use_yn || 'Y');
        setQuestions(data.questions || data.qstns || []);
      }
    } catch (error) {
      console.error('설문 상세 조회 실패:', error);
      alert('설문 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleAddQuestion = () => {
    setCurrentQuestion({
      qstnCn: '',
      qstnAnsTypeCd: 'SING',
      sortSeq: questions.length + 1,
      ansEsntlYn: 'Y',
      ansMaxChcNocs: 1,
      scorTrgtYn: 'Y',
      scorScr: 0,
      items: []
    });
    setIsPopupOpen(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion({
      ...question,
      items: question.items ? [...question.items] : []
    });
    setIsPopupOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion.qstnCn) {
      alert('질문 내용을 입력하세요.');
      return;
    }
    // 숫자 필드 강제 변환
    const fixedQuestion = {
      ...currentQuestion,
      sortSeq: Number(currentQuestion.sortSeq || 0),
      ansMaxChcNocs: Number(currentQuestion.ansMaxChcNocs || 1),
      scorScr: Number(currentQuestion.scorScr || 0),
    };
    
    // qstnNo나 임시 ID가 있으면 수정, 없으면 추가 (여기서는 index나 qstnNo로 판단 가능)
    // 간단하게 sortSeq나 별도 flag로 처리 가능하지만, 
    // 여기선 qstnNo가 있거나 기존 배열에 같은 객체가 있는지 확인.
    // 더 쉬운 방법: currentQuestion에 index를 잠시 저장.
    
    if (currentQuestion.index !== undefined) {
        const newQuestions = [...questions];
        const { index, ...rest } = fixedQuestion;
        newQuestions[currentQuestion.index] = rest;
        setQuestions(newQuestions);
    } else {
        setQuestions([...questions, fixedQuestion]);
    }
    setIsPopupOpen(false);
  };

  const handleAddItem = () => {
    const newItems = [
      ...currentQuestion.items,
      { qitemNm: '', qitemExpln: '', scorScr: 0, sortSeq: currentQuestion.items.length + 1, nxtQstnNo: null }
    ];
    setCurrentQuestion({ ...currentQuestion, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...currentQuestion.items];
    newItems[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, items: newItems });
  };

  // 날짜 포맷팅 함수 (KST 기준 YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 상태 계산 (Display용)
  const getDisplayStatus = () => {
    if (sttusCd && sttusCd !== 'DRAFT') {
      const mapping = {
        'PUBLISHED': '게시',
        'CLOSED': '마감'
      };
      return mapping[sttusCd] || sttusCd;
    }

    if (useYn === 'N') return '임시저장 (DRAFT)';
    
    const todayStr = formatDate(new Date());
    const bgngStr = bgngYmd ? formatDate(bgngYmd) : '';
    const endStr = endYmd ? formatDate(endYmd) : '';

    if (bgngStr && todayStr < bgngStr) return '대기 (UPCOMING)';
    if (endStr && todayStr > endStr) return '마감 (CLOSED)';
    return '진행중 (ONGOING)';
  };

  const handlePublish = async () => {
    // 1. 질문 개수 검증
    if (questions.length === 0) {
      alert('최소 1개 이상의 문항이 등록되어야 게시할 수 있습니다.');
      return;
    }

    // 2. 객관식 보기 개수 검증
    const invalidQuestion = questions.find(q => 
      (q.qstnAnsTypeCd === 'SING' || q.qstnAnsTypeCd === 'MULT') && 
      (!q.items || q.items.length < 2)
    );
    if (invalidQuestion) {
      alert(`[순번 ${invalidQuestion.sortSeq}] 객관식 문항은 최소 2개 이상의 보기가 필요합니다.`);
      return;
    }

    // 3. 시작일시 유효성 검증
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (bgngYmd && bgngYmd < now) {
      if (!confirm('시작일이 오늘보다 이전입니다. 그대로 게시하시겠습니까?')) {
        return;
      }
    }

    if (!confirm('설문을 게시하시겠습니까? 게시 후에는 문항 수정이 제한될 수 있습니다.')) {
      return;
    }

    // 상태를 PUBLISHED로 간주하기 위해 useYn을 Y로 변경 (sttusCd가 DB에 없다면 useYn이 핵심)
    setUseYn('Y');
    setSttusCd('PUBLISHED');
    await performSave();
  };

  const handleSaveSurvey = async () => {
    await performSave();
  };

  const performSave = async () => {
    if (saving) return;
    if (!srvyTtl) {
      alert('설문 제목을 입력하세요.');
      return;
    }
    if (!bgngYmd || !endYmd) {
      alert('설문 기간을 입력하세요.');
      return;
    }

    setSaving(true);

    const payload = {
      srvyTtl,
      srvyExpln,
      bgngYmd: formatDate(bgngYmd),
      endYmd: formatDate(endYmd),
      useYn,
      questions: questions.map(q => ({
        ...q,
        sortSeq: Number(q.sortSeq),
        ansMaxChcNocs: Number(q.ansMaxChcNocs || 1),
        scorScr: Number(q.scorScr || 0),
        items: q.items?.map(item => ({
          ...item,
          sortSeq: Number(item.sortSeq),
          scorScr: Number(item.scorScr),
          nxtQstnNo: item.nxtQstnNo ? Number(item.nxtQstnNo) : null
        }))
      }))
    };

    try {
      const config = {
        headers: {
          'X-Member-No': '10001' // 임시 관리자 번호
        }
      };

      if (srvyNo) {
        await http.put(`/api/v1/surveys/${srvyNo}`, payload, config);
        alert('설문이 수정/저장되었습니다.');
      } else {
        await http.post('/api/v1/surveys', payload, config);
        alert('설문이 생성/저장되었습니다.');
      }
      navigate('/survey-list');
    } catch (error) {
      console.error('설문 저장 실패:', error);
      const errorCode = error.response?.data?.code;
      const errorMap = {
        'SRVY-4001': '설문 기간이 아닙니다.',
        'SRVY-4002': '설문 상태가 \'게시\'가 아닙니다.',
        'SRVY-4003': '질문 유형과 답변 형식이 일치하지 않습니다.',
        'SRVY-4041': '존재하지 않는 설문입니다.',
        'SRVY-4091': '이미 응답을 제출했습니다 (중복 응답).'
      };
      
      const errorMsg = errorMap[errorCode] || error.response?.data?.message || error.response?.data?.error || '설문 저장 중 오류가 발생했습니다.';
      alert(`저장 실패: ${errorMsg} ${errorCode ? `(${errorCode})` : `(상태코드: ${error.response?.status})`}`);
    } finally {
      setSaving(false);
    }
  };

  const qstnColumns = [
    { id: 'sortSeq', header: '순번', width: 60 },
    { id: 'qstnCn', header: '질문내용', flexgrow: 1 },
    { 
      id: 'qstnAnsTypeCd', 
      header: '유형', 
      width: 100,
      template: (obj) => {
        const mapping = {
          'SING': '단일선택',
          'MULT': '다중선택',
          'TEXT': '주관식',
          'SCAL': '척도형'
        };
        return mapping[obj.qstnAnsTypeCd] || obj.qstnAnsTypeCd;
      }
    },
    { 
      id: 'itemCount', 
      header: '보기수', 
      width: 80,
      template: (obj) => obj.items?.length || 0
    },
    {
      id: 'manage',
      header: '관리',
      width: 80,
      cell: ({ row }) => {
        const rowIndex = questions.indexOf(row);
        return (
          <button 
            onClick={() => handleEditQuestion({ ...row, index: rowIndex })}
            style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
          >
            수정
          </button>
        );
      }
    }
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>설문지 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>설문 관리</li>
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
                      placeholder="제목을 입력하세요." 
                      value={srvyTtl}
                      onChange={(e) => setSrvyTtl(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>설문설명</td>
                  <td colSpan={3}>
                    <textarea 
                      value={srvyExpln} 
                      onChange={(e) => setSrvyExpln(e.target.value)}
                      placeholder="설명(설명글)을 입력하세요."
                      style={{ width: '100%', border: '1px solid #ddd', padding: '8px', minHeight: '60px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>설문기간</td>
                  <td colSpan={3}>
                    <div className="ondatepickerbox">
                      <DatepickerBox value={bgngYmd} onChange={setBgngYmd} />
                      <span className="onunit">~</span>
                      <DatepickerBox value={endYmd} onChange={setEndYmd} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>상태</td>
                  <td>{getDisplayStatus()}</td>
                  <td>사용여부</td>
                  <td>
                    <RadioButton groupId="useYn_Y" radioGroup="useYn" radioValue="Y" radioName="사용" selectedValue={useYn} onChange={setUseYn} />
                    <RadioButton groupId="useYn_N" radioGroup="useYn" radioValue="N" radioName="미사용" selectedValue={useYn} onChange={setUseYn} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="onflexbtns">
            <div style={{ marginRight: 'auto' }}>
              <Button btnType="list" btnNames="목록" onClick={() => navigate('/survey-list')} />
            </div>
            {useYn === 'N' && (
               <Button btnType="add" btnNames="게시 (PUBLISH)" onClick={handlePublish} />
            )}
            {useYn === 'Y' && (
              <Button btnType="list" btnNames="강제 마감 (CLOSE)" onClick={async () => {
                if(confirm('설문을 강제 마감하시겠습니까?')) {
                  setUseYn('N');
                  setSttusCd('CLOSED');
                  await performSave();
                }
              }} />
            )}
            <Button btnType="add" btnNames="저장" onClick={handleSaveSurvey} />
          </div>

          <div className="ontable-legend">
            <h2 className="onsubtitle">설문 문항 목록</h2>
            <Button btnType="add" btnNames="문항추가" onClick={handleAddQuestion} />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable data={questions} columns={qstnColumns} />
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <Popup title="설문 문항 등록/수정" autoHeight={true}>
          <div className="oncontent ontable-form">
            <div className="ontableBox">
              <table>
                <colgroup>
                  <col style={{ width: '150px' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>순번</td>
                    <td>
                      <MenuInputBox 
                        menuType="input" 
                        menuSize="150px" 
                        value={currentQuestion.sortSeq}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, sortSeq: e.target.value})}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>질문유형</td>
                    <td>
                      <div className="onparagraph" style={{ gap: '10px' }}>
                        <RadioButton groupId="ty_single" radioGroup="qstnTy" radioValue="SING" radioName="단일선택" selectedValue={currentQuestion.qstnAnsTypeCd} onChange={(val) => setCurrentQuestion({...currentQuestion, qstnAnsTypeCd: val})} />
                        <RadioButton groupId="ty_multi" radioGroup="qstnTy" radioValue="MULT" radioName="다중선택" selectedValue={currentQuestion.qstnAnsTypeCd} onChange={(val) => setCurrentQuestion({...currentQuestion, qstnAnsTypeCd: val})} />
                        <RadioButton groupId="ty_text" radioGroup="qstnTy" radioValue="TEXT" radioName="주관식" selectedValue={currentQuestion.qstnAnsTypeCd} onChange={(val) => setCurrentQuestion({...currentQuestion, qstnAnsTypeCd: val})} />
                        <RadioButton groupId="ty_scale" radioGroup="qstnTy" radioValue="SCAL" radioName="척도형" selectedValue={currentQuestion.qstnAnsTypeCd} onChange={(val) => setCurrentQuestion({...currentQuestion, qstnAnsTypeCd: val})} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>필수여부</td>
                    <td>
                      <RadioButton groupId="ansEsntl_Y" radioGroup="ansEsntlYn" radioValue="Y" radioName="필수" selectedValue={currentQuestion.ansEsntlYn} onChange={(val) => setCurrentQuestion({...currentQuestion, ansEsntlYn: val})} />
                      <RadioButton groupId="ansEsntl_N" radioGroup="ansEsntlYn" radioValue="N" radioName="선택" selectedValue={currentQuestion.ansEsntlYn} onChange={(val) => setCurrentQuestion({...currentQuestion, ansEsntlYn: val})} />
                    </td>
                  </tr>
                  <tr>
                    <td>배점대상</td>
                    <td>
                      <RadioButton groupId="scorTrgt_Y" radioGroup="scorTrgtYn" radioValue="Y" radioName="대상" selectedValue={currentQuestion.scorTrgtYn} onChange={(val) => setCurrentQuestion({...currentQuestion, scorTrgtYn: val})} />
                      <RadioButton groupId="scorTrgt_N" radioGroup="scorTrgtYn" radioValue="N" radioName="제외" selectedValue={currentQuestion.scorTrgtYn} onChange={(val) => setCurrentQuestion({...currentQuestion, scorTrgtYn: val})} />
                    </td>
                  </tr>
                  <tr>
                    <td>질문내용</td>
                    <td>
                      <MenuInputBox 
                        menuType="input" 
                        menuSize="100%" 
                        placeholder="질문내용을 입력하세요." 
                        value={currentQuestion.qstnCn}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, qstnCn: e.target.value})}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>최대선택/점수</td>
                    <td>
                      <div className="onparagraph" style={{ gap: '10px' }}>
                        <MenuInputBox 
                          menuType="input" 
                          menuName="최대선택"
                          menuSize="80px" 
                          value={currentQuestion.ansMaxChcNocs}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, ansMaxChcNocs: e.target.value})}
                        />
                        <MenuInputBox 
                          menuType="input" 
                          menuName="질문점수"
                          menuSize="80px" 
                          value={currentQuestion.scorScr}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, scorScr: e.target.value})}
                        />
                      </div>
                    </td>
                  </tr>
                  {(currentQuestion.qstnAnsTypeCd !== 'TEXT') && (
                    <tr>
                      <td>
                        <div className="flexColumn centerGap">
                          선택항목 (보기)
                          <Button btnType="add" btnNames="항목 추가" onClick={handleAddItem} />
                        </div>
                      </td>
                      <td>
                        <div className="ontableBox">
                          <table style={{ border: '1px solid #eee' }}>
                            <thead>
                              <tr>
                                <th>순서</th>
                                <th>보기내용</th>
                                <th>보기설명</th>
                                <th>배점</th>
                                <th>다음질문</th>
                                <th>삭제</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentQuestion.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.sortSeq}</td>
                                  <td>
                                    <input 
                                      type="text" 
                                      value={item.qitemNm} 
                                      onChange={(e) => handleItemChange(idx, 'qitemNm', e.target.value)}
                                      style={{ width: '100%', border: '1px solid #ddd' }}
                                    />
                                  </td>
                                  <td>
                                    <input 
                                      type="text" 
                                      value={item.qitemExpln} 
                                      onChange={(e) => handleItemChange(idx, 'qitemExpln', e.target.value)}
                                      style={{ width: '100%', border: '1px solid #ddd' }}
                                    />
                                  </td>
                                  <td>
                                    <input 
                                      type="number" 
                                      value={item.scorScr} 
                                      onChange={(e) => handleItemChange(idx, 'scorScr', parseInt(e.target.value))}
                                      style={{ width: '60px', border: '1px solid #ddd' }}
                                    />
                                  </td>
                                  <td>
                                    <input 
                                      type="number" 
                                      value={item.nxtQstnNo || ''} 
                                      onChange={(e) => handleItemChange(idx, 'nxtQstnNo', e.target.value ? parseInt(e.target.value) : null)}
                                      placeholder="Q No"
                                      style={{ width: '60px', border: '1px solid #ddd' }}
                                    />
                                  </td>
                                  <td>
                                    <Button btnType="del" btnNames="X" onClick={() => {
                                      const newItems = currentQuestion.items.filter((_, i) => i !== idx);
                                      setCurrentQuestion({ ...currentQuestion, items: newItems });
                                    }} />
                                  </td>
                                </tr>
                              ))}
                              {currentQuestion.items.length === 0 && (
                                <tr>
                                  <td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>항목을 추가해주세요.</td>
                                </tr>
                              )}
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
          <div className="btns" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Button btnType="list" btnNames="닫기" onClick={() => setIsPopupOpen(false)} />
            <Button btnType="add" btnNames="질문 저장" onClick={handleSaveQuestion} />
          </div>
        </Popup>
      )}
    </div>
  );
}
