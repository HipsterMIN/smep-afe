import PopupDetail from '@components/popup/PopupDetail';
import PopupForm from '@components/popup/PopupForm';
import PopupGrid from '@components/popup/PopupGrid';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';

const POPUP_KND_OPTIONS = [
  { value: 'NWND', label: '새창' },
  { value: 'LAYR', label: '레이어' },
  { value: 'BNDB', label: '띠배너' },
];

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '사용안함' },
];

export default function PopupManagement() {
  const [popupList, setPopupList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState({
    popupKndCd: '',
    popupTtl: '',
    pstgBgngYmdFrom: '',
    pstgEndYmdTo: '',
    useYn: '',
  });
  const [rightPanel, setRightPanel] = useState(null); // null | 'detail' | 'form'
  const [selectedPopupId, setSelectedPopupId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchPopupList();
  }, []);

  const fetchPopupList = async (searchParams = search) => {
    try {
      const params = { size: 100 };
      if (searchParams.popupKndCd) params.popupKndCd = searchParams.popupKndCd;
      if (searchParams.popupTtl) params.popupTtl = searchParams.popupTtl;
      if (searchParams.pstgBgngYmdFrom)
        params.pstgBgngYmdFrom = searchParams.pstgBgngYmdFrom;
      if (searchParams.pstgEndYmdTo)
        params.pstgEndYmdTo = searchParams.pstgEndYmdTo;
      if (searchParams.useYn) params.useYn = searchParams.useYn;

      const response = await http.get('/api/v1/popups', { params });
      const data = (response.data?.data || []).map((item) => ({
        ...item,
        id: item.popupId,
      }));
      setPopupList(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('팝업 목록 조회 실패:', error);
      setPopupList([]);
    }
  };

  const fetchPopupDetail = async (popupId) => {
    try {
      const response = await http.get(`/api/v1/popups/${popupId}`);
      setDetailData(response.data);
      return response.data;
    } catch (error) {
      console.error('팝업 상세 조회 실패:', error);
    }
  };

  const handleSearch = () => fetchPopupList(search);

  const handleRegister = () => {
    setSelectedPopupId(null);
    setDetailData(null);
    setRightPanel('form');
  };

  const handleRowClick = async (row) => {
    setSelectedPopupId(row.popupId);
    await fetchPopupDetail(row.popupId);
    setRightPanel('detail');
  };

  const handleEdit = async (row) => {
    setSelectedPopupId(row.popupId);
    await fetchPopupDetail(row.popupId);
    setRightPanel('form');
  };

  const handleDetailEdit = () => setRightPanel('form');

  const handleToggleUseYn = async (row) => {
    try {
      await http.patch(`/api/v1/popups/${row.popupId}/use-yn`);
      fetchPopupList();
      if (selectedPopupId === row.popupId) {
        fetchPopupDetail(row.popupId);
      }
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      alert('사용여부 변경에 실패했습니다.');
    }
  };

  const handlePreview = (row) => {
    window.open(
      `/popup/preview/${row.popupId}`,
      '_blank',
      'width=800,height=600'
    );
  };

  const handleFormSave = async (formData, newFile, fileStatusInfoJson) => {
    try {
      const fd = new FormData();
      fd.append(
        'request',
        new Blob([JSON.stringify(formData)], {
          type: 'application/json',
        })
      );
      if (newFile) {
        fd.append('imgFile', newFile);
      }
      if (fileStatusInfoJson) {
        fd.append('fileStatusInfoJson', fileStatusInfoJson);
      }

      if (selectedPopupId) {
        await http.put(`/api/v1/popups/${selectedPopupId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('팝업이 수정되었습니다.');
        await fetchPopupDetail(selectedPopupId);
        setRightPanel('detail');
      } else {
        await http.post('/api/v1/popups', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('팝업이 등록되었습니다.');
        setRightPanel(null);
        setSelectedPopupId(null);
      }
      fetchPopupList();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '팝업 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleFormDelete = async () => {
    if (!selectedPopupId) return;
    if (!window.confirm('팝업을 삭제하시겠습니까?')) return;
    try {
      await http.delete(`/api/v1/popups/${selectedPopupId}`);
      alert('팝업이 삭제되었습니다.');
      setRightPanel(null);
      setSelectedPopupId(null);
      setDetailData(null);
      fetchPopupList();
    } catch (error) {
      console.error('팝업 삭제 실패:', error);
      alert('팝업 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>팝업 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">팝업 목록</li>
        </ul>
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        {/* 좌측: 목록 */}
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>팝업 목록</h4>
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="팝업 종류"
                  menuSize="100px"
                  options={POPUP_KND_OPTIONS}
                  value={search.popupKndCd}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      popupKndCd: e.target.value,
                    }))
                  }
                />
                <MenuInputBox
                  menuType="input"
                  menuName="제목"
                  menuSize="300px"
                  value={search.popupTtl}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      popupTtl: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div style={{ marginLeft: 'auto' }}>
                  <Button
                    btnType="menuSearch"
                    btnNames="검색"
                    onClick={handleSearch}
                  />
                </div>
              </div>
              <div className="onparagraph middle">
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="게시기간"
                    outputFormat="ymd"
                    value={search.pstgBgngYmdFrom}
                    onChange={(val) =>
                      setSearch((prev) => ({ ...prev, pstgBgngYmdFrom: val }))
                    }
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    outputFormat="ymd"
                    value={search.pstgEndYmdTo}
                    onChange={(val) =>
                      setSearch((prev) => ({ ...prev, pstgEndYmdTo: val }))
                    }
                  />
                </div>
                <MenuInputBox
                  menuType="select"
                  menuName="사용여부"
                  menuSize="100px"
                  options={USE_YN_OPTIONS}
                  value={search.useYn}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, useYn: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button btnType="add" btnNames="등록" onClick={handleRegister} />
          </div>
          <div className="ongrid-tableform onSCrollBox">
            <PopupGrid
              data={popupList}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onToggleUseYn={handleToggleUseYn}
              onPreview={handlePreview}
            />
          </div>
        </div>
        {/* 우측: 상세조회 */}
        {rightPanel === 'detail' && detailData && (
          <PopupDetail data={detailData} onEdit={handleDetailEdit} />
        )}
        {/* 우측: 등록/수정 */}
        {rightPanel === 'form' && (
          <PopupForm
            data={detailData}
            isEdit={!!selectedPopupId}
            onSave={handleFormSave}
            onDelete={handleFormDelete}
          />
        )}
      </div>
    </div>
  );
}
