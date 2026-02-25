import BannerDetail from '@components/banner/BannerDetail';
import BannerForm from '@components/banner/BannerForm';
import BannerGrid from '@components/banner/BannerGrid';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';

const BNR_PSTN_OPTIONS = [
  { value: 'UEBN', label: '상단배너' },
  { value: 'MDBN', label: '중단배너' },
  { value: 'LPBN', label: '하단배너' },
];

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '사용안함' },
];

export default function BannerManagement() {
  const [bannerList, setBannerList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState({
    bnrPstnSeCd: '',
    bnrTtl: '',
    pstgBgngYmdFrom: '',
    pstgEndYmdTo: '',
    useYn: '',
  });
  const [rightPanel, setRightPanel] = useState(null); // null | 'detail' | 'form'
  const [selectedBnrId, setSelectedBnrId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchBannerList();
  }, []);

  const fetchBannerList = async (searchParams = search) => {
    try {
      const params = { size: 100 };
      if (searchParams.bnrPstnSeCd)
        params.bnrPstnSeCd = searchParams.bnrPstnSeCd;
      if (searchParams.bnrTtl) params.bnrTtl = searchParams.bnrTtl;
      if (searchParams.pstgBgngYmdFrom)
        params.pstgBgngYmdFrom = searchParams.pstgBgngYmdFrom;
      if (searchParams.pstgEndYmdTo)
        params.pstgEndYmdTo = searchParams.pstgEndYmdTo;
      if (searchParams.useYn) params.useYn = searchParams.useYn;

      const response = await http.get('/api/v1/banners', { params });
      const data = (response.data?.data || []).map((item) => ({
        ...item,
        id: item.bnrId,
      }));
      setBannerList(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('배너 목록 조회 실패:', error);
      setBannerList([]);
    }
  };

  const fetchBannerDetail = async (bnrId) => {
    try {
      const response = await http.get(`/api/v1/banners/${bnrId}`);
      setDetailData(response.data);
      return response.data;
    } catch (error) {
      console.error('배너 상세 조회 실패:', error);
    }
  };

  const handleSearch = () => fetchBannerList(search);

  const handleRegister = () => {
    setSelectedBnrId(null);
    setDetailData(null);
    setRightPanel('form');
  };

  const handleRowClick = async (row) => {
    setSelectedBnrId(row.bnrId);
    await fetchBannerDetail(row.bnrId);
    setRightPanel('detail');
  };

  const handleEdit = async (row) => {
    setSelectedBnrId(row.bnrId);
    await fetchBannerDetail(row.bnrId);
    setRightPanel('form');
  };

  const handleDetailEdit = () => setRightPanel('form');

  const handleToggleUseYn = async (row) => {
    try {
      await http.patch(`/api/v1/banners/${row.bnrId}/use-yn`);
      fetchBannerList();
      if (selectedBnrId === row.bnrId) {
        fetchBannerDetail(row.bnrId);
      }
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      alert('사용여부 변경에 실패했습니다.');
    }
  };

  const handleFormSave = async (
    formData,
    imgFile,
    moblImgFile,
    fileStatusInfoJson
  ) => {
    try {
      const fd = new FormData();
      fd.append(
        'request',
        new Blob([JSON.stringify(formData)], {
          type: 'application/json',
        })
      );
      if (imgFile) fd.append('imgFile', imgFile);
      if (moblImgFile) fd.append('moblImgFile', moblImgFile);
      if (fileStatusInfoJson)
        fd.append('fileStatusInfoJson', fileStatusInfoJson);

      if (selectedBnrId) {
        await http.put(`/api/v1/banners/${selectedBnrId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('배너가 수정되었습니다.');
        await fetchBannerDetail(selectedBnrId);
        setRightPanel('detail');
      } else {
        await http.post('/api/v1/banners', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('배너가 등록되었습니다.');
        setRightPanel(null);
        setSelectedBnrId(null);
      }
      fetchBannerList();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '배너 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleFormDelete = async () => {
    if (!selectedBnrId) return;
    if (!window.confirm('배너를 삭제하시겠습니까?')) return;
    try {
      await http.delete(`/api/v1/banners/${selectedBnrId}`);
      alert('배너가 삭제되었습니다.');
      setRightPanel(null);
      setSelectedBnrId(null);
      setDetailData(null);
      fetchBannerList();
    } catch (error) {
      console.error('배너 삭제 실패:', error);
      alert('배너 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>배너 관리</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">배너 목록</li>
        </ul>
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        {/* 좌측: 목록 */}
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>배너 목록</h4>
            <div className="onselect-form">
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="배너구분"
                  menuSize="100px"
                  options={BNR_PSTN_OPTIONS}
                  value={search.bnrPstnSeCd}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      bnrPstnSeCd: e.target.value,
                    }))
                  }
                />
                <MenuInputBox
                  menuType="input"
                  menuName="제목"
                  menuSize="200px"
                  value={search.bnrTtl}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, bnrTtl: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
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
                <div className="onbtn" style={{ marginLeft: 'auto' }}>
                  <Button
                    btnType="menuSearch"
                    btnNames="검색"
                    onClick={handleSearch}
                  />
                </div>
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
            <BannerGrid
              data={bannerList}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onToggleUseYn={handleToggleUseYn}
            />
          </div>
        </div>

        {/* 우측: 상세조회 */}
        {rightPanel === 'detail' && detailData && (
          <BannerDetail data={detailData} onEdit={handleDetailEdit} />
        )}

        {/* 우측: 등록/수정 */}
        {rightPanel === 'form' && (
          <BannerForm
            data={detailData}
            isEdit={!!selectedBnrId}
            onSave={handleFormSave}
            onDelete={handleFormDelete}
          />
        )}
      </div>
    </div>
  );
}
