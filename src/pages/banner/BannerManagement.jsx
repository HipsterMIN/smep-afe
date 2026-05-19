import BannerDetail from '@components/banner/BannerDetail';
import BannerForm from '@components/banner/BannerForm';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
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

function ImageCell({ row }) {
  const [isError, setIsError] = useState(false);
  if (!row.imgAtchFileId || isError) {
    return (
      <div
        style={{
          width: '82px',
          height: '25px',
          background: '#eee',
          border: '1px solid #ddd',
        }}
      />
    );
  }
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const imageSrc = `${baseUrl}api/v1/files/image/${row.imgAtchFileId}/${row.imgAtchFileSn}`;

  return (
    <img
      src={imageSrc}
      alt={row.bnrTtl}
      style={{ width: '82px', height: '25px', objectFit: 'cover' }}
      onError={() => setIsError(true)}
    />
  );
}

// 관리 버튼 생성기 (Popup과 동일한 구조)
const createManageCell =
  (onEdit, onToggleUseYn) =>
  ({ row }) => {
    return (
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <Button
          btnType="edit"
          btnNames="수정"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
        />
        <Button
          btnType="edit"
          btnNames={row.useYn === 'Y' ? '사용안함' : '사용'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleUseYn(row);
          }}
        />
      </div>
    );
  };

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
        id: item.bnrId, // GridTable용 고유 ID
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
      // 💡 핵심: 서버 응답 데이터 추출 구조를 Popup과 일치시킴
      // const data = response.data?.data || response.data;
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
      // 💡 Popup과 동일하게 post 호출
      await http.post(`/api/v1/banners/update/${row.bnrId}/use-yn`);
      fetchBannerList();
      if (selectedBnrId === row.bnrId) {
        fetchBannerDetail(row.bnrId);
      }
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      alert('사용여부 변경에 실패했습니다.');
    }
  };

  // 💡 컬럼 정의 (Popup의 방식을 그대로 적용)
  const bannerColumns = [
    { id: 'bnrId', width: 60, header: '번호' },
    { id: 'image_col', width: 100, header: '이미지', cell: ImageCell },
    { id: 'bnrPstnSeCdNm', width: 100, header: '배너구분' },
    { id: 'bnrTtl', flexgrow: 1, header: '제목' },
    {
      id: 'pstgPeriod',
      width: 200,
      header: '게시기간',
      cell: ({ row }) => `${row.pstgBgngYmd} ~ ${row.pstgEndYmd}`,
    },
    { id: 'useYn', width: 80, header: '사용여부' },
    {
      id: 'management',
      width: 160,
      header: '관리',
      cell: createManageCell(handleEdit, handleToggleUseYn),
    },
  ];

  // const handleFormSave = async (
  //   formData,
  //   imgFile,
  //   moblImgFile,
  //   fileStatusInfoJson
  // ) => {
  //   try {
  //     const fd = new FormData();
  //     fd.append(
  //       'request',
  //       new Blob([JSON.stringify(formData)], { type: 'application/json' })
  //     );
  //     if (imgFile) fd.append('imgFile', imgFile);
  //     if (moblImgFile) fd.append('moblImgFile', moblImgFile);
  //     if (fileStatusInfoJson)
  //       fd.append('fileStatusInfoJson', fileStatusInfoJson);
  //
  //     if (selectedBnrId) {
  //       await http.post(`/api/v1/banners/update/${selectedBnrId}`, fd);
  //       alert('배너가 수정되었습니다.');
  //       await fetchBannerDetail(selectedBnrId);
  //       setRightPanel('detail');
  //     } else {
  //       await http.post('/api/v1/banners', fd);
  //       alert('배너가 등록되었습니다.');
  //       setRightPanel(null);
  //     }
  //     fetchBannerList();
  //   } catch (error) {
  //     alert(error.response?.data?.message || '저장 실패');
  //   }
  // };
  const handleFormSave = async (
    formData,
    imgFile,
    moblImgFile,
    fileStatusInfoJson
  ) => {
    try {
      const fd = new FormData();

      // 1. DTO (Blob으로 감싸서 정확한 타입 명시)
      fd.append(
        'request',
        new Blob([JSON.stringify(formData)], { type: 'application/json' })
      );

      // 2. 파일 추가
      if (imgFile) fd.append('imgFile', imgFile);
      if (moblImgFile) fd.append('moblImgFile', moblImgFile);
      if (fileStatusInfoJson) {
        fd.append('fileStatusInfoJson', fileStatusInfoJson);
      }

      // // 3. 삭제 정보 (문자열로 전송)
      // if (fileStatusInfoJson) {
      //   fd.append(
      //     'fileStatusInfoJson',
      //     typeof fileStatusInfoJson === 'string'
      //       ? fileStatusInfoJson
      //       : JSON.stringify(fileStatusInfoJson)
      //   );
      // }
      //
      // // 💡 수정 포인트: headers 추가
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // };

      if (selectedBnrId) {
        // url, data, config 순서 확인
        await http.post(`/api/v1/banners/update/${selectedBnrId}`, fd, {
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
      console.error('저장 실패:', error);
      alert(error.response?.data?.message || '배너 저장에 실패했습니다.');
    }
  };

  const handleFormDelete = async () => {
    if (!setSelectedBnrId) return;
    if (!window.confirm('배너를 삭제하시겠습니까?')) return;
    try {
      await http.post(`/api/v1/banners/delete/${setSelectedBnrId}`);
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
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="oncontent">
          <div className="ongrid-form">
            <div className="onselect-form">
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="배너구분"
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
                  value={search.bnrTtl}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, bnrTtl: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="게시기간"
                    value={search.pstgBgngYmdFrom}
                    onChange={(val) =>
                      setSearch((prev) => ({ ...prev, pstgBgngYmdFrom: val }))
                    }
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    value={search.pstgEndYmdTo}
                    onChange={(val) =>
                      setSearch((prev) => ({ ...prev, pstgEndYmdTo: val }))
                    }
                  />
                </div>
                <MenuInputBox
                  menuType="select"
                  menuName="사용여부"
                  options={USE_YN_OPTIONS}
                  value={search.useYn}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, useYn: e.target.value }))
                  }
                />
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
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
            <GridTable
              data={bannerList}
              columns={bannerColumns}
              gridProps={{
                onSelectRow: (ev) => {
                  const rowData = bannerList.find((item) => item.id === ev.id);
                  if (rowData) handleRowClick(rowData);
                },
              }}
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
