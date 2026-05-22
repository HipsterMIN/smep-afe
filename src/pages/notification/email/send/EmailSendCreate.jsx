import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '@components/ui/DatepickerTimeBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
import http from '@lib/http.js';
import RecipientMemberPopup from '@pages/notification/common/RecipientMemberPopup.jsx';
import { Willow } from '@svar-ui/react-grid';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 상수 ─────────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MEMBER_POPUP_PAGE_SIZE = 20;
const TEMPLATE_POPUP_PAGE_SIZE = 20;
const TEMPLATE_GRID_PROPS = { rowHeight: 36, headerRowHeight: 40 };

/** Date + HH:mm → yyyyMMddHHmmss (BE sendDate 포맷) */
function toSendDateStr(date, timeStr) {
  if (!date || !timeStr) return null;
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const [HH, mm] = timeStr.split(':');
  const hhStr = (HH || '00').padStart(2, '0');
  const miStr = (mm || '00').padStart(2, '0');
  return `${yyyy}${MM}${dd}${hhStr}${miStr}00`;
}

/** 현재 시각 → yyyyMMddHHmmss */
function getNowSendDateStr() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function normalizePopupMember(row) {
  const stableId = row?.mbrNo || row?.lgnId;
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

function normalizePopupMemberRows(rows) {
  const uniqueRows = [];
  const seen = new Set();

  rows.forEach((row) => {
    const key = row?.mbrNo || row?.lgnId;
    if (key && seen.has(key)) return;
    if (key) seen.add(key);
    uniqueRows.push(row);
  });

  return uniqueRows.map(normalizePopupMember);
}

function getFallbackCursorFromRows(rows) {
  if (!rows?.length) return null;
  const lastRow = rows[rows.length - 1];
  return lastRow?.mbrNo || lastRow?.id || null;
}

function resolveMemberPayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data ?? response;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData) &&
      Array.isArray(responseData.data)
    ) {
      return responseData;
    }

    if (
      responseData?.data &&
      typeof responseData.data === 'object' &&
      !Array.isArray(responseData.data) &&
      Array.isArray(responseData.data.data)
    ) {
      return responseData.data;
    }

    return responseData;
  }

  return response ?? {};
}

function resolveTemplatePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data ?? response;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData) &&
      Array.isArray(responseData.data)
    ) {
      return responseData;
    }

    if (
      responseData?.data &&
      typeof responseData.data === 'object' &&
      !Array.isArray(responseData.data) &&
      Array.isArray(responseData.data.data)
    ) {
      return responseData.data;
    }

    return responseData;
  }

  return response ?? {};
}

function formatTemplateDate(value) {
  if (!value) return '';
  const str = String(value);

  if (/^\d{14}$/.test(str)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }

  if (/^\d{8}$/.test(str)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }

  return str;
}

function normalizeTemplateRows(rows, totalCount = 0, offset = 0) {
  return (rows ?? []).map((row, index) => ({
    ...row,
    id: row?.tplId ?? row?.id,
    rowNo: totalCount > 0 ? totalCount - (offset + index) : offset + index + 1,
    tplId: row?.tplId ?? '',
    tplTitle: row?.tplTitle ?? '',
    writer: row?.writer ?? '',
    inDate: formatTemplateDate(row?.inDate ?? ''),
    modDate: formatTemplateDate(row?.modDate ?? ''),
    tplContent: row?.tplContent ?? '',
  }));
}

function getFallbackTemplateCursorFromRows(rows) {
  if (!rows?.length) return null;
  const lastRow = rows[rows.length - 1];
  return lastRow?.tmpltSeq ?? lastRow?.templateId ?? lastRow?.id ?? null;
}

