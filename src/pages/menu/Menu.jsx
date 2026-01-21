import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import RadioButton from '../../components/ui/RadioButton.jsx';
import GridTable from '../../components/ui/GridTable.jsx';
import MenuInputBox from '../../components/ui/MenuInputBox.jsx';
import ButtonCell from '../../components/custom/ButtonCell';

export default function Menu() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수
  const [rows, setRows] = useState([
    {
      menuId: 'M_PIIO_00001',
      menuNm: '관리자 최상위메뉴',
      sortSeq: 0,
      scrnUrlAddr: '/admin',
      scrnTypeCd: '그룹',
      scrnUseYn: 'Y',
      data: [
        {
          menuId: 'M_PIIO_00002',
          menuNm: '지원사업 관리',
          sortSeq: 1,
          scrnUrlAddr: '/admin/sprtBiz',
          scrnTypeCd: '메뉴',
          scrnUseYn: 'Y',
          data:[
            {
              menuId: 'M_PIIO_00009',
              menuNm: '사업공고 관리자자자자자다다다다가가가 아아아',
              sortSeq: 1,
              scrnUrlAddr: '/admin/sprtBiz/bizPbanc',
              scrnTypeCd: '메뉴',
              scrnUseYn: 'Y',
            },
          ]
        },
      ]
    },
  ]);

  const [form, setForm] = useState({
    menuId: '',
    menuNm: '',
    sortSeq: '',
    scrnUrlAddr: '',
    scrnTypeCd: '',
    useYn: 'Y',
    upMenuId: null,
  });

  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: extractVal(value) }));
  };

  const handleSearch = () => {
    console.log('검색 실행 - 현재는 로컬 데이터에서 동작하지 않음');
  };

  const handleEdit = (row) => {
    setForm({
      menuId: row.menuId || '',
      menuNm: row.menuNm || '',
      sortSeq: row.sortSeq ?? '',
      scrnUrlAddr: row.scrnUrlAddr || '',
      scrnTypeCd: row.scrnTypeCd || '',
      useYn: row.scrnUseYn || 'Y',
      upMenuId: row.upMenuId || null,
    });
    setSelectedValue(row.scrnUseYn || null);
  };

  const handleDeleteRow = (row) => {
    if (!row || !row.menuId) return;
    if (!window.confirm(`${row.menuNm}(${row.menuId}) 을(를) 삭제하시겠습니까?`)) return;
    setRows((prev) => prev.filter((r) => r.menuId !== row.menuId));
  };

  const handleSave = () => {
    console.log(form);
    // 간단한 로컬 저장(동일 ID면 업데이트, 없으면 추가)
    setRows((prev) => {
      const exists = prev.some((r) => r.menuId === form.menuId && form.menuId !== '');
      if (exists) {
        return prev.map((r) => (r.menuId === form.menuId ? { ...r, ...form } : r));
      }
      if (!form.menuId) {
        alert('메뉴ID를 입력하세요.');
        return prev;
      }
      return [...prev, { ...form }];
    });
    alert('저장되었습니다. (로컬 적용)');
  };

  const handleDelete = () => {
    if (!form.menuId) {
      alert('삭제할 메뉴를 선택하세요.');
      return;
    }
    if (!window.confirm(`${form.menuNm}(${form.menuId}) 을(를) 삭제하시겠습니까?`)) return;
    setRows((prev) => prev.filter((r) => r.menuId !== form.menuId));
    setForm({
      menuId: '',
      menuNm: '',
      sortSeq: '',
      scrnUrlAddr: '',
      scrnTypeCd: '',
      useYn: 'Y',
      upMenuId: null,
    });
    alert('삭제되었습니다. (로컬 적용)');
  };

  // 관리 셀: 편집 / 삭제 버튼
  const ManagementCell = ({ row, data }) => {
    const item = row || data || {};
    return (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button btnType="edit" btnNames="수정" onClick={() => handleEdit(item)} />
          <Button btnType="edit" btnNames="하위추가" onClick={() => handleDeleteRow(item)} />
        </div>
    );
  };

  const columns = [
    { id: 'menuNm', header: '메뉴명', treetoggle: true, resize: true, width: 200 },
    { id: 'menuId', header: '메뉴ID', resize: true, width: 120 },
    { id: 'sortSeq', header: '순서', resize: true, width:50},
    { id: 'scrnUrlAddr', header: 'URL', resize: true, width:150},
    { id: 'scrnTypeCd', header: '유형', resize: true, width:50},
    { id: 'scrnUseYn', header: '사용여부', resize: true, width:80},
    { id: 'management', header: '관리', resize: true, cell: (props) => <ManagementCell {...props} /> },
  ];

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>사용자 메뉴 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>사용자 메뉴관리</li>
          <li className="on">사용자 메뉴목록</li>
        </ul>
      </div>

      <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>메뉴 목록</h4>
            <div className="onselect-form open" style={{minHeight: 'auto'}}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="input"
                  menuName="메뉴ID"
                  menuSize="150px"
                  placeholder="ID 입력"
                />
                <MenuInputBox
                  menuType="input"
                  menuName="메뉴명"
                  menuSize="300px"
                />
                <div style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" onClick={handleSearch} />
                </div>
              </div>
              <div className="onparagraph middle"> 
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  menuName="URL"
                />
                <MenuInputBox
                  menuType="select"
                  menuName="유형"
                  selectOption="Y"
                />
                <MenuInputBox
                  menuType="select"
                  menuName="사용여부"
                  selectOption="전체"
                />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{rows.length}</b>건
            </span>
            <div className="onbtns">
              <button className="onallopen-ico" type="button" />
              <button className="onallclose-ico" type="button" />
            </div>
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <GridTable columns={columns} data={rows} gridProps={{ tree: true }} />
          </div>
        </div>
    
        <div className="oncontent ontable-form">
          <h4>메뉴 등록/수정</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>메뉴 ID</td>
                  <td>
                    <MenuInputBox
                        menuType="input"
                        menuSize="300px"
                        value={form.menuId}
                        onChange={(v) => handleInputChange('menuId', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>메뉴 명</td>
                  <td>
                    <MenuInputBox
                        menuType="input"
                        menuSize="300px"
                        value={form.menuNm}
                        onChange={(v) => handleInputChange('menuNm', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상위메뉴</td>
                  <td>시스템 관리 {'>'} 시스템 설정 {'>'} 게시판 관리</td>
                </tr>
                <tr>
                  <td>유형</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="그룹메뉴"
                        radioName="그룹메뉴"
                        selectedValue={form.scrnTypeCd}
                        onChange={(v) => handleInputChange('scrnTypeCd', v)}
                      />
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="게시판"
                        radioName="게시판"
                        selectedValue={form.scrnTypeCd}
                        onChange={(v) => handleInputChange('scrnTypeCd', v)}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="화면"
                        radioName="화면"
                        selectedValue={form.scrnTypeCd}
                        onChange={(v) => handleInputChange('scrnTypeCd', v)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>전시 순서</td>
                  <td>
                    <MenuInputBox
                        menuType="input"
                        menuSize="300px"
                        value={form.sortSeq}
                        onChange={(v) => handleInputChange('sortSeq', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>URL</td>
                  <td>
                    <MenuInputBox
                        menuType="input"
                        menuSize="300px"
                        value={form.scrnUrlAddr}
                        onChange={(v) => handleInputChange('scrnUrlAddr', v)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>GNB 노출 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="노출"
                        radioName="노출"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="노출안함"
                        radioName="노출안함"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>LNB 노출 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="노출"
                        radioName="노출"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="노출안함"
                        radioName="노출안함"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>사이트맵 노출 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="사용"
                        radioName="사용"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="사용안함"
                        radioName="사용안함"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>사용 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="1"
                        radioGroup="group1"
                        radioValue="사용"
                        radioName="사용"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                      <RadioButton
                        groupId="2"
                        radioGroup="group1"
                        radioValue="사용안함"
                        radioName="사용안함"
                        selectedValue={selectedValue}
                        onChange={setSelectedValue}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>최종수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
            <Button btnType="add" btnNames="저장" onClick={handleSave} />
            <Button btnType="del" btnNames="삭제" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
