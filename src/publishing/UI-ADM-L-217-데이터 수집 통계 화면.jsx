import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import DataBarGadientChart from "../components/ui/DataBarGadientChart.jsx";
import DonutGraphChart from "../components/ui/DonutGraphChart.jsx";

export default function CommonCode() {
  // chart dummy data
  const data1 = [
    { date: "02-20", value: 19 },
    { date: "02-21", value: 37 },
    { date: "02-22", value: 61 },
    { date: "02-23", value: 41 },
    { date: "02-24", value: 16 },
    { date: "02-25", value: 15 },
    { date: "02-26", value: 68 },
    { date: "02-27", value: 39 },
    { date: "02-28", value: 50 },
    { date: "02-29", value: 14 },
  ];

  const data2 = [
    { label: "사업공고", value: 80 },
    { label: "지원사업공고", value: 60 },
    { label: "사업신청", value: 150 },
    { label: "정책금융", value: 200 },
    { label: "그 외", value: 300 },
  ];


  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>데이터 수집 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">실시간 데이터 수집 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="oninfoNavbar">
            <div className="oninfoNavLeft">
              <dl>
                <dt>시스템 상태</dt>
                <dd>
                  <span className="onDotState normal">정상가동중</span>
                  {/* <span className="onDotState delay">수집지연</span> */}
                  {/* <span className="onDotState failure">장애발생</span> */}
                  {/* <span className="onDotState inspect">점검중</span> */}
                </dd>
                <dd className="onupdates">(최종 갱신 : 2025-01-28)</dd>
              </dl>
            </div>
            <div className="oninfoNavRight">
              <dl className="default">
                <dt>금일 총 수집건수</dt>
                <dd>15,530건</dd>
              </dl>
              <dl className="truth">
                <dt>성공</dt>
                <dd>15,529건</dd>
              </dl>
              <dl className="fail">
                <dt>실패</dt>
                <dd>1건</dd>
              </dl>
              <span>148KB</span>
            </div>
          </div>

          <div className="onselect-form open" style={{minHeight: 'auto'}}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <div className="ondatepickerbox">
                <DatepickerBox menuName="기간" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              <MenuInputBox menuType="select" menuName="공고기관" selectOption="" menuSize="200px" />
              <MenuInputBox menuType="select" menuName="수집상태" selectOption="" menuSize="80px" />
              <MenuInputBox menuType="select" menuName="수집대상" selectOption="" menuSize="80px" />
              <MenuInputBox menuType="input" menuName="검색어" menuSize="450px" placeholder="검색어를 입력하세요." />
              <div className="onbtn" style={{marginLeft: 'auto'}}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>
        
          <div className="onstatistics" style={{ marginBottom: '40px' }}>
            <div className="onflexrow onchartgroup">
							<dl>
                <dt>일별 수집건수</dt>
                <dd style={{ height : '400px' }}>
                  <DataBarGadientChart
                    data={data1}
                    height={320}
                    tooltipDateFormatter={(ds) => {
                      const m = parseInt(ds.slice(0, 2), 10);
                      const d = parseInt(ds.slice(3, 5), 10);
                      return `${m}월${d}일`;
                    }}
                  />
                </dd>
              </dl>
              
							<dl>
                <dt>수집 대상별 비율</dt>
                <dd style={{ height : '400px' }}>
                  <DonutGraphChart
                    data={data2}
                    centerLabel="65%"
                    centerSubLabel="발송 성공률"
                  />
                </dd>
              </dl>
            </div>
          </div>

					<div className="oncontent ontable-form">
						<div className="ontableBox onbgtable">
							<table>
								<colgroup>
									<col style={{ width: '50px' }} />
									<col style={{ width: '150px' }} />
									<col style={{ width: '50px' }} />
									<col style={{ width: '150px' }} />
									<col style={{ width: '150px' }} />
									<col style={{ width: '50px' }} />
									<col style={{ width: '100px' }} />
								</colgroup>
								<tbody>
									<tr>
										<td className="onbgtxtcenter">상태</td>
										<td className="br-right ontxtcenter ontxtbold">수집일시</td>
										<td className="onbgtxtcenter">수집 대상</td>
										<td className="br-right onbgtxtcenter ontxtbold">작업명</td>
										<td className="onbgtxtcenter ontxtbold">공고기관</td>
										<td className="br-right onbgtxtcenter ontxtbold">수집건수</td>
										<td className="onbgtxtcenter ontxtbold">데이터 크기</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">성공</td>
										<td className="br-right ontxtcenter ontxtnormal">MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고정보</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">중소기업기술정보진흥원</td>
										<td className="br-right ontxtcenter ontxtnormal">100</td>
										<td className="ontxtcenter ontxtnormal">14.5MB</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">실패</td>
										<td className="br-right ontxtcenter ontxtnormal">MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">중소기업기술정보진흥원</td>
										<td className="br-right ontxtcenter ontxtnormal">183</td>
										<td className="ontxtcenter ontxtnormal">14.5MB</td>
									</tr>
									<tr>
										<td className="ontxtcenter ontxtnormal">성공</td>
										<td className="br-right ontxtcenter ontxtnormal">MM-DD HH:MM</td>
										<td className="ontxtcenter ontxtnormal">공고</td>
										<td className="br-right ontxtcenter ontxtnormal">2026 지역전형별 소개글입니다.</td>
										<td className="ontxtcenter ontxtnormal">중소기업기술정보진흥원</td>
										<td className="br-right ontxtcenter ontxtnormal">32</td>
										<td className="ontxtcenter ontxtnormal">14.5MB</td>
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
