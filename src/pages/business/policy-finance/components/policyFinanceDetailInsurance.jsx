import { renderEditorHtml } from '@utils/editorHtmlUtils.js';
import PropTypes from 'prop-types';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

export default function PolicyFinanceDetailInsurance({ detailData }) {
  const data = detailData ?? {};

  return (
    <>
      <h4 className="ontableTitle">보증보험 상세</h4>
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
              <td>우대조건</td>
              <td colSpan={3}>{renderEditorHtml(data.insrncPrtrtCndCn)}</td>
            </tr>
            <tr>
              <td>보험료 우대</td>
              <td colSpan={3}>{renderEditorHtml(data.insrncIspmPrtrtCndCn)}</td>
            </tr>
            <tr>
              <td>보험한도</td>
              <td colSpan={3}>{renderEditorHtml(data.plcyFnncSprtLimCn)}</td>
            </tr>
            <tr>
              <td>부보율(보상비율)</td>
              <td colSpan={3}>{renderEditorHtml(data.insrncCmpnRtCn)}</td>
            </tr>
            <tr>
              <td>지급보험금</td>
              <td colSpan={3}>{renderEditorHtml(data.insrncGiveAmtCn)}</td>
            </tr>
            <tr>
              <td>보험료</td>
              <td colSpan={3}>{renderEditorHtml(data.ispmCn)}</td>
            </tr>
            <tr>
              <td>보험증권유효기간</td>
              <td colSpan={3}>{renderEditorHtml(data.insrncScrtVldPrdCn)}</td>
            </tr>
            <tr>
              <td>보험계약 제한대상</td>
              <td colSpan={3}>
                {renderEditorHtml(data.plcyFnncSprtExclTrgtCn)}
              </td>
            </tr>
            <tr>
              <td>지급보험금요약</td>
              <td colSpan={3}>{toDisplayText(data.insrncGiveAmtSmryCn)}</td>
            </tr>
            <tr>
              <td>부보율(보상비율)요약</td>
              <td colSpan={3}>{toDisplayText(data.insrncCmpnRtSmryCn)}</td>
            </tr>
            <tr>
              <td>부보율(보상비율)요약코드</td>
              <td colSpan={3}>
                {toDisplayText(data.insrncCmpnRtSmryCdNm || data.insrncCmpnRtSmryCd)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceDetailInsurance.propTypes = {
  detailData: PropTypes.object,
};
