import Button  from "../components/ui/Button.jsx";
import MenuInputBox from "../components/ui/MenuInputBox.jsx";

export default function CommonCode() {

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
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="게시판 ID" menuSize="100px" />
              <MenuInputBox menuType="input" menuName="게시판 명" placeholder="검색어를 입력하세요." menuSize="200px" />
              <MenuInputBox menuType="select" menuName="유형" selectOption="Y" menuSize="100px" />
              <MenuInputBox menuType="input" menuName="소개글" placeholder="검색어를 입력하세요." menuSize="200px" />
              <MenuInputBox menuType="select" menuName="공개여부" selectOption="Y" menuSize="100px" />
              <MenuInputBox menuType="select" menuName="사용여부" selectOption="Y" menuSize="100px" />

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>
          <div className="onstatistics">
            <div className="onflexrow">
              <dl>
                <dt>연령</dt>
                <dd>1</dd>
              </dl>
              <dl>
                <dt>직업</dt>
                <dd>2</dd>
              </dl>
              <dl>
                <dt>성별</dt>
                <dd>3</dd>
              </dl>
              <dl>
                <dt>연령</dt>
                <dd>4</dd>
              </dl>
            </div>

            <div className="onflexrow">
              <dl>
                <dt>질의 내용1</dt>
                <dd>1</dd>
              </dl>
              <dl>
                <dt>질의 내용2</dt>
                <dd>2</dd>
              </dl>
              <dl>
                <dt>질의 내용3</dt>
                <dd>3</dd>
              </dl>
              <dl>
                <dt>질의 내용4</dt>
                <dd>4</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
