import CheckBox from '@components/ui/CheckBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import PropTypes from 'prop-types';

export default function PolicyFinanceLoanSection({
  form,
  loanFundsOptions,
  loanMethodOptions,
  rateTypeOptions,
  loanPeriodSummarySelectOptions,
  repaymentMethodOptions,
  handleInputChange,
  handleMultiValueChange,
  createCheckboxId,
}) {
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
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.slsAmtCn}
                  onChange={(e) => handleInputChange('slsAmtCn', e)}
                />
              </td>
              <td>업력</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.tpbizHstryCn}
                  onChange={(e) => handleInputChange('tpbizHstryCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>우대조건</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.loanPrtrtCndCn}
                  onChange={(value) => handleInputChange('loanPrtrtCndCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>지원대상자금</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {loanFundsOptions.map((option) => (
                    <CheckBox
                      key={`loanSprtTrgtFndsCn_${option.value}`}
                      chkId={createCheckboxId('loanSprtTrgtFndsCn', option.value)}
                      chkName={option.label}
                      value={option.value}
                      checked={form.loanSprtTrgtFndsCn.includes(option.value)}
                      onChange={handleMultiValueChange('loanSprtTrgtFndsCn')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>지원대상자금요약</td>
              <td colSpan={3}>
                <MenuInputBox
                  menuType="input"
                  menuSize="100%"
                  value={form.loanSprtTrgtFndsSmryCn}
                  onChange={(e) => handleInputChange('loanSprtTrgtFndsSmryCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>융자방식</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {loanMethodOptions.map((option) => (
                    <CheckBox
                      key={`loanMthCn_${option.value}`}
                      chkId={createCheckboxId('loanMthCn', option.value)}
                      chkName={option.label}
                      value={option.value}
                      checked={form.loanMthCn.includes(option.value)}
                      onChange={handleMultiValueChange('loanMthCn')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>기준금리</td>
              <td colSpan={3}>
                <MenuInputBox
                  menuType="input"
                  menuSize="100%"
                  value={form.crtrIrtCn}
                  onChange={(e) => handleInputChange('crtrIrtCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>대출금리</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.loanIrtCn}
                  onChange={(value) => handleInputChange('loanIrtCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>금리변동여부</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {rateTypeOptions.map((option) => (
                    <CheckBox
                      key={`flctnIrtYnCn_${option.value}`}
                      chkId={createCheckboxId('flctnIrtYnCn', option.value)}
                      chkName={option.label}
                      value={option.value}
                      checked={form.flctnIrtYnCn.includes(option.value)}
                      onChange={handleMultiValueChange('flctnIrtYnCn')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>대출기간</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.loanPrdCn}
                  onChange={(value) => handleInputChange('loanPrdCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>거치기간</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.dfmtPrdCn}
                  onChange={(value) => handleInputChange('dfmtPrdCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>대출기간요약코드</td>
              <td>
                <MenuInputBox
                  menuType="select"
                  menuSize="300px"
                  showAllOption={false}
                  options={loanPeriodSummarySelectOptions}
                  value={form.loanPrdSmryCd}
                  onChange={(e) => handleInputChange('loanPrdSmryCd', e)}
                />
              </td>
              <td>추천기관</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.loanRcmdtnInstNm}
                  onChange={(e) => handleInputChange('loanRcmdtnInstNm', e)}
                />
              </td>
            </tr>
            <tr>
              <td>상환방법</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {repaymentMethodOptions.map((option) => (
                    <CheckBox
                      key={`loanRpmtMthdCd_${option.value}`}
                      chkId={createCheckboxId('loanRpmtMthdCd', option.value)}
                      chkName={option.label}
                      value={option.value}
                      checked={form.loanRpmtMthdCd.includes(option.value)}
                      onChange={handleMultiValueChange('loanRpmtMthdCd')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>테마업종</td>
              <td colSpan={3}>
                <MenuInputBox
                  menuType="input"
                  menuSize="100%"
                  value={form.thmTpbizNm}
                  onChange={(e) => handleInputChange('thmTpbizNm', e)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceLoanSection.propTypes = {
  form: PropTypes.object.isRequired,
  loanFundsOptions: PropTypes.array.isRequired,
  loanMethodOptions: PropTypes.array.isRequired,
  rateTypeOptions: PropTypes.array.isRequired,
  loanPeriodSummarySelectOptions: PropTypes.array.isRequired,
  repaymentMethodOptions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleMultiValueChange: PropTypes.func.isRequired,
  createCheckboxId: PropTypes.func.isRequired,
};
