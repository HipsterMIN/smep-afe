import Button from '@components/ui/Button';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';

export default function RoleForm() {
  return (
    <Popup title="권한그룹 등록/수정" isBtns={true} autoHeight={true}>
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '60px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>ID</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>권한명</td>
                <td style={{ paddingLeft: '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td>ABC</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox
                    menuType="input"
                    menuSize="100%"
                    placeholder="총괄 관리자"
                  />
                </td>
                <td style={{ paddingLeft: '15px' }}>
                  <MenuInputBox menuType="select" menuSize="100%" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="btns">
        <Button btnType="add" btnNames="저장" />
      </div>
    </Popup>
  );
}
