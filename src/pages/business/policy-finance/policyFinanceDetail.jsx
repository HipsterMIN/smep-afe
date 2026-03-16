import Button from '@components/ui/Button';
import http from '@lib/http.js';
import { renderEditorHtml } from '@utils/editorHtmlUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PolicyFinanceDetailGuarantee from './components/policyFinanceDetailGuarantee.jsx';
import PolicyFinanceDetailInsurance from './components/policyFinanceDetailInsurance.jsx';
import PolicyFinanceDetailLoan from './components/policyFinanceDetailLoan.jsx';

// 상품유형코드(FT01/FT02/FT03)에 따라 상세 컴포넌트를 분기한다.
const resolveDetailComponent = (plcyFnncGdsTypeCd) => {
  const componentMap = {
    // FT01: 대출, FT02: 보증, FT03: 보증보험
    FT01: PolicyFinanceDetailLoan,
    FT02: PolicyFinanceDetailGuarantee,
    FT03: PolicyFinanceDetailInsurance,
  };

  return componentMap[plcyFnncGdsTypeCd] || PolicyFinanceDetailLoan;
};

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return formatDate(value, 'yyyy-MM-dd HH:mm:ss');
};

const formatApplicationPeriod = (start, end) => {
  const hasStart =
    start !== null && start !== undefined && String(start) !== '';
  const hasEnd = end !== null && end !== undefined && String(end) !== '';

  if (!hasStart && !hasEnd) return '-';
  const startText = hasStart ? String(start) : '-';
  const endText = hasEnd ? String(end) : '-';
  return `${startText} ~ ${endText}`;
};

export default function PolicyFinanceDetail() {
  const navigate = useNavigate();
  const { policyNo } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!policyNo) return;

    const fetchDetail = async () => {
      try {
        const response = await http.get(`/api/v1/policy-finance/${policyNo}`);
        setDetail(response?.data ?? response ?? null);
      } catch (error) {
        console.error('정책금융 상세 조회 실패:', error);
        alert('정책금융 상세정보를 불러오는데 실패했습니다.');
      }
    };

    fetchDetail();
  }, [policyNo]);

  const detailData = detail ?? {};
  const DetailComponent = resolveDetailComponent(detailData.plcyFnncGdsTypeCd);
  const detailTypeLabel =
    detailData.plcyFnncGdsTypeCdNm || detailData.plcyFnncGdsTypeCd || '-';

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{`정책금융 상세조회(${detailTypeLabel})`}</h2>
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
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncSttsCdNm)}
                  </td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>{formatDateTime(detailData.regDt)}</td>
                  <td>수정일시</td>
                  <td>{formatDateTime(detailData.mdfcnDt)}</td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncBizFlfmtInstNm)}
                  </td>
                </tr>
                <tr>
                  <td>상품명</td>
                  <td colSpan={3}>{toDisplayText(detailData.plcyFnncGdsNm)}</td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}>
                    {renderEditorHtml(detailData.plcyFnncGdsPrpsCn)}
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}>
                    {renderEditorHtml(detailData.plcyFnncSprtTrgtCn)}
                  </td>
                </tr>
                <tr>
                  <td>신청방식</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncAplyMthCdNm)}
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}>
                    {renderEditorHtml(detailData.cmptncRgnNm)}
                  </td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}>
                    {renderEditorHtml(detailData.plcyFnncInqCn)}
                  </td>
                </tr>
                <tr>
                  <td>신청일시</td>
                  <td colSpan={3}>
                    {formatApplicationPeriod(
                      detailData.plcyFnncAplyBgngDtCn,
                      detailData.plcyFnncAplyDdlnDtCn
                    )}
                  </td>
                </tr>
                <tr>
                  <td>상세URL</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncDtlUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>문의URL</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncInqplUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  <td colSpan={3}>{toDisplayText(detailData.hstgNmList)}</td>
                </tr>
                <tr>
                  <td>첨부파일URL</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncAtchFileUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncEntSclCdNm)}
                  </td>
                </tr>
                <tr>
                  <td>업종</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncTpbizNmNm)}
                  </td>
                </tr>
                <tr>
                  <td>업종세세분류</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncTpbizDtlClsfNm)}
                  </td>
                </tr>
                <tr>
                  <td>우대기업유형</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncAddDtlCndCnNm)}
                  </td>
                </tr>
                <tr>
                  <td>접수상황</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncRcptSttsCdNm)}
                  </td>
                </tr>
                <tr>
                  <td>신청URL</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncAplyUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>기업규모요약</td>
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncEntSclSmryCn)}
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td colSpan={3}>{toDisplayText(detailData.rgtrId)}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td colSpan={3}>{toDisplayText(detailData.mdfrId)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DetailComponent detailData={detailData} />
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
            btnType="edit"
            btnNames="수정"
            onClick={() => navigate('update')}
          />
        </div>
      </div>
      <style>
        {`
          .editor-html-content p,
          .editor-html-content ul,
          .editor-html-content ol {
            margin: 0 0 8px 0;
          }
          .editor-html-content ul,
          .editor-html-content ol {
            padding-left: 20px;
          }
          .editor-html-content p:last-child,
          .editor-html-content ul:last-child,
          .editor-html-content ol:last-child {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
}
