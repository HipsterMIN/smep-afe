import PropTypes from 'prop-types';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import { useEffect, useRef, useState } from 'react';

export default function MenuBase({
                                     pageTitle,
                                     breadcrumb,
                                     mbrTypeCd,
                                     maxDepth,
                                     showBoardOption,
                                 }) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const apiRef = useRef(null);

    const [params, setParams] = useState({
        mbrTypeCd,
        menuId: '',
        menuNm: '',
        upMenuId: '',
        scrnUrlAddr: '',
        scrnTypeCd: '',
        useYn: '',
    });

    const [form, setForm] = useState({
        menuId: null,
        menuNm: '',
        sortSeq: '',
        scrnUrlAddr: '',
        scrnTypeCd: '',
        useYn: '',
        scrnUseYn: '',
        upMenuId: null,
        upScrnId: null,
        intgSysSeCd: 'PIIO',
        mbrTypeCd,
        upendMenuExpsrYn: '',
        lfsdMenuExpsrYn: '',
    });

    useEffect(() => {
        fetchMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await http.get('/api/v1/menuMng', { params });
            setRows(res?.data ?? []);
        } catch (err) {
            alert('메뉴 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

    const handleInputChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: extractVal(value) }));
    };

    const handleParamInputChange = (key, value) => {
        setParams((prev) => ({ ...prev, [key]: extractVal(value) }));
    };

    const handleSearch = () => {
        fetchMenus();
    };

    const handleEdit = (row) => {
        setForm({
            menuId: row.menuId,
            menuNm: row.menuNm,
            sortSeq: row.sortSeq,
            scrnUrlAddr: row.scrnUrlAddr,
            scrnTypeCd: row.scrnTypeCd,
            useYn: row.useYn,
            scrnUseYn: row.useYn,
            upMenuId: row.upMenuId,
            upScrnId: row.upScrnId,
            intgSysSeCd: 'PIIO',
            mbrTypeCd,
            upendMenuExpsrYn: row.upendMenuExpsrYn,
            lfsdMenuExpsrYn: row.lfsdMenuExpsrYn,
        });
    };

    const handleAdd = (row) => {
        setForm({
            menuId: null,
            menuNm: '',
            sortSeq: 0,
            scrnUrlAddr: '',
            scrnTypeCd: 'M',
            useYn: 'Y',
            scrnUseYn: 'Y',
            upMenuId: row?.menuId ?? null,
            upScrnId: row?.scrnId ?? null,
            intgSysSeCd: 'PIIO',
            mbrTypeCd,
            upendMenuExpsrYn: 'Y',
            lfsdMenuExpsrYn: 'Y',
        });
    };

    const handleSave = async () => {
        // validation
        if (!form.menuNm) {
            alert('메뉴명을 입력하세요.');
            return;
        }
        if (!window.confirm('저장하시겠습니까?')) return;

        if (form.menuId) {
            const res = await http.put(`/api/v1/menuMng/${form.menuId}`, form);
            if (res?.success) {
                alert('수정되었습니다.');
                fetchMenus();
            } else {
                alert('수정에 실패했습니다.');
            }
        } else {
            const res = await http.post(`/api/v1/menuMng`, form);
            if (res?.success) {
                alert('등록되었습니다.');
                fetchMenus();
            } else {
                alert('등록에 실패했습니다.');
            }
        }
    };

    const handleDelete = async () => {
        if (!form.menuId) {
            alert('삭제할 메뉴를 선택하세요.');
            return;
        }
        if (!window.confirm(`${form.menuNm}(${form.menuId}) 을(를) 삭제하시겠습니까?`)) return;

        const res = await http.delete(`/api/v1/menuMng/${form.menuId}`);
        if (res?.success) {
            alert('삭제되었습니다.');
            fetchMenus();
        } else {
            alert('삭제에 실패했습니다.');
        }
        setForm({
            menuId: null,
            menuNm: '',
            sortSeq: '',
            scrnUrlAddr: '',
            scrnTypeCd: '',
            useYn: '',
            scrnUseYn: '',
            upMenuId: null,
            upScrnId: null,
            intgSysSeCd: 'PIIO',
            mbrTypeCd,
            upendMenuExpsrYn: '',
            lfsdMenuExpsrYn: '',
        });
    };

    const ManagementCell = ({ row, data }) => {
        const item = row || data || {};
        const depth = typeof item.depth === 'number' ? item.depth : 0;
        const showEdit = depth !== 0;
        const showAddChild = depth !== maxDepth && item.scrnTypeCd !== 'T';
        if (depth === 0) {
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {showAddChild && <Button btnType="add" btnNames="하위추가" onClick={() => handleAdd(item)} />}
                </div>
            );
        }
        return (
            <div style={{ display: 'flex', gap: 8 }}>
                {showEdit && <Button btnType="edit" btnNames="수정" onClick={() => handleEdit(item)} />}
                {showAddChild && <Button btnType="add" btnNames="하위추가" onClick={() => handleAdd(item)} />}
            </div>
        );
    };

    ManagementCell.propTypes = {
        row: PropTypes.object,
        data: PropTypes.object,
    };

    const columns = [
        { id: 'menuNm', header: '메뉴명', treetoggle: true, resize: true, width: 200 },
        { id: 'menuId', header: '메뉴ID', resize: true, width: 110 },
        { id: 'sortSeq', header: '순서', resize: true, width: 43 },
        { id: 'scrnUrlAddr', header: 'URL', resize: true, width: 124 },
        { id: 'scrnTypeCd', header: '유형', resize: true, width: 42 },
        { id: 'useYn', header: '사용여부', resize: true, width: 66 },
        { id: 'management', header: '관리', width: 171, cell: (props) => <ManagementCell {...props} /> },
    ];

    function rowTreeState(type) {
        apiRef.current?.exec(type ? 'open-row' : 'close-row', { id: 0, nested: true });
    }

    return (
        <div className="oncontentbox">
            <div className="oncontentTitle">
                <h2>{pageTitle}</h2>
                <ul className="onbreadcrumb">
                    {breadcrumb.map((b, i) => (
                        <li key={i} className={i === breadcrumb.length - 1 ? 'on' : undefined}>
                            {b}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
                <div className="oncontent">
                    <div className="ongrid-form">
                        <h4>메뉴 목록</h4>
                        <div className="onselect-form open" style={{ minHeight: 'auto' }}>
                            <div className="onparagraph">
                                <MenuInputBox
                                    menuType="input"
                                    menuName="메뉴ID"
                                    menuSize="150px"
                                    placeholder="ID 입력"
                                    value={params.menuId}
                                    onChange={(v) => handleParamInputChange('menuId', v)}
                                />
                                <MenuInputBox
                                    menuType="input"
                                    menuName="메뉴명"
                                    menuSize="300px"
                                    value={params.menuNm}
                                    onChange={(v) => handleParamInputChange('menuNm', v)}
                                />
                                <div style={{ marginLeft: 'auto' }}>
                                    <Button btnType="menuSearch" btnNames="검색" onClick={handleSearch} disabled={loading} />
                                </div>
                            </div>
                            <div className="onparagraph middle">
                                <MenuInputBox menuType="input" menuSize="300px" menuName="URL" />
                                <MenuInputBox menuType="select" menuName="유형" selectOption="Y" />
                                <MenuInputBox menuType="select" menuName="사용여부" selectOption="전체" />
                            </div>
                        </div>
                    </div>

                    <div className="ontable-legend">
            <span>
              총 <b>{rows.length}</b>건
            </span>
                        <div className="onbtns">
                            <button className="onallopen-ico" type="button" onClick={() => rowTreeState(true)} />
                            <button className="onallclose-ico" type="button" onClick={() => rowTreeState(false)} />
                        </div>
                    </div>

                    <div className="ongrid-tableform onSCrollBox">
                        <GridTable columns={columns} data={rows} gridProps={{ tree: true, ref: apiRef }} />
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
                                <td>{form.menuId}</td>
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
                                            radioValue="M"
                                            radioName="그룹메뉴"
                                            selectedValue={form.scrnTypeCd}
                                            onChange={(v) => handleInputChange('scrnTypeCd', v)}
                                        />
                                        {mbrTypeCd === 'USR' && (
                                            <RadioButton
                                                groupId="2"
                                                radioGroup="group1"
                                                radioValue="L"
                                                radioName="게시판"
                                                selectedValue={form.scrnTypeCd}
                                                onChange={(v) => handleInputChange('scrnTypeCd', v)}
                                            />
                                        )}
                                        <RadioButton
                                            groupId="3"
                                            radioGroup="group1"
                                            radioValue="T"
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
                            {mbrTypeCd === 'USR' && (
                                <>
                                    <tr>
                                        <td>GNB 노출 여부</td>
                                        <td>
                                            <div className="onradioBox">
                                                <RadioButton
                                                    groupId="4"
                                                    radioGroup="group2"
                                                    radioValue="Y"
                                                    radioName="노출"
                                                    selectedValue={form.upendMenuExpsrYn}
                                                    onChange={(v) => handleInputChange('upendMenuExpsrYn', v)}
                                                />
                                                <RadioButton
                                                    groupId="5"
                                                    radioGroup="group2"
                                                    radioValue="N"
                                                    radioName="노출안함"
                                                    selectedValue={form.upendMenuExpsrYn}
                                                    onChange={(v) => handleInputChange('upendMenuExpsrYn', v)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>LNB 노출 여부</td>
                                        <td>
                                            <div className="onradioBox">
                                                <RadioButton
                                                    groupId="6"
                                                    radioGroup="group3"
                                                    radioValue="Y"
                                                    radioName="노출"
                                                    selectedValue={form.lfsdMenuExpsrYn}
                                                    onChange={(v) => handleInputChange('lfsdMenuExpsrYn', v)}
                                                />
                                                <RadioButton
                                                    groupId="7"
                                                    radioGroup="group3"
                                                    radioValue="N"
                                                    radioName="노출안함"
                                                    selectedValue={form.lfsdMenuExpsrYn}
                                                    onChange={(v) => handleInputChange('lfsdMenuExpsrYn', v)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <td>사용 여부</td>
                                <td>
                                    <div className="onradioBox">
                                        <RadioButton
                                            groupId="8"
                                            radioGroup="group4"
                                            radioValue="Y"
                                            radioName="사용"
                                            selectedValue={form.useYn}
                                            onChange={(v) => handleInputChange('useYn', v)}
                                        />
                                        <RadioButton
                                            groupId="9"
                                            radioGroup="group4"
                                            radioValue="N"
                                            radioName="사용안함"
                                            selectedValue={form.useYn}
                                            onChange={(v) => handleInputChange('useYn', v)}
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

                    <div className="onflexbtns" style={{justifyContent: 'flex-end'}}>
                        <Button btnType="add" btnNames="저장" onClick={handleSave}/>
                        <Button btnType="del" btnNames="삭제" onClick={handleDelete}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

MenuBase.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    breadcrumb: PropTypes.arrayOf(PropTypes.string).isRequired,
    mbrTypeCd: PropTypes.string.isRequired,
    maxDepth: PropTypes.number,
    showBoardOption: PropTypes.bool,
};

MenuBase.defaultProps = {
    maxDepth: 3,
    showBoardOption: true,
};