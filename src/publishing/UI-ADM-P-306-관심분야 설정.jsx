import { useState } from 'react';

import RadioButton  from "../components/ui/RadioButton.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import Button from '../components/ui/Button';
import CheckBox from '../components/ui/CheckBox';
import GridTable from '../components/ui/GridTable';
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import Popup from '../components/ui/Popup.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
      <Popup title="관심분야 설정" isBtns={true}>
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <h4>관심정보</h4>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>관심분야</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="1_1" chkName="금융" />
                      <CheckBox chkId="1_2" chkName="기술" />
                      <CheckBox chkId="1_3" chkName="수출" />
                      <CheckBox chkId="1_4" chkName="내수" />
                      <CheckBox chkId="1_5" chkName="창업" />
                      <CheckBox chkId="1_6" chkName="경영" />
                      <CheckBox chkId="1_7" chkName="..." />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>지원유형</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="2_1" chkName="창업" />
                      <CheckBox chkId="2_2" chkName="기술개발" />
                      <CheckBox chkId="2_3" chkName="수출" />
                      <CheckBox chkId="2_4" chkName="내수" />
                      <CheckBox chkId="2_5" chkName="창업" />
                      <CheckBox chkId="2_6" chkName="경영" />
                      <CheckBox chkId="2_7" chkName="..." />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontableBox">
            <h4>기업정보</h4>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>기업규모</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="3_1" chkName="금융" />
                      <CheckBox chkId="3_2" chkName="기술" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>업종</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="4_1" chkName="창업" />
                      <CheckBox chkId="4_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>업력</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="5_1" chkName="창업" />
                      <CheckBox chkId="5_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>근로자수</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="6_1" chkName="창업" />
                      <CheckBox chkId="6_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>매출액</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="7_1" chkName="창업" />
                      <CheckBox chkId="7_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>소재지</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="8_1" chkName="창업" />
                      <CheckBox chkId="8_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>인증</td>
                  <td>
                    <div className="oncheckBox">
                      <CheckBox chkId="9_1" chkName="창업" />
                      <CheckBox chkId="9_2" chkName="기술개발" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="btns">
          <Button btnType="list" btnNames="닫기" />
          <Button btnType="add" btnNames="저장" />
        </div>
      </Popup>
    </div>
  );
}
