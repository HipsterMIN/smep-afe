import { useState } from 'react';
import Button from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from "../components/ui/DatepickerBox.jsx";
import DateBarChart from "../components/ui/DateBarChart.jsx";
import DonutChart from '../components/ui/DonutChart';

export default function CommonCode() {
   const dailyData = [
    { date: '11-1', value: 5 },
    { date: '11-2', value: 52 },
    { date: '11-3', value: 45 },
    { date: '11-4', value: 38 },
    { date: '11-5', value: 55 },
    { date: '11-6', value: 55 },
    { date: '11-7', value: 55 },
    { date: '11-8', value: 55 },
    { date: '11-9', value: 5 },
    { date: '11-10', value: 52 },
    { date: '11-18', value: 45 },
    { date: '11-19', value: 38 },
    { date: '11-20', value: 55 },
    { date: '11-21', value: 55 },
    { date: '11-22', value: 55 },
    { date: '11-23', value: 55 },
    { date: '11-24', value: 55 },
    { date: '11-25', value: 55 },
    { date: '11-26', value: 55 },
    { date: '11-27', value: 55 },
    { date: '11-28', value: 55 },
    { date: '11-29', value: 55 },
    { date: '11-30', value: 55 },
    { date: '12-1', value: 55 },
    { date: '12-2', value: 55 },
    { date: '12-3', value: 55 },
    { date: '12-4', value: 55 },
    { date: '12-5', value: 55 },
    { date: '12-6', value: 55 },
    { date: '12-7', value: 55 },
    { date: '12-8', value: 55 },
    { date: '12-9', value: 55 },
    { date: '12-10', value: 55 },
    { date: '12-11', value: 55 },
    { date: '12-12', value: 55 },
    { date: '12-13', value: 55 },
    { date: '12-14', value: 55 },
    { date: '12-15', value: 55 },
    { date: '12-16', value: 55 },
    { date: '12-17', value: 55 },
    { date: '12-18', value: 55 },
    { date: '12-19', value: 55 },
    { date: '12-20', value: 55 },
    { date: '12-21', value: 55 },
    { date: '12-22', value: 55 },
    { date: '12-23', value: 55 },
    { date: '12-24', value: 55 },
    { date: '12-25', value: 55 },
    { date: '12-26', value: 55 },
    { date: '12-27', value: 55 },
    { date: '12-28', value: 55 },
    { date: '12-29', value: 55 },
    { date: '12-30', value: 55 },
    { date: '12-31', value: 55 },
    { date: '1-1', value: 55 },
    { date: '1-2', value: 55 },
    { date: '1-3', value: 55 },
    { date: '1-4', value: 55 },
    { date: '1-5', value: 55 },
    { date: '1-6', value: 55 },
    { date: '1-7', value: 55 },
    { date: '1-8', value: 55 },
    { date: '1-9', value: 55 },
    { date: '1-10', value: 55 },
    { date: '1-11', value: 55 },
    { date: '1-12', value: 55 },
    { date: '1-13', value: 55 },
    { date: '1-14', value: 55 },
    { date: '1-15', value: 55 },
    { date: '1-16', value: 55 },
    { date: '1-17', value: 55 },
    { date: '1-18', value: 55 },
    { date: '1-19', value: 55 },
    { date: '1-20', value: 55 },
    { date: '1-21', value: 55 },
    { date: '1-22', value: 55 },
    { date: '1-23', value: 55 },
    { date: '1-24', value: 55 },
    { date: '1-25', value: 55 },
    { date: '1-26', value: 55 },
    { date: '1-27', value: 55 },
    { date: '1-28', value: 55 },
    { date: '1-29', value: 55 },
    { date: '1-30', value: 55 },
    
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
  
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
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
                legend="정책자금 상담 접수 건 수"
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
