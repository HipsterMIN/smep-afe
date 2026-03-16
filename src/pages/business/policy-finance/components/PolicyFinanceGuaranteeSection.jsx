import CheckBox from '@components/ui/CheckBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import PropTypes from 'prop-types';

export default function PolicyFinanceGuaranteeSection({
  form,
  grnteFundsUsageOptions,
  grnteGoodsKindOptions,
  grnteRateSummarySelectOptions,
  handleInputChange,
  handleMultiValueChange,
  createCheckboxId,
}) {
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
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.grntePrtrtCndCn}
                  onChange={(value) => handleInputChange('grntePrtrtCndCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>보증료율 감면</td>
              <td colSpan={3}>
                <RichEditor
                  theme="light"
                  minHeight={160}
                  value={form.grfeCn}
                  onChange={(value) => handleInputChange('grfeCn', value)}
                />
              </td>
            </tr>
            <tr>
              <td>보증비율</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.grnteRtCn}
                  onChange={(e) => handleInputChange('grnteRtCn', e)}
                />
              </td>
              <td>추천기관</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.grnteRcmdtnInstNm}
                  onChange={(e) => handleInputChange('grnteRcmdtnInstNm', e)}
                />
              </td>
            </tr>
            <tr>
              <td>지원대상자금용도</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {grnteFundsUsageOptions.map((option) => (
                    <CheckBox
                      key={`grnteSprtTrgtFndsUsgCn_${option.value}`}
                      chkId={createCheckboxId(
                        'grnteSprtTrgtFndsUsgCn',
                        option.value
                      )}
                      chkName={option.label}
                      value={option.value}
                      checked={form.grnteSprtTrgtFndsUsgCn.includes(option.value)}
                      onChange={handleMultiValueChange('grnteSprtTrgtFndsUsgCn')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>지원대상자금(용도)요약</td>
              <td colSpan={3}>
                <MenuInputBox
                  menuType="input"
                  menuSize="100%"
                  value={form.grnteSprtTrgtFndsUsgSmryCn}
                  onChange={(e) =>
                    handleInputChange('grnteSprtTrgtFndsUsgSmryCn', e)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>상품종류</td>
              <td colSpan={3}>
                <div className="oncheckBox">
                  {grnteGoodsKindOptions.map((option) => (
                    <CheckBox
                      key={`grnteGdsKndCd_${option.value}`}
                      chkId={createCheckboxId('grnteGdsKndCd', option.value)}
                      chkName={option.label}
                      value={option.value}
                      checked={form.grnteGdsKndCd.includes(option.value)}
                      onChange={handleMultiValueChange('grnteGdsKndCd')}
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>보증비율요약코드</td>
              <td>
                <MenuInputBox
                  menuType="select"
                  menuSize="300px"
                  showAllOption={false}
                  options={grnteRateSummarySelectOptions}
                  value={form.grnteRtSmryCd}
                  onChange={(e) => handleInputChange('grnteRtSmryCd', e)}
                />
              </td>
              <td>보증비율요약</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.grnteRtSmryCn}
                  onChange={(e) => handleInputChange('grnteRtSmryCn', e)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

PolicyFinanceGuaranteeSection.propTypes = {
  form: PropTypes.object.isRequired,
  grnteFundsUsageOptions: PropTypes.array.isRequired,
  grnteGoodsKindOptions: PropTypes.array.isRequired,
  grnteRateSummarySelectOptions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleMultiValueChange: PropTypes.func.isRequired,
  createCheckboxId: PropTypes.func.isRequired,
};
