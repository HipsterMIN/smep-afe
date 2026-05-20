import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import MessageEditorPanel from '@pages/notification/sms/send/components/MessageEditorPanel.jsx';
import RecipientMemberPopup from '@pages/notification/common/RecipientMemberPopup.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MESSAGE_TYPES = ['SMS', 'LMS'];
const MEMBER_POPUP_PAGE_SIZE = 20;

const TAB_BUTTON_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
};

function normalizePhoneNo(phoneNo = '') {
  return String(phoneNo).replace(/[^0-9]/g, '');
}

function normalizePopupMember(row) {
  const stableId = row?.mbrNo ?? row?.lgnId;

  return {
    ...row,
    id: stableId,
    userId: row?.lgnId ?? '',
    name: row?.mbrNm ?? '',
    phoneNo: row?.telno ?? '',
    email: row?.emlAddr ?? '',
    mbrNo: row?.mbrNo ?? '',
    mbrTypeCd: row?.mbrTypeCd ?? '',
    mbrTypeCdNm: row?.mbrTypeCdNm ?? '',
  };
}

function normalizePopupMemberRows(rows = []) {
  const uniqueRows = [];
  const seen = new Set();

  rows.forEach((row) => {
    const key = row?.mbrNo ?? row?.lgnId;
    if (!key || seen.has(key)) return;
    seen.add(key);
    uniqueRows.push(row);
  });

  return uniqueRows.map(normalizePopupMember);
}

function getFallbackCursorFromRows(rows = []) {
  if (!rows?.length) return null;
  const lastRow = rows[rows.length - 1];
  return lastRow?.mbrNo ?? lastRow?.id ?? null;
}

function resolveMemberPayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data ?? response;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      if (Array.isArray(responseData.data)) return responseData;
      if (
        responseData?.data &&
        typeof responseData.data === 'object' &&
        !Array.isArray(responseData.data) &&
        Array.isArray(responseData.data.data)
      ) {
        return responseData.data;
      }
    }

    return responseData;
  }

  return response ?? {};
}

