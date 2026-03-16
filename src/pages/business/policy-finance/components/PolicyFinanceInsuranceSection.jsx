import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
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
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.insrncPrtrtCndCn}
                  onChange={(value) => handleInputChange('insrncPrtrtCndCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>보험료 우대</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.insrncIspmPrtrtCndCn}
                  onChange={(value) =>
                    handleInputChange('insrncIspmPrtrtCndCn', value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>부보율(보상비율)</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.insrncCmpnRtCn}
                  onChange={(value) => handleInputChange('insrncCmpnRtCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>지급보험금</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.insrncGiveAmtCn}
                  onChange={(value) => handleInputChange('insrncGiveAmtCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>보험료</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.ispmCn}
                  onChange={(value) => handleInputChange('ispmCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>보험증권유효기간</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.insrncScrtVldPrdCn}
                  onChange={(value) =>
                    handleInputChange('insrncScrtVldPrdCn', value)
                  }
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
