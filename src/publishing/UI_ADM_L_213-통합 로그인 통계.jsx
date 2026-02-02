import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";

export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
         <h2>통합로그인 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">통합로그인 통계</li>
        </ul>
      </div>
      <div className="oncontents">
       <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="연도" selectOption="" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="회원구분" selectOption="" menuSize="150px" />
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
        </div>

         <div className="ontableBox mt-24">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: '160px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">통합로그인 <br /> 사이트</th>
                  <th scope="col">1월</th>
                  <th scope="col">2월</th>
                  <th scope="col">3월</th>
                  <th scope="col">4월</th>
                  <th scope="col">5월</th>
                  <th scope="col">6월</th>
                  <th scope="col">7월</th>
                  <th scope="col">8월</th>
                  <th scope="col">9월</th>
                  <th scope="col">10월</th>
                  <th scope="col">11월</th>
                  <th scope="col">12월</th>
                  <th scope="col">계</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right">XXXXXXXXXXX</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right">XXXXXXXXXXX</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right">XXXXXXXXXXX</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
              </tbody>
            </table>
          </div>

       </div>
      </div>
    </div>
  );
}
