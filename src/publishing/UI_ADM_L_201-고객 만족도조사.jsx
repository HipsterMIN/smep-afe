import Button  from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import DatepickerBox from '../components/ui/DatepickerBox.jsx';
import DonutChart from "../components/ui/DonutChart.jsx";


export default function CommonCode() {
  // chart dummy data
  const data1 = [
    { label: '10대 이하', value: 1000 },
    { label: '20대', value: 300 },
    { label: '30대', value: 150 },
    { label: '40대',value: 150 },
    { label: '50대', value: 500 },
    { label: '60대', value: 100 },
  ];
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>고객 만족도 통계</h2>
        <ul className="onbreadcrumb">
          <li>통계분석</li>
          <li>통계</li>
          <li className="on">고객만족도 통계</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="select" menuName="연령" selectOption="10대" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="직업" selectOption="전문직" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="성별" selectOption="남" menuSize="150px" />
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
          <div className="onstatistics">
            <div className="onflexrow onchartgroup">
              <dl>
                <dt>연령</dt>
                <dd><DonutChart data={data1} customColors={["#1C92FF", "#4FC3F7", "#81D4FA", "#B3E5FC", "#E1F5FE"]}/></dd>
              </dl>
              <dl>
                <dt>직업</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>성별</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>연령</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>

            <div className="onflexrow">
              <dl>
                <dt>질의 내용1</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>질의 내용2</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>질의 내용3</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
              <dl>
                <dt>질의 내용4</dt>
                <dd><DonutChart data={data1} /></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
