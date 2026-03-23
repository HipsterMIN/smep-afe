import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useNavigate } from 'react-router-dom';

export default function SmsForm() {
  const navigate = useNavigate();

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 양식 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li>SMS 양식 목록</li>
          <li className="on">SMS 양식 등록/수정</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>양식 ID</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                </tr>
                <tr>
                  <td>양식 명</td>
                  <td>
                    <MenuInputBox menuType="input" menuSize="500px" />
                  </td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td>
                    <div className="oneditcontent" />
                  </td>
                </tr>
                <tr>
                  <td>작성자</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>작성일</td>
                  <td>2025-12-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
          <Button btnType="del" btnNames="삭제" />
          <Button btnType="add" btnNames="저장" />
        </div>
      </div>
    </div>
  );
}
