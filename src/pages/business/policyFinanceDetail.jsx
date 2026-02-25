import Button from '@components/ui/Button';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const formatCommaSeparated = (value) =>
  value ? String(value).split(',').join(', ') : '-';

const toDisplayValue = (value) => {
  if (value === 0) return '0';
  if (value === null || value === undefined) return '-';
  const normalized = String(value).trim();
  return normalized || '-';
};

const renderUrlValue = (value) => {
  if (!value) return '-';
  return (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
};

const getIndustryValue = (detail) =>
  [detail?.tpbizLclsfCd, detail?.ksicCd].filter(Boolean).join(' / ') || '-';

const getApplicationPeriodValue = (detail) => {
  if (detail?.aplyPrdCn) return detail.aplyPrdCn;
  if (!detail?.aplyBgngYmd && !detail?.aplyDdlnYmd) return '-';

  return `${toDisplayValue(detail?.aplyBgngYmd)} ~ ${toDisplayValue(detail?.aplyDdlnYmd)}`;
};

const hasRichEditorContent = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return false;

  const plainText = raw
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .trim();

  if (plainText) return true;

  return /<(img|video|iframe|table|ul|ol|li|blockquote|pre|hr|figure)\b/i.test(
    raw
  );
};

const renderReadOnlyRichEditor = (value) => {
  if (!hasRichEditorContent(value)) return '-';
  return (
    <RichEditor
      theme="light"
      editable={false}
      showHeader={false}
      showHtmlToggle={false}
      allowHtmlEdit={false}
      resizable={false}
      value={String(value || '')}
    />
  );
};

export default function PolicyFinanceDetail() {
  const navigate = useNavigate();
  const { policyNo } = useParams();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchPolicyFinanceDetail = async () => {
    if (!policyNo) {
      alert('정책금융번호가 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await http.get(`/api/v1/policy-finance/${policyNo}`);
      setDetail(response?.data ?? response ?? null);
    } catch (error) {
      console.error('정책금융 상세 조회 실패:', error);
      alert('정책금융 상세 정보를 불러오는데 실패했습니다.');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToList = () => {
    navigate('..');
  };

  const handleMoveToUpdate = () => {
    if (!policyNo) {
      alert('정책금융번호가 없습니다.');
      return;
    }
    navigate('update');
  };

  useEffect(() => {
    fetchPolicyFinanceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyNo]);

  if (loading) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">데이터를 불러오는 중입니다.</div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">조회된 정책금융이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>정책금융 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>정책금융 관리</li>
          <li>정책금융 목록</li>
          <li className="on">정책금융 상세조회</li>
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
                  <td>{toDisplayValue(detail?.plcyFnncGdsSttsCdNm)}</td>
                  <td>접수상황</td>
                  <td>{toDisplayValue(detail?.plcyFnncRcptSttsCdNm)}</td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td>
                    {toDisplayValue(
                      detail?.bizFlfmtInstCdNm || detail?.bizFlfmtInstCd
                    )}
                  </td>
                  <td>상품명</td>
                  <td>{toDisplayValue(detail?.plcyFnncNm)}</td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}>{toDisplayValue(detail?.plcyFnncGdsPrps)}</td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}>
                    {renderReadOnlyRichEditor(detail?.plcyFnncSprtTrgtCn)}
                  </td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  <td>{toDisplayValue(detail?.grntePlcyFnncPrtrtCndCn)}</td>
                  <td>보증한도</td>
                  <td>{toDisplayValue(detail?.plcyFnncSprtLimCn)}</td>
                </tr>
                <tr>
                  <td>보증비율</td>
                  <td>{toDisplayValue(detail?.plcyFnncGrnteRtCn)}</td>
                  <td>보증료율 감면</td>
                  <td>{toDisplayValue(detail?.plcyFnncGrfeCn)}</td>
                </tr>
                <tr>
                  <td>지원대상자금</td>
                  <td>{toDisplayValue(detail?.loanPlcyFnncUseUsgCn)}</td>
                  <td>신청방식</td>
                  <td>{formatCommaSeparated(detail?.plcyFnncAplyMthCdNm)}</td>
                </tr>
                <tr>
                  <td>보증제한대상</td>
                  <td colSpan={3}>
                    {renderReadOnlyRichEditor(detail?.plcyFnncSprtExclTrgtCn)}
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}>{toDisplayValue(detail?.cmptncRgnNm)}</td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}>{renderReadOnlyRichEditor(detail?.inqplCn)}</td>
                </tr>
                <tr>
                  <td>신청기간(일시)</td>
                  <td colSpan={3}>{getApplicationPeriodValue(detail)}</td>
                </tr>
                <tr>
                  <td>상세URL</td>
                  <td colSpan={3}>{renderUrlValue(detail?.plcyFnncDtlUrlAddr)}</td>
                </tr>
                <tr>
                  <td>문의URL</td>
                  <td colSpan={3}>{renderUrlValue(detail?.plcyFnncInqplUrlAddr)}</td>
                </tr>
                <tr>
                  <td>신청URL</td>
                  <td colSpan={3}>{renderUrlValue(detail?.plcyFnncAplyUrlAddr)}</td>
                </tr>
                <tr>
                  <td>첨부파일URL</td>
                  <td colSpan={3}>{renderUrlValue(detail?.plcyFnncAtchFileUrlAddr)}</td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  <td colSpan={3}>-</td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td>{toDisplayValue(detail?.plcyFnncEntSclCdNm)}</td>
                  <td>업종</td>
                  <td>{getIndustryValue(detail)}</td>
                </tr>
                <tr>
                  <td>우대기업 유형</td>
                  <td>{toDisplayValue(detail?.plcyFnncDtlCndCdNm)}</td>
                  <td>상품종류</td>
                  <td>{toDisplayValue(detail?.plcyFnncGdsKndCdNm)}</td>
                </tr>
                <tr>
                  <td>기업규모요약</td>
                  <td>{toDisplayValue(detail?.plcyFnncEntSclSmryCn)}</td>
                  <td>지원대상자금(용도)요약</td>
                  <td>
                    {toDisplayValue(
                      detail?.loanPlcyFnncUseUsgSeCdNm ||
                        detail?.grntePlcyFnncUseUsgSeCdNm
                    )}
                  </td>
                </tr>
                <tr>
                  <td>보증비율요약코드</td>
                  <td>{toDisplayValue(detail?.plcyFnncCmpnRtCn)}</td>
                  <td>보증비율요약</td>
                  <td>{toDisplayValue(detail?.plcyFnncCmpnRtSmryCn)}</td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td>{toDisplayValue(detail?.rgtrId)}</td>
                  <td>등록일시</td>
                  <td>{formatDate(detail?.regDt, 'yyyy-MM-dd HH:mm:ss')}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>{toDisplayValue(detail?.mdfrId)}</td>
                  <td>최종 수정일시</td>
                  <td>{formatDate(detail?.mdfcnDt, 'yyyy-MM-dd HH:mm:ss')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleMoveToList} />
          </div>
          <Button btnType="edit" btnNames="수정" onClick={handleMoveToUpdate} />
        </div>
      </div>
    </div>
  );
}
