import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import MonthlyMultiLineChart from "../components/ui/MonthlyMultiLineChart.jsx";

export default function CommonCode() {
  // chart dummy data
  const data = [
		{ month: "1월", sent: 56, open: 48, click: 58 },
		{ month: "2월", sent: 52, open: 36, click: 61 },
		{ month: "3월", sent: 73, open: 42, click: 52 },
		{ month: "4월", sent: 63, open: 31, click: 43 },
		{ month: "5월", sent: 71, open: 38, click: 64 },
		{ month: "6월", sent: 62, open: 46, click: 57 },
		{ month: "7월", sent: 56, open: 39, click: 52 },
		{ month: "8월", sent: 67, open: 48, click: 58 },
		{ month: "9월", sent: 61, open: 27, click: 53 },
		{ month: "10월", sent: 72, open: 32, click: 43 },
		{ month: "11월", sent: 74, open: 32, click: 46 },
		{ month: "12월", sent: 66, open: 60, click: 55 },
	];

	const configurations = [
		{ key: "sent", label: "발송 성공률", color: "#2563eb" },
		{ key: "open", label: "오픈율", color: "#0f172a" },
		{ key: "click", label: "클릭율", color: "#14b8a6" },
	];

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
              <div className=""  style={{ marginLeft: 'auto' }}>
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

          <div className="onstatistics">
            <div className="onflexrow onchartgroup">
							<dl>
                <dt>서비스 별 이용통계</dt>
                <dd><MonthlyMultiLineChart data={data} configurations={configurations} height={320} /></dd>
              </dl>
            </div>
          </div>

       </div>
      </div>
    </div>
  );
}
