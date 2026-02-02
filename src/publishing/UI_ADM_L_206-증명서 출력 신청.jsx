import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import DonutChart from "../components/ui/DonutChart.jsx";
import BarChart from "../components/ui/BarChart.jsx";


export default function CommonCode() {
  const data1 = [
    { label: '중소기업확인서', value: 90 },
  ];

  const dailyData = [
    { date: '11-1', value: 5 },
    { date: '11-2', value: 52 },
    { date: '11-3', value: 45 },
    { date: '11-4', value: 38 },
    { date: '11-5', value: 55 },
    { date: '11-6', value: 55 },
    { date: '11-7', value: 55 },
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">증명서 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
          {/** open 클래스로 동작, 펼치기/접기 */}
          <div className="onparagraph">
            <div className="ondatepickerbox">
              <DatepickerBox menuName="기간" />
              <span className="onunit">~</span>
              <DatepickerBox />
            </div>

            <div className=""  style={{ marginLeft: 'auto' }}>
              <Button btnType="menuSearch" btnNames="검색" />
            </div>
          </div>
        </div>

        <div className="onsection">
          <h3 className="onsubtitle">증명서 출력 신청</h3>
          <div className="infoNumber-box">
            <ul className="infoNumber-list">
              <li className="infoNumber-item">
                <span className="infoNumber-tit">전체 신청 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">금일 신청 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">전일 신청 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">출력 실패 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="onsection">
          <h3 className="onsubtitle mb-24">증명서별 신청 건수</h3>
          <div className="ondividegroup">
            <div className="ondividegroup-item">
              <div className="chartbox">
                <DonutChart
                  data={data1}
                  />
              </div>
            </div>

            <div className="ondividegroup-item">
                <div className="ontableBox">
                <table className="">
                  <colgroup>
                    <col style={{ width: '150px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: 'auto' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>증명서 종류</th>
                      <th>회사명</th>
                      <th>내용</th>
                      <th>일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="onbgtxtcenter">1월</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">2026.02.02</td>
                    </tr>
                    <tr>
                      <td className="onbgtxtcenter">2월</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">2026.02.02</td>
                    </tr>
                    <tr>
                      <td className="onbgtxtcenter">3월</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">xxxxx</td>
                      <td className="onbgtxtcenter">2026.02.02</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="onsection">
          {/* 일별 증명서별 신청건수 */}
          <h3 className="onsubtitle mb-24">일별 방문자(최근 30일)</h3>
          <div>
            <BarChart data={dailyData} />
          </div>
        </div>

      </div>
    </div>
  );
}
