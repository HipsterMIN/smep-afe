import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';

const MAPPING_PENDING_TEXT = '매핑중';

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

const pickFirstNonEmpty = (...values) =>
  values.find((value) => value !== null && value !== undefined && value !== '');

export default function PolicyFinanceDetailGuarantee({ detailData }) {
  const data = detailData ?? {};

  return (
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
            <td colSpan={3}>{toDisplayText(data.plcyFnncSttsCdNm)}</td>
          </tr>
          <tr>
            <td>등록일시</td>
            <td>{formatDateTime(data.regDt)}</td>
            <td>수정일시</td>
            <td>{formatDateTime(data.mdfcnDt)}</td>
          </tr>
          <tr>
            <td>사업수행기관</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncBizFlfmtInstNm)}</td>
          </tr>
          <tr>
            <td>상품명</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncGdsNm)}</td>
          </tr>
          <tr>
            <td>상품목적</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncGdsPrpsCn)}</td>
          </tr>
          <tr>
            <td>지원대상</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncSprtTrgtCn)}</td>
          </tr>
          <tr>
            <td>우대조건</td>
            <td colSpan={3}>{toDisplayText(data.grntePrtrtCndCn)}</td>
          </tr>
          <tr>
            <td>보증한도</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncSprtLimCn)}</td>
          </tr>
          <tr>
            <td>보증비율</td>
            <td colSpan={3}>{toDisplayText(data.grnteRtCn)}</td>
          </tr>
          <tr>
            <td>보증료율 감면</td>
            <td colSpan={3}>{toDisplayText(data.grfeCn)}</td>
          </tr>
          <tr>
            <td>지원대상자금</td>
            <td colSpan={3}>
              {toDisplayText(
                pickFirstNonEmpty(
                  data.grnteSprtTrgtFndsUsgCnNm,
                  data.grnteSprtTrgtFndsUsgCn
                )
              )}
            </td>
          </tr>
          <tr>
            <td>보증제한대상</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncSprtExclTrgtCn)}</td>
          </tr>
          <tr>
            <td>신청방식</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncAplyMthCdNm)}</td>
          </tr>
          <tr>
            <td>관할지역</td>
            <td colSpan={3}>{toDisplayText(data.cmptncRgnNm)}</td>
          </tr>
          <tr>
            <td>문의</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncInqCn)}</td>
          </tr>
          <tr>
            <td>신청일시</td>
            <td colSpan={3}>
              {formatApplicationPeriod(
                data.plcyFnncAplyBgngDtCn,
                data.plcyFnncAplyDdlnDtCn
              )}
            </td>
          </tr>
          <tr>
            <td>상세URL</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncDtlUrlAddr)}</td>
          </tr>
          <tr>
            <td>문의URL</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncInqplUrlAddr)}</td>
          </tr>
          <tr>
            <td>해시태그</td>
            <td colSpan={3}>{toDisplayText(data.hstgNmList)}</td>
          </tr>
          <tr>
            <td>첨부파일URL</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncAtchFileUrlAddr)}</td>
          </tr>
          <tr>
            <td>기업규모</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncEntSclCdNm)}</td>
          </tr>
          <tr>
            <td>업종</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncTpbizNmNm)}</td>
          </tr>
          <tr>
            <td>업종세세분류</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncTpbizDtlClsfNm)}</td>
          </tr>
          <tr>
            <td>우대기업유형</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncAddDtlCndCnNm)}</td>
          </tr>
          <tr>
            <td>접수상황</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncRcptSttsCdNm)}</td>
          </tr>
          <tr>
            <td>상품종류</td>
            <td colSpan={3}>
              {toDisplayText(
                pickFirstNonEmpty(data.grnteGdsKndCdNm, data.grnteGdsKndCd)
              )}
            </td>
          </tr>
          <tr>
            <td>신청URL</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncAplyUrlAddr)}</td>
          </tr>
          <tr>
            <td>지원대상자금(용도)요약</td>
            <td colSpan={3}>{toDisplayText(data.grnteSprtTrgtFndsUsgSmryCn)}</td>
          </tr>
          <tr>
            <td>보증비율요약</td>
            <td colSpan={3}>{toDisplayText(data.grnteRtSmryCn)}</td>
          </tr>
          <tr>
            <td>기업규모요약</td>
            <td colSpan={3}>{toDisplayText(data.plcyFnncEntSclSmryCn)}</td>
          </tr>
          <tr>
            <td>보증비율요약코드</td>
            <td colSpan={3}>{MAPPING_PENDING_TEXT}</td>
          </tr>
          <tr>
            <td>등록자</td>
            <td colSpan={3}>{toDisplayText(data.rgtrId)}</td>
          </tr>
          <tr>
            <td>수정자</td>
            <td colSpan={3}>{toDisplayText(data.mdfrId)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

PolicyFinanceDetailGuarantee.propTypes = {
  detailData: PropTypes.object,
};
