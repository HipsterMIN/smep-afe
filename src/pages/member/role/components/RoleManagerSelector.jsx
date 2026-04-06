import Button from '@components/ui/Button';
import CheckBox from '@components/ui/CheckBox';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';

export default function RoleManagerSelector() {
  return (
    <Popup title="소속인원 추가" isBtns={true} autoHeight={true}>
      <h4 className="onsubtitle" style={{ margin: '0 2px 12px' }}>
        미등록 인원
      </h4>
      <div className="ongrid-form" style={{ margin: '0 2px 8px' }}>
        <div className="flexRow">
          <MenuInputBox
            menuType="input"
            menuSize="300px"
            placeholder="검색어를 입력하세요."
          />
          <Button btnType="search" btnNames="검색" />
        </div>
        <Button btnType="add" btnNames="추가" />
      </div>
      <div className="oncontent ontable-form" style={{ paddingRight: '0' }}>
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
                <td>선택</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ID</td>
                <td>성명</td>
                <td>기관명</td>
              </tr>
              <tr>
                <td>
                  <CheckBox chkId="1" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                <td>홍길동</td>
                <td>기관</td>
              </tr>
              <tr>
                <td>
                  <CheckBox chkId="1" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                <td>홍길동</td>
                <td>기관</td>
              </tr>
              <tr>
                <td>
                  <CheckBox chkId="1" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                <td>홍길동</td>
                <td>기관</td>
              </tr>
              <tr>
                <td>
                  <CheckBox chkId="1" />
                </td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ABC</td>
                <td>홍길동</td>
                <td>기관</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Popup>
  );
}
