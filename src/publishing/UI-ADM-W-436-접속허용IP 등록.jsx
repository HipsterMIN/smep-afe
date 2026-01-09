import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import Button from '../components/ui/Button';
import Popup from '../components/ui/Popup.jsx';

export default function CommonCode() {
  return (
    <Popup title="접속허용 IP 등록" isBtns={true} autoHeight={true}>
      <div className="oncontent ontable-form">
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '300px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>IP</td>
                <td style={{ borderRight : '1px solid #E1E1E1', paddingLeft : '15px' }}>메모</td>
                <td style={{ paddingLeft : '15px' }}>사용여부</td>
              </tr>
              <tr>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox menuType="input" menuSize="250px" placeholder="100.0.0" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>
                  <MenuInputBox menuType="input" menuSize="250px" placeholder="메모" />
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
        <Button btnType="add" btnNames="등록" />
      </div>
    </Popup>
  );
}
