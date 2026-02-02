import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
         <h2>서비스 이용 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">서비스 이용 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
       <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="연도" selectOption="" menuSize="150px" />
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
        </div>

         <div className="ontableBox mt-24">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">서비스별 통계</th>
                  <th scope="col">지원사업 신청</th>
                  <th scope="col">전자증명서 발급</th>
                  <th scope="col">정책자금 상담</th>
                  <th scope="col">디지털원패스 로그인</th>
                  <th scope="col">간편인증 로그인</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">1월</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">2월</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">3월</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                  <td className="onbgtxtcenter br-right">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">4월</td>
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
