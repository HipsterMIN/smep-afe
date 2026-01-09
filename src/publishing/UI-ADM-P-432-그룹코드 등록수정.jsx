import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import Button from '../components/ui/Button';
import Popup from '../components/ui/Popup.jsx';

export default function CommonCode() {
  return (
    <Popup title="그룹코드 등록/수정" isBtns={true} autoHeight={true}>
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '60px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>코드 ID</td>
                <td style={{ borderRight : '1px solid #E1E1E1' }}>코드 명</td>
                <td style={{ paddingLeft : '15px' }}>그룹코드 설명</td>
                <td style={{ paddingLeft : '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox menuType="input" menuSize="50px" placeholder="ABC" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox menuType="input" menuSize="250px" placeholder="총괄 관리자" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox menuType="input" menuSize="250px" placeholder="Code Info..." />
                </td>
                <td style={{ paddingLeft : '15px' }}>
                  <MenuInputBox menuType="select" menuSize="250px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="btns">
        <Button btnType="add" btnNames="저장" />
        <Button btnType="del" btnNames="삭제" />
      </div>
    </Popup>
  );
}
