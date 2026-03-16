import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import PropTypes from 'prop-types';

export default function PolicyFinanceInsuranceSection({
  form,
  insrncCmpnSummarySelectOptions,
  handleInputChange,
}) {
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
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncPrtrtCndCn}
                  onChange={(e) => handleInputChange('insrncPrtrtCndCn', e)}
                />
              </td>
              <td>보험료 우대</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncIspmPrtrtCndCn}
                  onChange={(e) => handleInputChange('insrncIspmPrtrtCndCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>부보율(보상비율)</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncCmpnRtCn}
                  onChange={(e) => handleInputChange('insrncCmpnRtCn', e)}
                />
              </td>
              <td>지급보험금</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncGiveAmtCn}
                  onChange={(e) => handleInputChange('insrncGiveAmtCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>보험료</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.ispmCn}
                  onChange={(e) => handleInputChange('ispmCn', e)}
                />
              </td>
              <td>보험증권유효기간</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncScrtVldPrdCn}
                  onChange={(e) => handleInputChange('insrncScrtVldPrdCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>지급보험금요약</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncGiveAmtSmryCn}
                  onChange={(e) => handleInputChange('insrncGiveAmtSmryCn', e)}
                />
              </td>
              <td>부보율(보상비율)요약</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.insrncCmpnRtSmryCn}
                  onChange={(e) => handleInputChange('insrncCmpnRtSmryCn', e)}
                />
              </td>
            </tr>
            <tr>
              <td>부보율(보상비율)요약코드</td>
              <td colSpan={3}>
                <MenuInputBox
                  menuType="select"
                  menuSize="300px"
                  showAllOption={false}
                  options={insrncCmpnSummarySelectOptions}
                  value={form.insrncCmpnRtSmryCd}
                  onChange={(e) => handleInputChange('insrncCmpnRtSmryCd', e)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceInsuranceSection.propTypes = {
  form: PropTypes.object.isRequired,
  insrncCmpnSummarySelectOptions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
