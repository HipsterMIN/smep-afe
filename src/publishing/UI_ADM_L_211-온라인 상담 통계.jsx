import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import DateBarChart from "../components/ui/DateBarChart.jsx";
import DonutChart from '../components/ui/DonutChart';

export default function CommonCode() {
   const dailyData = [
    { date: '1월', value: 5 },
    { date: '2월', value: 52 },
    { date: '3월', value: 45 },
    { date: '4월', value: 38 },
    { date: '5월', value: 55 },
    { date: '6월', value: 55 },
    { date: '7월', value: 55 },
    { date: '8월', value: 55 },
    { date: '9월', value: 5 },
    { date: '10월', value: 52 },
    { date: '11월', value: 45 },
    { date: '12월', value: 38 },
   
  ];

  const data1 = [
    { label: '전체', value: 30 },
    { label: '금융', value: 12 },
    { label: '기술', value: 12 },
    { label: '인력', value: 12 },
    { label: '수출', value: 12 },
    { label: '내수', value: 12 },
    { label: '창업', value: 12 },
    { label: '경영', value: 12 },
    { label: '소상공인', value: 12 },
    { label: '협업', value: 12 },
  ];
  
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>온라인 상담 통계​</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">온라인 상담 통계​</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="onsection">
          <div className="infoNumber-box">
            <ul className="infoNumber-list">
              <li className="infoNumber-item">
                <span className="infoNumber-tit">총 상담 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">상담 완료 건수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">중도 이탈 수</span>
                <div className="count-box">
                  <strong>999,999</strong>건
                </div>
              </li>
              <li className="infoNumber-item">
                <span className="infoNumber-tit">이탈 률</span>
                <div className="count-box">
                  <strong>99,99</strong>%
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="구분" selectOption="" menuSize="150px" />
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
          <h3 className="onsubtitle">온라인 상담 접수 현황</h3>
          <div className="onstatistics mt-24">
            <div >
              <DateBarChart 
                data={dailyData} 
                legend="온라인 상담 접수 건"
                />
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
                  <th scope="col"></th>
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
                  <td className="onbgtxtcenter br-right" scope="row">상담건수</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">완료건수</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right" scope="row">중도이탈수</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="onstatistics">
            {/* donut chart */}
             <div className="onflexrow onchartgroup mt-24">
              <dl>
                <dt>지원분야별 상담통계</dt>
                <dd>
                  <DonutChart
                    data={data1}
                  />
                </dd>
              </dl>
              <dl>
                <dt>기업분야별 상담통계</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>자금유형별 상담통계​</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="onsection">
          <h3 className="onsubtitle mb-24">상담경로별 접수 현황</h3>
          <div className="ontableBox">
            <table className="ontable-data">
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '200px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>순번</th>
                  <th>상담경로</th>
                  <th>건수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">XXXXXX  XXXXX XXXXX</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">XXXXXX  XXXXX XXXXX</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
                <tr>
                  <td className="onbgtxtcenter br-right">999</td>
                  <td className="onbgtxtcenter br-right">XXXXXX  XXXXX XXXXX</td>
                  <td className="onbgtxtcenter">99,999​</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



      </div>
    </div>
  );
}