export default function SmsSendCreate() {
  const [selectedValue, setSelectedValue] = useState('즉시발송');
  const [activeMessageType, setActiveMessageType] = useState('SMS');

  // 수신자 목록
  const [recipients, setRecipients] = useState([]);

  // 회원목록 팝업 상태
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);

  // 회원목록 검색 조건
  const [memberType, setMemberType] = useState('');
  const [memberSearchType, setMemberSearchType] = useState('');
  const [memberSearchKeyword, setMemberSearchKeyword] = useState('');

  // 회원목록 데이터
  const [memberList, setMemberList] = useState([]);
  const [memberTotalCount, setMemberTotalCount] = useState(0);
  const [checkedMemberIds, setCheckedMemberIds] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberCursor, setMemberCursor] = useState(null);
  const [memberHasNext, setMemberHasNext] = useState(true);

  const memberLoadingRef = useRef(false);
  const memberGridViewportRef = useRef(null);

  const navigate = useNavigate();

  const parseNextCursor = (data, rows) => {
    const cursorCandidates = [
      data?.nextCursor,
      data?.cursor,
      data?.next,
      data?.cursorPageResponse?.nextCursor,
      data?.page?.nextCursor,
      getFallbackCursorFromRows(rows),
    ];

    const validCursor = cursorCandidates.find(
      (value) => value !== undefined && value !== null && value !== ''
    );

    return validCursor ?? null;
  };

  const parseHasNext = (data, rows, nextCursorValue) => {
    const raw =
      data?.hasNext ?? data?.cursorPageResponse?.hasNext ?? data?.page?.hasNext;

    if (typeof raw === 'boolean') return raw;
    if (raw === 'Y') return true;
    if (raw === 'N') return false;

    return rows.length >= MEMBER_POPUP_PAGE_SIZE || Boolean(nextCursorValue);
  };

  const buildMemberSearchRequest = (
    nextCursor,
    currentMemberType,
    currentSearchType,
    currentKeyword
  ) => ({
    cursorPageRequest: {
      size: MEMBER_POPUP_PAGE_SIZE,
      cursor: nextCursor,
    },
    memberType: currentMemberType || null,
    searchType: currentSearchType || null,
    keyword: currentKeyword.trim() || null,
  });

  const handleMemberCheckToggle = (id) => {
    setCheckedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const fetchMemberList = async (nextCursor = null, reset = false) => {
    if (memberLoadingRef.current) return;
    if (!memberHasNext && !reset) return;

    memberLoadingRef.current = true;
    setMemberLoading(true);

    try {
      if (reset) {
        setMemberCursor(null);
        setMemberHasNext(true);
        setCheckedMemberIds([]);
        setMemberTotalCount(0);
      }

      const response = await http.post(
        '/api/v1/notification/recipients/members/search',
        buildMemberSearchRequest(
          reset ? null : nextCursor,
          memberType,
          memberSearchType,
          memberSearchKeyword
        )
      );

      const data = resolveMemberPayload(response);
      const rows = Array.isArray(data?.data) ? data.data : [];

      setMemberList((prev) =>
        reset
          ? normalizePopupMemberRows(rows)
          : normalizePopupMemberRows([...prev, ...rows])
      );

      setMemberTotalCount((prev) =>
        reset ? (data?.totalCount ?? rows.length) : (data?.totalCount ?? prev)
      );

      const resolvedNextCursor = parseNextCursor(data, rows);
      const resolvedHasNext = parseHasNext(data, rows, resolvedNextCursor);

      setMemberCursor(resolvedNextCursor);
      setMemberHasNext(resolvedHasNext);
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);

      if (reset) {
        setMemberList([]);
        setMemberTotalCount(0);
        setMemberCursor(null);
        setMemberHasNext(false);
        setCheckedMemberIds([]);
      }

      alert('회원 목록 조회 중 오류가 발생했습니다.');
    } finally {
      memberLoadingRef.current = false;
      setMemberLoading(false);
    }
  };

  const handleOpenMemberPopup = () => {
    setIsMemberPopupOpen(true);
    setCheckedMemberIds([]);
    fetchMemberList(null, true);
  };

  const handleCloseMemberPopup = () => {
    setCheckedMemberIds([]);
    setIsMemberPopupOpen(false);
  };

  const handleSearchMembers = () => {
    fetchMemberList(null, true);
  };

  const handleLoadMoreMembers = () => {
    const nextCursor = memberCursor ?? getFallbackCursorFromRows(memberList);

    if (nextCursor !== null && nextCursor !== undefined) {
      fetchMemberList(nextCursor, false);
    }
  };

  const handleAddCheckedMembers = () => {
    const selectedMembers = memberList.filter((member) =>
      checkedMemberIds.includes(member.id)
    );

    if (selectedMembers.length === 0) {
      alert('추가할 회원을 선택하세요.');
      return;
    }

    const invalidMembers = selectedMembers.filter(
      (member) => !normalizePhoneNo(member.phoneNo)
    );

    const existingPhones = new Set(
      recipients.map((r) => normalizePhoneNo(r.phoneNo))
    );

    const newRecipients = selectedMembers
      .filter((member) => normalizePhoneNo(member.phoneNo))
      .filter((member) => !existingPhones.has(normalizePhoneNo(member.phoneNo)))
      .map((member) => ({
        name: member.name,
        phoneNo: member.phoneNo,
      }));

    if (newRecipients.length === 0) {
      if (invalidMembers.length > 0) {
        alert('유효한 휴대폰번호가 있는 회원만 추가할 수 있습니다.');
      } else {
        alert('이미 추가된 회원입니다.');
      }
      return;
    }

    setRecipients((prev) => [...prev, ...newRecipients]);
    setCheckedMemberIds([]);
    setIsMemberPopupOpen(false);

    if (invalidMembers.length > 0) {
      alert(
        `휴대폰번호가 없는 회원 ${invalidMembers.length}명은 제외되고 추가되었습니다.`
      );
    }
  };

  useGridInfiniteScroll({
    viewportRef: memberGridViewportRef,
    loading: memberLoading,
    loadingRef: memberLoadingRef,
    hasNext: isMemberPopupOpen ? memberHasNext : false,
    onLoadMore: handleLoadMoreMembers,
  });

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 작성</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li className="on">SMS 작성</li>
        </ul>
      </div>

      <div className="oncontents onsocial">
        <div className="onsocialTab">
          <ul>
            {MESSAGE_TYPES.map((type) => (
              <li
                key={type}
                className={activeMessageType === type ? 'active' : ''}
              >
                <button
                  type="button"
                  style={TAB_BUTTON_STYLE}
                  onClick={() => setActiveMessageType(type)}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <MessageEditorPanel
          messageType={activeMessageType}
          selectedValue={selectedValue}
          onSelectedValueChange={setSelectedValue}
          onBack={() => navigate('..')}
          onOpenMemberPopup={handleOpenMemberPopup}
          recipients={recipients}
          onRecipientsChange={setRecipients}
        />
      </div>

      {isMemberPopupOpen && (
        <RecipientMemberPopup
          title="회원 목록"
          memberType={memberType}
          searchType={memberSearchType}
          keyword={memberSearchKeyword}
          memberList={memberList}
          totalCount={memberTotalCount}
          checkedIds={checkedMemberIds}
          loading={memberLoading}
          gridViewportRef={memberGridViewportRef}
          onClose={handleCloseMemberPopup}
          onChangeMemberType={setMemberType}
          onChangeSearchType={setMemberSearchType}
          onChangeKeyword={setMemberSearchKeyword}
          onSearch={handleSearchMembers}
          onToggleCheck={handleMemberCheckToggle}
          onConfirm={handleAddCheckedMembers}
        />
      )}
    </div>
  );
}
