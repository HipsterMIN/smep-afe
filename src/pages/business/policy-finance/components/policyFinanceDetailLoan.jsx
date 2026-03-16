import { renderEditorHtml } from '@utils/editorHtmlUtils.js';
import PropTypes from 'prop-types';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const pickFirstNonEmpty = (...values) =>
  values.find((value) => value !== null && value !== undefined && value !== '');

export default function PolicyFinanceDetailLoan({ detailData }) {
  const data = detailData ?? {};

  return (
    <>
      <h4 className="ontableTitle">대출 상세</h4>
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
              <td>매출액</td>
              <td>{toDisplayText(data.slsAmtCn)}</td>
              <td>업력</td>
              <td>{toDisplayText(data.tpbizHstryCn)}</td>
            </tr>
            <tr>
              <td>우대조건</td>
              <td colSpan={3}>{renderEditorHtml(data.loanPrtrtCndCn)}</td>
            </tr>
            <tr>
              <td>대출한도</td>
              <td colSpan={3}>{renderEditorHtml(data.plcyFnncSprtLimCn)}</td>
            </tr>
            <tr>
              <td>자금용도</td>
              <td colSpan={3}>{toDisplayText(data.loanSprtTrgtFndsCnNm)}</td>
            </tr>
            <tr>
              <td>융자방식</td>
              <td colSpan={3}>{toDisplayText(data.loanMthCnNm)}</td>
            </tr>
            <tr>
              <td>기준금리</td>
              <td colSpan={3}>{toDisplayText(data.crtrIrtCn)}</td>
            </tr>
            <tr>
              <td>대출금리</td>
              <td colSpan={3}>{renderEditorHtml(data.loanIrtCn)}</td>
            </tr>
            <tr>
              <td>금리변동여부</td>
              <td colSpan={3}>{toDisplayText(data.flctnIrtYnCnNm)}</td>
            </tr>
            <tr>
              <td>대출기간</td>
              <td colSpan={3}>{renderEditorHtml(data.loanPrdCn)}</td>
            </tr>
            <tr>
              <td>거치기간</td>
              <td colSpan={3}>{renderEditorHtml(data.dfmtPrdCn)}</td>
            </tr>
            <tr>
              <td>상환방법</td>
              <td colSpan={3}>
                {toDisplayText(
                  pickFirstNonEmpty(data.loanRpmtMthdCdNm, data.loanRpmtMthdCd)
                )}
              </td>
            </tr>
            <tr>
              <td>대출제한대상</td>
              <td colSpan={3}>
                {renderEditorHtml(data.plcyFnncSprtExclTrgtCn)}
              </td>
            </tr>
            <tr>
              <td>추천기관</td>
              <td>{toDisplayText(data.loanRcmdtnInstNm)}</td>
              <td>테마업종</td>
              <td>{toDisplayText(data.thmTpbizNm)}</td>
            </tr>
            <tr>
              <td>지원대상자금(용도)요약</td>
              <td colSpan={3}>{toDisplayText(data.loanSprtTrgtFndsSmryCn)}</td>
            </tr>
            <tr>
              <td>지원한도요약</td>
              <td colSpan={3}>{toDisplayText(data.plcyFnncSprtLimSmryCn)}</td>
            </tr>
            <tr>
              <td>대출기간요약코드</td>
              <td colSpan={3}>
                {toDisplayText(
                  pickFirstNonEmpty(data.loanPrdSmryCdNm, data.loanPrdSmryCd)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceDetailLoan.propTypes = {
  detailData: PropTypes.object,
};
