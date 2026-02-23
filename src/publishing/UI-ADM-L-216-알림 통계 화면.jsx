import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
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
        <h2>알림 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">알림 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
					<div className="onsection">
						<div className="infoNumber-box">
							<ul className="infoNumber-list">
								<li className="infoNumber-item">
									<span className="infoNumber-tit">총 발송 건 수</span>
									<div className="count-box">
										<strong>999,999</strong>건
									</div>
								</li>
								<li className="infoNumber-item">
									<span className="infoNumber-tit">발송 성공률</span>
									<div className="count-box">
										<strong>90%</strong> (82,9340건)
									</div>
								</li>
								<li className="infoNumber-item">
									<span className="infoNumber-tit">클릭율</span>
									<div className="count-box">
										<strong>90%</strong> (82,9340건)
									</div>
								</li>
								<li className="infoNumber-item">
									<span className="infoNumber-tit">수신 거부율</span>
									<div className="count-box">
										<strong>0.2%</strong> (8건)
									</div>
								</li>
							</ul>
						</div>
					</div>
        
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
							<div className="ondatepickerbox">
                <DatepickerBox menuName="기간" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <MenuInputBox menuType="select" menuName="알림구분" selectOption="구분" menuSize="150px" />
							<MenuInputBox menuType="input" menuName="검색어" menuSize="500px" placeholder="검색어를 입력하세요." />
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>

          </div>
          <div className="onstatistics" style={{ marginBottom: '40px' }}>
            <div className="onflexrow onchartgroup">
							<dl>
                <dt>기간별 추이 그래프</dt>
                <dd><MonthlyMultiLineChart data={data} configurations={configurations} height={320} /></dd>
              </dl>
            </div>
          </div>

					<div className="oncontent ontable-form">
						<div className="ontableBox onbgtable">
							<table>
								<colgroup>
									<col style={{ width: '150px' }} />
									<col style={{ width: '150px' }} />
									<col style={{ width: '150px' }} />
									<col style={{ width: 'auto' }} />
								</colgroup>
								<tbody>
									<tr>
										<td className="onbgtxtcenter">순번</td>
										<td className="br-right ontxtcenter ontxtbold">발송일시</td>
										<td className="onbgtxtcenter">구분</td>
										<td className="br-right onbgtxtcenter ontxtbold">제목</td>
										<td className="onbgtxtcenter ontxtbold">발송대상</td>
										<td className="br-right onbgtxtcenter ontxtbold">성공률</td>
										<td className="onbgtxtcenter ontxtbold">클릭율</td>
										<td className="onbgtxtcenter ontxtbold">수신거부율</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">999</td>
										<td className="br-right ontxtcenter ontxtnormal">YYYY-MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">100</td>
										<td className="br-right ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">0.12%</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">999</td>
										<td className="br-right ontxtcenter ontxtnormal">YYYY-MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">100</td>
										<td className="br-right ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">0.12%</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">999</td>
										<td className="br-right ontxtcenter ontxtnormal">YYYY-MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">100</td>
										<td className="br-right ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">99.1%</td>
										<td className="ontxtcenter ontxtnormal">0.12%</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					
        </div>
      </div>
    </div>
  );
}
