import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import PropTypes from 'prop-types';
import { Willow } from '@svar-ui/react-grid';
import { useCallback, useMemo } from 'react';

// ✅ 컴포넌트 밖 상수 — 렌더마다 새 객체 생성 방지
const GRID_PROPS = { rowHeight: 36, headerRowHeight: 40 };

export default function RecipientMemberPopup({
  title = '회원 목록',
  memberType = '',
  searchType = '',
  keyword = '',
  memberList = [],
  totalCount = 0,
  checkedIds = [],
  loading = false,
  gridViewportRef,
  onClose,
  onChangeMemberType,
  onChangeSearchType,
  onChangeKeyword,
  onSearch,
  onToggleCheck,
  onConfirm,
}) {
  const allChecked =
    memberList.length > 0 &&
    memberList.every((member) => checkedIds.includes(member.id));

  // ✅ useCallback — handleToggleAll이 매 렌더마다 새 참조가 되지 않도록
  const handleToggleAll = useCallback(() => {
    if (memberList.length === 0) return;

    if (allChecked) {
      memberList.forEach((member) => {
        if (checkedIds.includes(member.id)) {
          onToggleCheck(member.id);
        }
      });
      return;
    }

    memberList.forEach((member) => {
      if (!checkedIds.includes(member.id)) {
        onToggleCheck(member.id);
      }
    });
  }, [allChecked, memberList, checkedIds, onToggleCheck]);

  // ✅ useMemo가 실제로 작동하도록 deps 안정화
  const columns = useMemo(
    () => [
      {
        id: 'checked',
        header: (
          <CheckBox
            chkId="member-check-all"
            checked={allChecked}
            onChange={handleToggleAll}
          />
        ),
        width: 60,
        cell: ({ row }) => (
          <CheckBox
            chkId={`member-${row.id}`}
            checked={checkedIds.includes(row.id)}
            onChange={() => onToggleCheck(row.id)}
          />
        ),
      },
      { id: 'userId', header: '사용자ID', flexgrow: 1 },
      { id: 'name', header: '이름', flexgrow: 1 },
      { id: 'phoneNo', header: '전화번호', flexgrow: 1 },
      { id: 'email', header: '이메일주소', flexgrow: 1.5 },
    ],
    [allChecked, checkedIds, onToggleCheck, handleToggleAll]
  );

  return (
    <Popup title={title} autoHeight={true} onClose={onClose}>
      <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight: 'auto' }}>
          <div className="onparagraph">
            <MenuInputBox
              menuType="select"
              menuSize="120px"
              value={memberType}
              onChange={(e) => onChangeMemberType(e.target.value)}
              options={[
                { value: 'IND', label: '개인회원' },
                { value: 'ENT', label: '기업회원' },
                { value: 'MNG', label: '관리회원' },
              ]}
            />
            <MenuInputBox
              menuType="select"
              menuSize="120px"
              value={searchType}
              onChange={(e) => onChangeSearchType(e.target.value)}
              options={[
                { value: 'lgnId', label: '사용자ID' },
                { value: 'mbrNm', label: '이름' },
                { value: 'telno', label: '전화번호' },
              ]}
            />
            <MenuInputBox
              menuType="input"
              menuSize="240px"
              placeholder="검색어를 입력하세요."
              value={keyword}
              onChange={(e) => onChangeKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearch();
                }
              }}
            />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <Button btnType="menuSearch" btnNames="검색" onClick={onSearch} />
              <Button btnType="add" btnNames="추가" onClick={onConfirm} />
            </div>
          </div>
        </div>

        <div className="ontable-legend">
          <span>
            총 <b>{totalCount}</b>개
          </span>
        </div>

        <div className="ongrid-tableform" style={{ scrollbarGutter: 'stable' }}>
          <Willow>
            <div
              ref={gridViewportRef}
              style={{
                height: '420px',
                overflow: 'hidden',
              }}
            >
              <GridTable
                data={memberList}
                columns={columns}
                useWillow={false}
                gridProps={GRID_PROPS}
              />
            </div>
          </Willow>
        </div>

        {loading ? (
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              color: '#666',
              textAlign: 'right',
            }}
          >
            회원 목록을 불러오는 중입니다...
          </div>
        ) : null}
      </div>
    </Popup>
  );
}

RecipientMemberPopup.propTypes = {
  title: PropTypes.string,
  memberType: PropTypes.string,
  searchType: PropTypes.string,
  keyword: PropTypes.string,
  memberList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userId: PropTypes.string,
      name: PropTypes.string,
      phoneNo: PropTypes.string,
      email: PropTypes.string,
      mbrNo: PropTypes.string,
      mbrTypeCd: PropTypes.string,
      mbrTypeCdNm: PropTypes.string,
    })
  ),
  totalCount: PropTypes.number,
  checkedIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  loading: PropTypes.bool,
  gridViewportRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  onClose: PropTypes.func.isRequired,
  onChangeMemberType: PropTypes.func.isRequired,
  onChangeSearchType: PropTypes.func.isRequired,
  onChangeKeyword: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onToggleCheck: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
