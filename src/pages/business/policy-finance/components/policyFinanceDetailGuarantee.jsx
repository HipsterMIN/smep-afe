import { renderEditorHtml } from '@utils/editorHtmlUtils.js';
import PropTypes from 'prop-types';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const pickFirstNonEmpty = (...values) =>
  values.find((value) => value !== null && value !== undefined && value !== '');

export default function PolicyFinanceDetailGuarantee({ detailData }) {
  const data = detailData ?? {};

  return (
    <>
      <h4 className="ontableTitle">보증 상세</h4>
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
              <td colSpan={3}>{renderEditorHtml(data.grntePrtrtCndCn)}</td>
            </tr>
            <tr>
              <td>보증한도</td>
              <td colSpan={3}>{renderEditorHtml(data.plcyFnncSprtLimCn)}</td>
            </tr>
            <tr>
              <td>보증비율</td>
              <td colSpan={3}>{toDisplayText(data.grnteRtCn)}</td>
            </tr>
            <tr>
              <td>보증료율 감면</td>
              <td colSpan={3}>{renderEditorHtml(data.grfeCn)}</td>
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
              <td colSpan={3}>
                {renderEditorHtml(data.plcyFnncSprtExclTrgtCn)}
              </td>
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
              <td>지원대상자금(용도)요약</td>
              <td colSpan={3}>{toDisplayText(data.grnteSprtTrgtFndsUsgSmryCn)}</td>
            </tr>
            <tr>
              <td>보증비율요약</td>
              <td colSpan={3}>{toDisplayText(data.grnteRtSmryCn)}</td>
            </tr>
            <tr>
              <td>보증비율요약코드</td>
              <td colSpan={3}>
                {toDisplayText(
                  pickFirstNonEmpty(data.grnteRtSmryCdNm, data.grnteRtSmryCd)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceDetailGuarantee.propTypes = {
  detailData: PropTypes.object,
};
