import Button from '@components/ui/Button';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const MAPPING_PENDING_TEXT = '매핑중';

const formatDateTime = (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss');

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
                  {/* 백엔드 컬럼: plcyFnncGdsSttsCdNm (정책금융상품상태코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncGdsSttsCdNm)}</td>
                  <td>접수상황</td>
                  {/* 백엔드 컬럼: plcyFnncRcptSttsCdNm (정책금융접수상태코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncRcptSttsCdNm)}</td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  {/* 백엔드 컬럼: plcyFnncBizFlfmtInstNm (정책금융사업수행기관명) */}
                  <td>{toDisplayText(detailData.plcyFnncBizFlfmtInstNm)}</td>
                  <td>상품명</td>
                  {/* 백엔드 컬럼: plcyFnncGdsNm (정책금융상품명) */}
                  <td>{toDisplayText(detailData.plcyFnncGdsNm)}</td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  {/* 백엔드 컬럼: plcyFnncGdsPrpsCn (정책금융상품목적내용) */}
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncGdsPrpsCn)}
                  </td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  {/* 백엔드 컬럼: plcyFnncSprtTrgtCn (정책금융지원대상내용) */}
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncSprtTrgtCn)}
                  </td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  {/* 백엔드 컬럼: loanPrtrtCndCn (대출-우대조건내용) */}
                  <td>{toDisplayText(detailData.loanPrtrtCndCn)}</td>
                  <td>보증한도</td>
                  {/* 백엔드 컬럼: plcyFnncSprtLimCn (정책금융지원한도내용) */}
                  <td>{toDisplayText(detailData.plcyFnncSprtLimCn)}</td>
                </tr>
                <tr>
                  <td>보증비율</td>
                  {/* 백엔드 컬럼: grnteRtCn (보증-보증비율내용) */}
                  <td>{toDisplayText(detailData.grnteRtCn)}</td>
                  <td>보증료율 감면</td>
                  {/* 백엔드 컬럼: grntePrtrtCndCn (보증-우대조건내용) */}
                  <td>{toDisplayText(detailData.grntePrtrtCndCn)}</td>
                </tr>
                <tr>
                  <td>지원대상자금</td>
                  {/* 백엔드 컬럼: plcyFnncSprtTrgtCn (정책금융지원대상내용) */}
                  <td>{toDisplayText(detailData.plcyFnncSprtTrgtCn)}</td>
                  <td>신청방식</td>
                  {/* 백엔드 컬럼: plcyFnncAplyMthCdNm (정책금융신청방식코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncAplyMthCdNm)}</td>
                </tr>
                <tr>
                  <td>보증제한대상</td>
                  <td colSpan={3}>
                    {/* 백엔드 컬럼: plcyFnncSprtExclTrgtCn (정책금융지원제외대상내용) */}
                    {toDisplayText(detailData.plcyFnncSprtExclTrgtCn)}
                  </td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  {/* 백엔드 컬럼: cmptncRgnNm (관할지역명) */}
                  <td colSpan={3}>{toDisplayText(detailData.cmptncRgnNm)}</td>
                </tr>
                <tr>
                  <td>문의</td>
                  {/* 백엔드 컬럼: plcyFnncInqCn (정책금융조회내용) */}
                  <td colSpan={3}>{toDisplayText(detailData.plcyFnncInqCn)}</td>
                </tr>
                <tr>
                  <td>신청기간(일시)</td>
                  <td colSpan={3}>
                    {/* 백엔드 컬럼: plcyFnncAplyBgngDtCn + plcyFnncAplyDdlnDtCn */}
                    {formatApplicationPeriod(
                      detailData.plcyFnncAplyBgngDtCn,
                      detailData.plcyFnncAplyDdlnDtCn
                    )}
                  </td>
                </tr>
                <tr>
                  <td>상세URL</td>
                  {/* 백엔드 컬럼: plcyFnncDtlUrlAddr (정책금융상세URL주소) */}
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncDtlUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>문의URL</td>
                  {/* 백엔드 컬럼: plcyFnncInqplUrlAddr (정책금융문의처URL주소) */}
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncInqplUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>신청URL</td>
                  {/* 백엔드 컬럼: plcyFnncAplyUrlAddr (정책금융신청URL주소) */}
                  <td colSpan={3}>
                    {toDisplayText(detailData.plcyFnncAplyUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>첨부파일URL</td>
                  <td colSpan={3}>
                    {/* 백엔드 컬럼: plcyFnncAtchFileUrlAddr (정책금융첨부파일URL주소) */}
                    {toDisplayText(detailData.plcyFnncAtchFileUrlAddr)}
                  </td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  {/* 백엔드 컬럼: hstgNmList (해시태그명목록) */}
                  <td colSpan={3}>{toDisplayText(detailData.hstgNmList)}</td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  {/* 백엔드 컬럼: plcyFnncEntSclCdNm (정책금융기업규모코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncEntSclCdNm)}</td>
                  <td>업종</td>
                  {/* 백엔드 컬럼: plcyFnncTpbizNmNm (정책금융업종 코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncTpbizNmNm)}</td>
                </tr>
                <tr>
                  <td>우대기업 유형</td>
                  {/* 백엔드 컬럼: plcyFnncAddDtlCndCnNm (정책금융추가상세조건 코드명) */}
                  <td>{toDisplayText(detailData.plcyFnncAddDtlCndCnNm)}</td>
                  <td>상품종류</td>
                  {/* 매핑 보류 후보: grnteGdsKndCdNm */}
                  <td>{MAPPING_PENDING_TEXT}</td>
                </tr>
                <tr>
                  <td>기업규모요약</td>
                  {/* 백엔드 컬럼: plcyFnncEntSclSmryCn (정책금융기업규모요약내용) */}
                  <td>{toDisplayText(detailData.plcyFnncEntSclSmryCn)}</td>
                  <td>지원대상자금(용도)요약</td>
                  {/* 매핑 보류 후보: grnteSprtTrgtFndsUsgSmryCn, loanSprtTrgtFndsSmryCn */}
                  <td>{MAPPING_PENDING_TEXT}</td>
                </tr>
                <tr>
                  <td>보증비율요약코드</td>
                  {/* 매핑 보류 후보: (명시 필드 미확정) */}
                  <td>{MAPPING_PENDING_TEXT}</td>
                  <td>보증비율요약</td>
                  {/* 매핑 보류 후보: grnteRtSmryCn, insrncCmpnRtSmryCn */}
                  <td>{MAPPING_PENDING_TEXT}</td>
                </tr>
                <tr>
                  <td>등록자</td>
                  {/* 백엔드 컬럼: rgtrId (등록자아이디) */}
                  <td>{toDisplayText(detailData.rgtrId)}</td>
                  <td>등록일시</td>
                  {/* 백엔드 컬럼: regDt (등록일시) */}
                  <td>{formatDateTime(detailData.regDt)}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  {/* 백엔드 컬럼: mdfrId (수정자아이디) */}
                  <td>{toDisplayText(detailData.mdfrId)}</td>
                  <td>최종 수정일시</td>
                  {/* 백엔드 컬럼: mdfcnDt (수정일시) */}
                  <td>{formatDateTime(detailData.mdfcnDt)}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