function EmailTemplatePopup({
  title = '이메일 양식 목록',
  templateList = [],
  totalCount = 0,
  selectedTemplateId = null,
  loading = false,
  gridViewportRef,
  onClose,
  onToggleSelect,
  onConfirm,
}) {
  const columns = useMemo(
    () => [
      {
        id: 'checked',
        header: '선택',
        width: 60,
        cell: ({ row }) => (
          <CheckBox
            chkId={`email-template-${row.id}`}
            checked={selectedTemplateId === row.id}
            onChange={() => onToggleSelect(row.id)}
          />
        ),
      },
      { id: 'rowNo', header: '번호', width: 80 },
      { id: 'tplTitle', header: '템플릿명', flexgrow: 1.6 },
      { id: 'inDate', header: '작성일', width: 140 },
      { id: 'writer', header: '작성자', width: 120 },
    ],
    [selectedTemplateId, onToggleSelect]
  );
  return (
    <Popup title={title} autoHeight={true} onClose={onClose}>
      <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight: 'auto' }}>
          <div className="onparagraph">
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
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
                data={templateList}
                columns={columns}
                useWillow={false}
                gridProps={TEMPLATE_GRID_PROPS}
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
            이메일 양식 목록을 불러오는 중입니다...
          </div>
        ) : null}
      </div>
    </Popup>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function EmailSendCreate() {
  const navigate = useNavigate();

  // ── 폼 state
  const [categoryNm, setCategoryNm] = useState('');
  const [title, setTitle] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [content, setContent] = useState('');
  const [memo, setMemo] = useState('');

  // ── 발송 일시 (단일 예약 시각)
  const [sendSchedule, setSendSchedule] = useState('즉시발송');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');

  // ── 첨부파일
  const [attachFiles, setAttachFiles] = useState([]);

  // ── 수신자 목록
  const [recipients, setRecipients] = useState([]);
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');

  // ── 회원목록 팝업
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);
  const [memberType, setMemberType] = useState('');
  const [memberSearchType, setMemberSearchType] = useState('');
  const [memberSearchKeyword, setMemberSearchKeyword] = useState('');
  const [memberList, setMemberList] = useState([]);
  const [memberTotalCount, setMemberTotalCount] = useState(0);
  const [checkedMemberIds, setCheckedMemberIds] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberCursor, setMemberCursor] = useState(null);
  const [memberHasNext, setMemberHasNext] = useState(true);
  const memberLoadingRef = useRef(false);
  const memberGridViewportRef = useRef(null);

  // ── 양식 팝업
  const [isTemplatePopupOpen, setIsTemplatePopupOpen] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [templateTotalCount, setTemplateTotalCount] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateCursor, setTemplateCursor] = useState(null);
  const [templateHasNext, setTemplateHasNext] = useState(true);
  const templateLoadingRef = useRef(false);
  const templateGridViewportRef = useRef(null);

  // ── 엑셀 업로드
  const [isExcelPopupOpen, setIsExcelPopupOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const excelFileInputRef = useRef(null);

  // ── 발송 처리 state
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

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

    return rows.length >= MEMBER_POPUP_PAGE_SIZE && Boolean(nextCursorValue);
  };

  const buildMemberSearchRequest = (
    nextCursor,
    { memberType, memberSearchType, memberSearchKeyword }
  ) => ({
    cursorPageRequest: {
      size: MEMBER_POPUP_PAGE_SIZE,
      cursor: nextCursor,
    },
    memberType: memberType || null,
    searchType: memberSearchType || null,
    keyword: memberSearchKeyword.trim() || null,
  });

  // ── 수신자 직접 추가
  const handleAddRecipient = () => {
    const trimName = inputName.trim();
    const trimEmail = inputEmail.trim();

    if (!EMAIL_REGEX.test(trimEmail)) {
      alert('올바른 이메일 주소 형식이 아닙니다.');
      return;
    }

    if (recipients.some((r) => r.email === trimEmail)) {
      alert('이미 추가된 이메일 주소입니다.');
      return;
    }

    setRecipients((prev) => [...prev, { name: trimName, email: trimEmail }]);
    setInputName('');
    setInputEmail('');
  };

  const handleRemoveRecipient = (email) =>
    setRecipients((prev) => prev.filter((r) => r.email !== email));

  const handleClearRecipients = () => setRecipients([]);

  async function fetchMemberList(nextCursor = null, reset = false) {
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
        buildMemberSearchRequest(reset ? null : nextCursor, {
          memberType,
          memberSearchType,
          memberSearchKeyword,
        })
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

      alert('회원 목록을 불러오지 못했습니다.');
    } finally {
      memberLoadingRef.current = false;
      setMemberLoading(false);
    }
  }

  async function fetchTemplateList(nextCursor = null, reset = false) {
    if (templateLoadingRef.current) return;
    if (!templateHasNext && !reset) return;

    templateLoadingRef.current = true;
    setTemplateLoading(true);

    try {
      if (reset) {
        setTemplateCursor(null);
        setTemplateHasNext(true);
        setSelectedTemplateId(null);
        setTemplateTotalCount(0);
      }

      const response = await http.get('/api/v1/notification/email/templates', {
        cursorPageRequest: {
          size: TEMPLATE_POPUP_PAGE_SIZE,
          cursor: reset ? null : nextCursor,
        },
        searchCondition: '*',
      });

      const data = resolveTemplatePayload(response);
      const rows = Array.isArray(data?.data) ? data.data : [];
      const totalCount = data?.totalCount ?? rows.length;

      setTemplateList((prev) =>
        reset
          ? normalizeTemplateRows(rows, totalCount, 0)
          : [...prev, ...normalizeTemplateRows(rows, totalCount, prev.length)]
      );

      setTemplateTotalCount(totalCount);

      const resolvedNextCursor =
        data?.nextCursor ??
        data?.cursor ??
        data?.next ??
        data?.cursorPageResponse?.nextCursor ??
        data?.page?.nextCursor ??
        getFallbackTemplateCursorFromRows(rows);

      const rawHasNext =
        data?.hasNext ??
        data?.cursorPageResponse?.hasNext ??
        data?.page?.hasNext;

      const resolvedHasNext =
        typeof rawHasNext === 'boolean'
          ? rawHasNext
          : rawHasNext === 'Y'
            ? true
            : rawHasNext === 'N'
              ? false
              : rows.length >= TEMPLATE_POPUP_PAGE_SIZE &&
                Boolean(resolvedNextCursor);

      setTemplateCursor(resolvedNextCursor);
      setTemplateHasNext(resolvedHasNext);
    } catch (error) {
      console.error('이메일 양식 목록 조회 실패:', error);

      if (reset) {
        setTemplateList([]);
        setTemplateTotalCount(0);
        setTemplateCursor(null);
        setTemplateHasNext(false);
        setSelectedTemplateId(null);
      }

      alert('이메일 양식 목록을 불러오지 못했습니다.');
    } finally {
      templateLoadingRef.current = false;
      setTemplateLoading(false);
    }
  }

  // 회원목록 팝업 열기/닫기
  const handleOpenMemberPopup = () => {
    setIsMemberPopupOpen(true);
    setCheckedMemberIds([]);
    fetchMemberList(null, true);
  };

  const handleCloseMemberPopup = () => {
    setCheckedMemberIds([]);
    setIsMemberPopupOpen(false);
  };

  // 양식 팝업 열기/닫기
  const handleOpenTemplatePopup = () => {
    setIsTemplatePopupOpen(true);
    setSelectedTemplateId(null);
    fetchTemplateList(null, true);
  };

  const handleCloseTemplatePopup = () => {
    setSelectedTemplateId(null);
    setIsTemplatePopupOpen(false);
  };

  const handleToggleTemplateSelect = (id) => {
    setSelectedTemplateId((prev) => (prev === id ? null : id));
  };

  const handleLoadMoreTemplates = () => {
    const nextCursor =
      templateCursor ?? getFallbackTemplateCursorFromRows(templateList);

    if (nextCursor !== null && nextCursor !== undefined) {
      fetchTemplateList(nextCursor, false);
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplateId) {
      alert('불러올 양식을 선택하세요.');
      return;
    }

    try {
      const response = await http.get(
        `/api/v1/notification/email/templates/${selectedTemplateId}`
      );
      const payload = response?.data?.data ?? response?.data ?? response ?? {};

      setTitle(payload?.tplTitle ?? '');
      setContent(payload?.tplContent ?? '');
      setSelectedTemplateId(null);
      setIsTemplatePopupOpen(false);
    } catch (error) {
      console.error('이메일 양식 상세 조회 실패:', error);
      alert('이메일 양식 상세 조회 중 오류가 발생했습니다.');
    }
  };

  // ── 회원목록 팝업 체크 토글
  const handleMemberCheckToggle = (id) =>
    setCheckedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  // ── 회원 검색
  const handleSearchMembers = () => {
    fetchMemberList(null, true);
  };

  // ── 회원 더보기(무한스크롤)
  const handleLoadMoreMembers = () => {
    const nextCursor = memberCursor ?? getFallbackCursorFromRows(memberList);

    if (nextCursor !== null && nextCursor !== undefined) {
      fetchMemberList(nextCursor, false);
    }
  };

  // ── 회원목록 선택 추가
  const handleAddCheckedMembers = () => {
    const selectedMembers = memberList.filter((member) =>
      checkedMemberIds.includes(member.id)
    );

    if (selectedMembers.length === 0) {
      alert('추가할 회원을 선택하세요.');
      return;
    }

    const invalidMembers = selectedMembers.filter(
      (member) => !member.email || !EMAIL_REGEX.test(member.email)
    );

    const existingEmails = new Set(recipients.map((r) => r.email));
    const newRecipients = selectedMembers
      .filter((member) => member.email && EMAIL_REGEX.test(member.email))
      .filter((member) => !existingEmails.has(member.email))
      .map((member) => ({
        name: member.name,
        email: member.email,
      }));

    if (newRecipients.length === 0) {
      if (invalidMembers.length > 0) {
        alert('선택한 회원의 이메일 주소가 없거나 올바르지 않습니다.');
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
        `선택한 회원 중 ${invalidMembers.length}명은 이메일 주소가 없거나 올바르지 않아 제외되었습니다.`
      );
    }
  };

  const handleExcelConfirm = async () => {
    if (!excelFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    setIsExcelUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', excelFile);

      const res = await http.post('/api/common/excel/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // ApiResponse 래퍼 : res.data.data 가 List<Map<String, List<String>>>
      const rawList = res?.data ?? [];

      // 1행은 헤더(이름/이메일주소)이므로 skip, A열=key(이름), C열=values[0](이메일)
      const parsed = rawList
        .slice(1)
        .map((row) => {
          const name = Object.keys(row)[0] ?? '';
          const email = (Object.values(row)[0] ?? [])[0] ?? '';
          return { name: name.trim(), email: email.trim() };
        })
        .filter((r) => EMAIL_REGEX.test(r.email));

      if (parsed.length === 0) {
        alert(
          '유효한 이메일 주소가 없습니다.\nA열=이름, C열=이메일주소 형식인지 확인해주세요.'
        );
        return;
      }

      const existingEmails = new Set(recipients.map((r) => r.email));
      const newRecipients = parsed.filter((r) => !existingEmails.has(r.email));

      setRecipients((prev) => [...prev, ...newRecipients]);
      setIsExcelPopupOpen(false);
      setExcelFile(null);

      alert(`${newRecipients.length}명이 수신자 목록에 추가되었습니다.`);
    } catch (e) {
      console.error('엑셀 업로드 실패:', e);
      alert('엑셀 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsExcelUploading(false);
    }
  };

  const handleClickExcelFileButton = () => {
    excelFileInputRef.current?.click();
  };

  // ── 다시쓰기 (초기화)
  const handleReset = () => {
    setCategoryNm('');
    setTitle('');
    setSenderName('');
    setSenderEmail('');
    setContent('');
    setMemo('');
    setSendSchedule('즉시발송');
    setScheduledDate(null);
    setScheduledTime('');
    setAttachFiles([]);
    setRecipients([]);
    setInputName('');
    setInputEmail('');
    setMemberType('');
    setMemberSearchType('');
    setMemberSearchKeyword('');
    setMemberList([]);
    setMemberTotalCount(0);
    setCheckedMemberIds([]);
    setMemberCursor(null);
    setMemberHasNext(true);
    setIsTemplatePopupOpen(false);
    setTemplateList([]);
    setTemplateTotalCount(0);
    setSelectedTemplateId(null);
    setTemplateCursor(null);
    setTemplateHasNext(true);
    setSendError(null);
  };

  // ── 발송
  const handleSend = async () => {
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    if (!content.trim()) {
      alert('메일 내용을 입력하세요.');
      return;
    }

    if (recipients.length === 0) {
      alert('수신자를 1명 이상 추가하세요.');
      return;
    }

    if (senderEmail && !EMAIL_REGEX.test(senderEmail)) {
      alert('발신자 이메일 주소 형식이 올바르지 않습니다.');
      return;
    }

    if (sendSchedule === '예약발송') {
      if (!scheduledDate || !scheduledTime) {
        alert('예약 발송일과 시간을 모두 선택하세요.');
        return;
      }

      const scheduledStr = toSendDateStr(scheduledDate, scheduledTime);
      const nowStr = getNowSendDateStr();

      if (scheduledStr <= nowStr) {
        alert('예약 시간은 현재 시간보다 이후여야 합니다.');
        return;
      }
    }

    const requestBody = {
      categoryNm: categoryNm || null,
      title: title.trim(),
      content,
      senderEmail: senderEmail || null,
      senderName: senderName || null,
      recipients,
      sendDate:
        sendSchedule === '예약발송'
          ? toSendDateStr(scheduledDate, scheduledTime)
          : null,
      memo: memo || null,
    };

    setIsSending(true);
    setSendError(null);

    try {
      const newFiles = attachFiles.filter((f) => f.status === 'new' && f.file);

      let result;
      if (newFiles.length > 0) {
        const formData = new FormData();
        formData.append(
          'request',
          new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
        );
        newFiles.forEach((f) => formData.append('files', f.file));

        result = await http.post(
          '/api/v1/notification/email/send-with-file',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        result = await http.post(
          '/api/v1/notification/email/send',
          requestBody
        );
      }

      if (result.success) {
        alert('발송이 완료되었습니다.');
        navigate('..');
      } else {
        setSendError(`발송 실패: ${result.errorCode ?? '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      setSendError('발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  useGridInfiniteScroll({
    viewportRef: memberGridViewportRef,
    loading: memberLoading,
    loadingRef: memberLoadingRef,
    hasNext: isMemberPopupOpen ? memberHasNext : false,
    onLoadMore: handleLoadMoreMembers,
  });

  useGridInfiniteScroll({
    viewportRef: templateGridViewportRef,
    loading: templateLoading,
    loadingRef: templateLoadingRef,
    hasNext: isTemplatePopupOpen ? templateHasNext : false,
    onLoadMore: handleLoadMoreTemplates,
  });

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 작성</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li className="on">이메일 작성</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>메일분류</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="select"
                      selectOption="전체"
                      value={categoryNm}
                      onChange={(e) => setCategoryNm(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>제목</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="제목을 입력해주세요."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={1000}
                    />
                  </td>
                </tr>

                <tr>
                  <td>발신자 정보</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="발신자명을 입력해주세요."
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </td>
                  <td>이메일 주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="이메일 주소를 입력해주세요."
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>수신자</td>
                  <td colSpan={3}>
                    <div className="flexColumn">
                      <div className="flexRow">
                        <MenuInputBox
                          menuType="input"
                          menuSize="150px"
                          placeholder="이름을 입력하세요."
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                        />
                        <MenuInputBox
                          menuType="input"
                          menuSize="300px"
                          placeholder="이메일 주소를 입력해주세요."
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleAddRecipient()
                          }
                        />
                        <div style={{ marginRight: 'auto' }}>
                          <Button
                            btnType="add"
                            btnNames="추가"
                            onClick={handleAddRecipient}
                          />
                        </div>
                        <Button
                          btnType="add"
                          bgColor="color-gray"
                          btnNames="회원목록"
                          onClick={handleOpenMemberPopup}
                        />
                        <Button
                          btnType="list"
                          btnNames="엑셀 불러오기"
                          onClick={() => setIsExcelPopupOpen(true)}
                        ></Button>
                      </div>

                      <div className="flexRow">
                        <div className="onaddUserForm">
                          {recipients.length === 0 && (
                            <span style={{ color: '#999', fontSize: '13px' }}>
                              수신자를 추가하세요.
                            </span>
                          )}
                          {recipients.map((r) => (
                            <div key={r.email} className="onaddUser">
                              <span>
                                {r.name ? `${r.name} ` : ''}
                                {r.email}
                              </span>
                              <i
                                className="onicon close"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRemoveRecipient(r.email)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="onDelBox">
                          <span>발송 총 인원 : {recipients.length}명</span>
                          <Button
                            btnType="del"
                            btnNames="전체삭제"
                            onClick={handleClearRecipients}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>발송일시</td>
                  <td colSpan={3}>
                    <div className="flexRow">
                      <Button
                        btnType="add"
                        btnNames="즉시발송"
                        bgColor={
                          sendSchedule === '즉시발송' ? '' : 'color-gray'
                        }
                        onClick={() => setSendSchedule('즉시발송')}
                      />
                      <Button
                        btnType="add"
                        btnNames="예약발송"
                        bgColor={
                          sendSchedule === '예약발송' ? '' : 'color-gray'
                        }
                        onClick={() => setSendSchedule('예약발송')}
                      />
                      <div
                        className="ondatepickerbox"
                        style={{ marginLeft: '10px' }}
                      >
                        <DatepickerBox
                          disabled={sendSchedule !== '예약발송'}
                          value={scheduledDate}
                          onChange={(date) => setScheduledDate(date)}
                        />
                        <DatepickerTimeBox
                          disabled={sendSchedule !== '예약발송'}
                          value={scheduledTime}
                          onChange={(time) => setScheduledTime(time)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>첨부파일</td>
                  <td colSpan={3}>
                    <FileUpload
                      mode="edit"
                      maxFiles={5}
                      fileType="attachment"
                      files={attachFiles}
                      onFilesChange={setAttachFiles}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="flexColumn centerGap">
                      <span>내용</span>
                      <div style={{ width: '108px', whiteSpace: 'nowrap' }}>
                        <Button
                          btnType="add"
                          btnNames="양식 불러오기"
                          onClick={handleOpenTemplatePopup}
                        />
                      </div>
                    </div>
                  </td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={content}
                      onChange={setContent}
                      placeholder="여기에 발송할 메일 내용을 입력해주세요."
                      minHeight={280}
                    />
                  </td>
                </tr>

                <tr>
                  <td>설명</td>
                  <td colSpan={3}>
                    <TextareaBox
                      menuSize="100%"
                      placeholder="설명을 입력해주세요. (최대 4000자)"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      maxLength={4000}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {sendError && (
          <div style={{ color: 'red', padding: '8px 16px', fontSize: '13px' }}>
            {sendError}
          </div>
        )}

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
          <Button
            btnType="add"
            bgColor="color-gray"
            btnNames="다시쓰기"
            onClick={handleReset}
          />
          <Button
            btnType="add"
            btnNames={isSending ? '발송 중...' : '발송'}
            disabled={isSending}
            onClick={handleSend}
          />
        </div>
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

      {isTemplatePopupOpen && (
        <EmailTemplatePopup
          title="이메일 양식 목록"
          templateList={templateList}
          totalCount={templateTotalCount}
          selectedTemplateId={selectedTemplateId}
          loading={templateLoading}
          gridViewportRef={templateGridViewportRef}
          onClose={handleCloseTemplatePopup}
          onToggleSelect={handleToggleTemplateSelect}
          onConfirm={handleApplyTemplate}
        />
      )}

      {isExcelPopupOpen && (
        <Popup
          title="엑셀 불러오기"
          autoHeight={true}
          onClose={() => {
            setIsExcelPopupOpen(false);
            setExcelFile(null);
          }}
        >
          <h4 className="onsubtitle" style={{ margin: '0 2px 12px' }}>
            업로드 안내
          </h4>

          <div className="oncontent" style={{ margin: '0 2px 12px' }}>
            <ul style={{ paddingLeft: '18px', lineHeight: '1.8' }}>
              <li>
                반드시 아래의 양식에 맞게 전송 대상자 정보를 입력하여 업로드해
                주시기 바랍니다.
              </li>
            </ul>
          </div>

          <div
            className="oncontent ontable-form"
            style={{ paddingRight: '0', marginBottom: '12px' }}
          >
            <div className="ontableBox onbgtable">
              <table>
                <colgroup>
                  <col style={{ width: '33.33%' }} />
                  <col style={{ width: '33.33%' }} />
                  <col style={{ width: '33.33%' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>A열</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>B열</td>
                    <td>C열</td>
                  </tr>
                  <tr>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>이름</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>&nbsp;</td>
                    <td>이메일주소</td>
                  </tr>
                  <tr>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>홍길동</td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>&nbsp;</td>
                    <td>test@test.co.kr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="ongrid-form" style={{ margin: '0 2px 8px' }}>
            <div className="flexRow" style={{ width: '100%', gap: '8px' }}>
              <MenuInputBox
                menuType="input"
                menuSize="300px"
                value={excelFile?.name ?? ''}
                placeholder="선택된 파일 없음"
                readOnly
              />

              <input
                ref={excelFileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
              />

              <Button
                type="button"
                btnType="add"
                btnNames="파일 선택"
                onClick={handleClickExcelFileButton}
              />
            </div>
          </div>

          <div
            className="onflexbtns"
            style={{ marginTop: '16px', justifyContent: 'center' }}
          >
            <Button
              btnType="add"
              bgColor="color-gray"
              btnNames="취소"
              onClick={() => {
                setIsExcelPopupOpen(false);
                setExcelFile(null);
              }}
            />
            <Button
              btnType="add"
              btnNames={isExcelUploading ? '처리 중...' : '확인'}
              disabled={isExcelUploading}
              onClick={handleExcelConfirm}
            />
          </div>
        </Popup>
      )}
    </div>
  );
}
